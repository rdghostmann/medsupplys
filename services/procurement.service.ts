// /services/procurement.service.ts

"use server";

import crypto from "crypto";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

import { connectToDB } from "@/lib/connectToDB";
import { authOptions } from "@/auth";

import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { User } from "@/models/User";

import {
    Procurement,
    type SupplierCandidateStatus,
} from "@/models/Procurement";

import { Wallet } from "@/models/Wallet";
import { WalletTransaction } from "@/models/WalletTransaction";

import { CreditAccount } from "@/models/CreditAccount";
import { CreditTransaction } from "@/models/CreditTransaction";

import { Notification } from "@/models/Notification";
import { AuditLog } from "@/models/AuditLog";

import {
    matchSuppliers,
    type SupplierScoreBreakdown,
} from "@/services/supplier-matching.service";

/* =========================================================
   Types
   ========================================================= */

export type ProcurementPaymentMethod =
    | "WALLET"
    | "CREDIT"
    | "WALLET_AND_CREDIT";

export interface CreateProcurementInput {
    productId: string;
    supplierProductId: string;
    quantity: number;

    paymentMethod: ProcurementPaymentMethod;

    /**
     * Required only when paymentMethod ===
     * "WALLET_AND_CREDIT".
     *
     * The server still clamps and validates the
     * final allocation against totalAmount.
     */
    splitWalletAmount?: number;

    deliveryAddress: string;
    notes?: string;
}

export interface CreateProcurementResult {
    success: true;

    procurement: {
        id: string;
        procurementNumber: string;
        status: string;

        totalAmount: number;
        walletAmount: number;
        creditAmount: number;

        supplierName: string;
        supplierType: string;

        quantity: number;
        unitPrice: number;
    };
}

/**
 * Local snapshot type used when creating the procurement.
 *
 * This deliberately uses SupplierCandidateStatus so TypeScript
 * does not widen "CONTACTED" / "QUEUED" to string.
 */
type ProcurementSupplierCandidateSnapshot = {
    supplierId: Types.ObjectId;
    supplierName: string;
    supplierType: string;
    supplierProductId: Types.ObjectId;
    unitPrice: number;
    totalPrice: number;
    stock: number;
    rank: number;
    score: number;
    status: SupplierCandidateStatus;
};

/* =========================================================
   Constants
   ========================================================= */

/**
 * Must remain aligned with the supplier matching engine.
 */
const MATCHING_WEIGHTS = {
    priceWeight: 35,
    stockWeight: 20,
    ratingWeight: 15,
    fulfillmentWeight: 15,
    deliveryWeight: 10,
    supplierTypeWeight: 5,
} as const;

/**
 * Procurement reservation expiry.
 *
 * The current workflow reserves wallet/credit funds while
 * the supplier is being contacted.
 */
const PROCUREMENT_EXPIRY_MS =
    24 * 60 * 60 * 1000;

/* =========================================================
   Helpers
   ========================================================= */

function generateProcurementNumber(): string {
    const date = new Date();

    const yyyy =
        date.getFullYear();

    const mm =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const dd =
        String(
            date.getDate()
        ).padStart(2, "0");

    const random =
        crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();

    return `PROC-${yyyy}${mm}${dd}-${random}`;
}

function generateReference(
    prefix: string
): string {
    const random =
        crypto
            .randomBytes(8)
            .toString("hex")
            .toUpperCase();

    return `${prefix}-${Date.now()}-${random}`;
}

function assertObjectId(
    value: string,
    field: string
): Types.ObjectId {
    if (
        !Types.ObjectId.isValid(value)
    ) {
        throw new Error(
            `Invalid ${field}.`
        );
    }

    return new Types.ObjectId(value);
}

function normalizeId(
    value: unknown
): string {
    return String(value);
}

function normalizeString(
    value: unknown
): string {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

/* =========================================================
   Main Service
   ========================================================= */

export async function createProcurement(
    input: CreateProcurementInput
): Promise<CreateProcurementResult> {
    /* =======================================================
       Authentication
       ======================================================= */

    const authSession =
        await getServerSession(
            authOptions
        );

    const currentUser =
        authSession?.user;

    if (!currentUser?.id) {
        throw new Error(
            "You must be authenticated to create a procurement."
        );
    }

    const buyerId =
        assertObjectId(
            String(currentUser.id),
            "buyer"
        );

    /* =======================================================
       Input Validation
       ======================================================= */

    const productId =
        assertObjectId(
            input.productId,
            "product"
        );

    const supplierProductId =
        assertObjectId(
            input.supplierProductId,
            "supplier listing"
        );

    const quantity =
        Math.floor(
            Number(input.quantity)
        );

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        throw new Error(
            "Procurement quantity must be greater than zero."
        );
    }

    const deliveryAddress =
        String(
            input.deliveryAddress ?? ""
        ).trim();

    if (!deliveryAddress) {
        throw new Error(
            "Delivery address is required."
        );
    }

    const paymentMethods: ProcurementPaymentMethod[] =
        [
            "WALLET",
            "CREDIT",
            "WALLET_AND_CREDIT",
        ];

    if (
        !paymentMethods.includes(
            input.paymentMethod
        )
    ) {
        throw new Error(
            "Invalid procurement payment method."
        );
    }

    /* =======================================================
       Database
       ======================================================= */

    await connectToDB();

    /* =======================================================
       Buyer
       ======================================================= */

    const buyer =
        await User.findById(
            buyerId
        )
            .select({
                _id: 1,
                role: 1,
                status: 1,
                fullName: 1,
                organizationName: 1,
                name: 1,
                username: 1,
            })
            .lean();

    if (!buyer) {
        throw new Error(
            "Buyer account could not be found."
        );
    }

    if (
        normalizeString(
            buyer.role
        ) !== "buyer"
    ) {
        throw new Error(
            "Only buyer accounts can create procurements."
        );
    }

    if (
        buyer.status &&
        normalizeString(
            buyer.status
        ) !== "active"
    ) {
        throw new Error(
            "Buyer account is not active."
        );
    }

    const buyerName =
        String(
            buyer.organizationName ??
            buyer.username ?? "Buyer"
        ).trim();

    /* =======================================================
       Product
       ======================================================= */

    const product =
        await Product.findOne({
            _id: productId,
            status: "ACTIVE",
        })
            .select({
                _id: 1,
                name: 1,
                unit: 1,
            })
            .lean();

    if (!product) {
        throw new Error(
            "The requested product is no longer available."
        );
    }

    /* =======================================================
       Re-run Matching Engine
       
       The browser selection is advisory only.

       The server independently evaluates the current
       supplier pool before creating the procurement.
       ======================================================= */

    const matches =
        await matchSuppliers(
            productId.toString(),
            quantity
        );

    const eligibleMatches =
        matches.filter(
            (
                match: SupplierScoreBreakdown
            ) =>
                match.isEligible
        );

    if (
        eligibleMatches.length === 0
    ) {
        throw new Error(
            "No eligible supplier is currently available for this quantity."
        );
    }

    /* =======================================================
       Selected Supplier
       ======================================================= */

    const selectedSupplier =
        eligibleMatches.find(
            (
                supplier: SupplierScoreBreakdown
            ) =>
                normalizeId(
                    supplier.supplierProductId
                ) ===
                supplierProductId.toString()
        );

    if (!selectedSupplier) {
        throw new Error(
            "The selected supplier is no longer eligible for this quantity."
        );
    }

    /* =======================================================
       Selected Supplier Rank
       ======================================================= */

    const selectedIndex =
        eligibleMatches.findIndex(
            (
                match: SupplierScoreBreakdown
            ) =>
                normalizeId(
                    match.supplierProductId
                ) ===
                supplierProductId.toString()
        );

    if (
        selectedIndex < 0
    ) {
        throw new Error(
            "Selected supplier is not present in the eligible supplier pool."
        );
    }

    /* =======================================================
       Authoritative SupplierProduct
       ======================================================= */

    const supplierProduct =
        await SupplierProduct.findOne({
            _id: supplierProductId,
            productId,
        }).lean();

    if (!supplierProduct) {
        throw new Error(
            "The selected supplier listing no longer exists."
        );
    }

    /* =======================================================
       Authoritative Supplier ID
       ======================================================= */

    const supplierId =
        assertObjectId(
            selectedSupplier.supplierId,
            "supplier"
        );

    /*
     * Ensure the selected listing actually belongs to
     * the supplier returned by the matching engine.
     *
     * This protects against stale or inconsistent matching
     * data.
     */
    if (
        normalizeId(
            supplierProduct.supplierId
        ) !== supplierId.toString()
    ) {
        throw new Error(
            "Supplier listing ownership could not be verified."
        );
    }

    /* =======================================================
       Authoritative Supplier
       ======================================================= */

    const supplier =
        await User.findById(
            supplierId
        )
            .select({
                _id: 1,
                role: 1,
                status: 1,
                supplierApprovalStatus: 1,
                organizationName: 1,
                fullName: 1,
                name: 1,
            })
            .lean();

    if (!supplier) {
        throw new Error(
            "The selected supplier account no longer exists."
        );
    }

    if (
        normalizeString(
            supplier.role
        ) !== "supplier"
    ) {
        throw new Error(
            "The selected account is not a valid supplier."
        );
    }

    if (
        normalizeString(
            supplier.status
        ) !== "active"
    ) {
        throw new Error(
            "The selected supplier is not active."
        );
    }

    if (
        normalizeString(
            supplier.supplierApprovalStatus
        ) !== "approved"
    ) {
        throw new Error(
            "The selected supplier is not approved."
        );
    }

    /* =======================================================
       Authoritative Listing Validation
       ======================================================= */

    if (
        supplierProduct.status !==
        "AVAILABLE"
    ) {
        throw new Error(
            "The selected supplier listing is no longer available."
        );
    }

    if (
        supplierProduct.isFlagged
    ) {
        throw new Error(
            "The selected supplier listing is currently unavailable."
        );
    }

    if (
        quantity <
        supplierProduct.minOrderQuantity
    ) {
        throw new Error(
            `Minimum order quantity is ${supplierProduct.minOrderQuantity}.`
        );
    }

    if (
        quantity >
        supplierProduct.maxOrderQuantity
    ) {
        throw new Error(
            `Maximum order quantity is ${supplierProduct.maxOrderQuantity}.`
        );
    }

    if (
        supplierProduct.stock <
        quantity
    ) {
        throw new Error(
            "The selected supplier no longer has sufficient stock."
        );
    }

    if (
        !supplierProduct.nafdacRegNumber
            ?.trim()
    ) {
        throw new Error(
            "Supplier NAFDAC registration is missing."
        );
    }

    if (
        !supplierProduct.batchNumber
            ?.trim()
    ) {
        throw new Error(
            "Supplier batch information is missing."
        );
    }

    const now =
        new Date();

    const expiryDate =
        new Date(
            supplierProduct.expiryDate
        );

    if (
        !Number.isFinite(
            expiryDate.getTime()
        ) ||
        expiryDate <= now
    ) {
        throw new Error(
            "The selected supplier batch has expired."
        );
    }

    /* =======================================================
       Price Validation
       ======================================================= */

    const unitPrice =
        Number(
            supplierProduct.finalPrice
        );

    if (
        !Number.isFinite(
            unitPrice
        ) ||
        unitPrice <= 0
    ) {
        throw new Error(
            "Supplier pricing is invalid."
        );
    }

    /*
     * Matching determines supplier eligibility/ranking,
     * but price is always re-read from the authoritative
     * SupplierProduct document.
     */
    if (
        Number(
            selectedSupplier.finalPrice
        ) !== unitPrice
    ) {
        throw new Error(
            "Supplier pricing changed. Please refresh the supplier pool and try again."
        );
    }

    const totalAmount =
        Math.round(
            unitPrice * quantity
        );

    if (
        totalAmount <= 0
    ) {
        throw new Error(
            "Procurement total must be greater than zero."
        );
    }

    /* =======================================================
       Payment Allocation
       ======================================================= */

    let walletAmount = 0;
    let creditAmount = 0;

    switch (
    input.paymentMethod
    ) {
        case "WALLET": {
            walletAmount =
                totalAmount;

            break;
        }

        case "CREDIT": {
            creditAmount =
                totalAmount;

            break;
        }

        case "WALLET_AND_CREDIT": {
            const requestedWalletAmount =
                Math.round(
                    Number(
                        input.splitWalletAmount ??
                        0
                    )
                );

            if (
                !Number.isFinite(
                    requestedWalletAmount
                )
            ) {
                throw new Error(
                    "Invalid wallet amount for split payment."
                );
            }

            walletAmount =
                Math.min(
                    totalAmount,
                    Math.max(
                        0,
                        requestedWalletAmount
                    )
                );

            creditAmount =
                totalAmount -
                walletAmount;

            break;
        }

        default: {
            throw new Error(
                "Invalid procurement payment method."
            );
        }
    }

    if (
        walletAmount < 0 ||
        creditAmount < 0 ||
        walletAmount +
        creditAmount !==
        totalAmount
    ) {
        throw new Error(
            "Payment allocation does not equal the procurement total."
        );
    }

    /*
     * A split payment must contain at least one
     * actual funding source.
     */
    if (
        input.paymentMethod ===
        "WALLET_AND_CREDIT" &&
        walletAmount <= 0 &&
        creditAmount <= 0
    ) {
        throw new Error(
            "At least one payment source must contain funds."
        );
    }

    /* =======================================================
       Supplier Candidate Snapshot
       
       IMPORTANT:
       Explicitly typing status as SupplierCandidateStatus
       prevents TypeScript from widening the ternary result
       to string.
       ======================================================= */

    const supplierCandidates:
        ProcurementSupplierCandidateSnapshot[] =
        eligibleMatches.map(
            (
                match: SupplierScoreBreakdown,
                index: number
            ) => ({
                supplierId:
                    assertObjectId(
                        match.supplierId,
                        "supplier"
                    ),

                supplierName:
                    match.supplierName,

                supplierType:
                    match.supplierType,

                supplierProductId:
                    assertObjectId(
                        match.supplierProductId,
                        "supplier listing"
                    ),

                unitPrice:
                    Number(
                        match.finalPrice
                    ),

                totalPrice:
                    Math.round(
                        Number(
                            match.finalPrice
                        ) *
                        quantity
                    ),

                stock:
                    match.stock,

                rank:
                    index + 1,

                score:
                    Math.round(
                        match.totalScore *
                        100
                    ) / 100,

                status:
                    index ===
                        selectedIndex
                        ? ("CONTACTED" as SupplierCandidateStatus)
                        : ("QUEUED" as SupplierCandidateStatus),
            })
        );

    /* =======================================================
       Procurement Number
       ======================================================= */

    const procurementNumber =
        generateProcurementNumber();

    /* =======================================================
       MongoDB Transaction
       ======================================================= */

    const session =
        await Procurement.db.startSession();

    try {
        const createdProcurement =
            await session.withTransaction(
            async () => {
                /* ==============================================
                   Create Procurement
                   ============================================== */

                const procurementDocs =
                    await Procurement.create(
                        [
                            {
                                procurementNumber,

                                buyerId,

                                buyerName,

                                items: [
                                    {
                                        productId,

                                        productName:
                                            product.name,

                                        supplierProductId,

                                        supplierId,

                                        supplierName:
                                            selectedSupplier.supplierName,

                                        supplierType:
                                            selectedSupplier.supplierType,

                                        quantity,

                                        unit:
                                            supplierProduct.unit ??
                                            product.unit,

                                        unitPrice,

                                        totalPrice:
                                            totalAmount,

                                        preferredSupplierType:
                                            selectedSupplier.supplierType,
                                    },
                                ],

                                /*
                                 * Supplier has been selected
                                 * and is being contacted.
                                 */
                                status:
                                    "SUPPLIER_CONTACTED",

                                supplierCandidates,

                                currentSupplierIndex:
                                    selectedIndex,

                                currentSupplierId:
                                    supplierId,

                                currentSupplierName:
                                    selectedSupplier.supplierName,

                                attemptHistory: [
                                    {
                                        attemptNumber:
                                            1,

                                        supplierId,

                                        supplierName:
                                            selectedSupplier.supplierName,

                                        supplierType:
                                            selectedSupplier.supplierType,

                                        offeredPrice:
                                            unitPrice,

                                        status:
                                            "CONTACTED",

                                        contactedAt:
                                            new Date(),
                                    },
                                ],

                                deliveryAddress,

                                notes:
                                    input.notes
                                        ?.trim() ||
                                    undefined,

                                /*
                                 * Snapshot the exact weights
                                 * used by the matching engine.
                                 */
                                matchingWeightsSnapshot:
                                    MATCHING_WEIGHTS,

                                /*
                                 * Financial snapshot.
                                 */
                                financials: {
                                    paymentMethod:
                                        input.paymentMethod,

                                    totalAmount,

                                    walletAmount,

                                    creditAmount,

                                    currency:
                                        "NGN",
                                },

                                expiresAt:
                                    new Date(
                                        Date.now() +
                                        PROCUREMENT_EXPIRY_MS
                                    ),
                            },
                        ],
                        {
                            session,
                        }
                    );

                const createdProcurement =
                    procurementDocs[0];

                const procurementId =
                    createdProcurement._id;

                /* ==============================================
                   Wallet Reservation
                   ============================================== */

                if (
                    walletAmount > 0
                ) {
                    /*
                     * Atomic balance check + update.
                     *
                     * This prevents two simultaneous procurement
                     * requests from spending the same wallet balance.
                     */
                    const wallet =
                        await Wallet.findOneAndUpdate(
                            {
                                buyerId,

                                status:
                                    "ACTIVE",

                                availableBalance:
                                {
                                    $gte:
                                        walletAmount,
                                },
                            },
                            {
                                $inc: {
                                    availableBalance:
                                        -walletAmount,

                                    heldBalance:
                                        walletAmount,
                                },
                            },
                            {
                                new: true,
                                session,
                            }
                        );

                    if (!wallet) {
                        throw new Error(
                            "Insufficient wallet balance or wallet is not active."
                        );
                    }

                    const balanceBefore =
                        wallet.availableBalance +
                        walletAmount;

                    await WalletTransaction.create(
                        [
                            {
                                walletId:
                                    wallet._id,

                                buyerId,

                                type:
                                    "HOLD",

                                amount:
                                    walletAmount,

                                direction:
                                    "DEBIT",

                                balanceBefore,

                                balanceAfter:
                                    wallet.availableBalance,

                                reference:
                                    generateReference(
                                        "WALLET-HOLD"
                                    ),

                                description:
                                    `Wallet funds reserved for procurement ${procurementNumber}`,

                                status:
                                    "SUCCESS",

                                source:
                                    "ORDER",

                                procurementId,

                                metadata: {
                                    procurementNumber,

                                    productId:
                                        productId.toString(),

                                    supplierProductId:
                                        supplierProductId.toString(),

                                    heldBalance:
                                        wallet.heldBalance,
                                },
                            },
                        ],
                        {
                            session,
                        }
                    );
                }

                /* ==============================================
                   Credit Commitment
                   ============================================== */

                if (
                    creditAmount > 0
                ) {
                    /*
                     * Atomic credit availability check + update.
                     */
                    const creditAccount =
                        await CreditAccount.findOneAndUpdate(
                            {
                                buyerId,

                                status:
                                    "ACTIVE",

                                availableCredit:
                                {
                                    $gte:
                                        creditAmount,
                                },
                            },
                            {
                                $inc: {
                                    availableCredit:
                                        -creditAmount,

                                    creditUsed:
                                        creditAmount,

                                    outstandingBalance:
                                        creditAmount,
                                },
                            },
                            {
                                new: true,
                                session,
                            }
                        );

                    if (
                        !creditAccount
                    ) {
                        throw new Error(
                            "Insufficient available credit or credit facility is not active."
                        );
                    }

                    const balanceBefore =
                        creditAccount.availableCredit +
                        creditAmount;

                    await CreditTransaction.create(
                        [
                            {
                                creditAccountId:
                                    creditAccount._id,

                                buyerId,

                                type:
                                    "CREDIT_PURCHASE",

                                amount:
                                    creditAmount,

                                direction:
                                    "CHARGE",

                                balanceBefore,

                                balanceAfter:
                                    creditAccount.availableCredit,

                                reference:
                                    generateReference(
                                        "CREDIT-CHARGE"
                                    ),

                                procurementId,

                                description:
                                    `Credit facility committed for procurement ${procurementNumber}`,

                                metadata: {
                                    procurementNumber,

                                    productId:
                                        productId.toString(),

                                    supplierProductId:
                                        supplierProductId.toString(),
                                },
                            },
                        ],
                        {
                            session,
                        }
                    );
                }

                /* ==============================================
                 Buyer Notification
                 ============================================== */

                // await Notification.create(
                //     [
                //         {
                //             recipientId: buyerId,

                //             recipientRole: "buyer",

                //             title: "Procurement request created",

                //             message:
                //                 `Procurement ${procurementNumber} has been created for ${quantity.toLocaleString()} ${supplierProduct.unit} of ${product.name}. ${selectedSupplier.supplierName} is currently being contacted.`,

                //             type: "ORDER",

                //             isRead: false,

                //             entityType: "Procurement",

                //             entityId: procurementId,
                //         },
                //     ],
                //     {
                //         session,
                //     }
                // );

                /* ==============================================
                   Supplier Notification
                   ============================================== */

                // await Notification.create(
                //     [
                //         {
                //             recipientId: supplierId,

                //             recipientRole: "supplier",

                //             title: "New procurement request",

                //             message:
                //                 `You have received procurement ${procurementNumber} for ${quantity.toLocaleString()} ${supplierProduct.unit} of ${product.name}. Please review and respond.`,

                //             type: "SUPPLIER",

                //             isRead: false,

                //             entityType: "Procurement",

                //             entityId: procurementId,
                //         },
                //     ],
                //     {
                //         session,
                //     }
                // );

                /* ==============================================
                   Audit Log — Procurement Created
                   ============================================== */

                await AuditLog.create(
                    [
                        {
                            actorId:
                                buyerId,

                            actorType:
                                "BUYER",

                            action:
                                "PROCUREMENT_CREATED",

                            entityType:
                                "Procurement",

                            entityId:
                                procurementId,

                            description:
                                `Buyer created procurement ${procurementNumber}.`,

                            metadata: {
                                procurementNumber,

                                productId:
                                    productId.toString(),

                                productName:
                                    product.name,

                                supplierId:
                                    supplierId.toString(),

                                supplierProductId:
                                    supplierProductId.toString(),

                                supplierName:
                                    selectedSupplier.supplierName,

                                supplierType:
                                    selectedSupplier.supplierType,

                                quantity,

                                unit:
                                    supplierProduct.unit ??
                                    product.unit,

                                unitPrice,

                                totalAmount,

                                paymentMethod:
                                    input.paymentMethod,

                                walletAmount,

                                creditAmount,
                            },
                        },
                    ],
                    {
                        session,
                    }
                );

                /* ==============================================
                   Audit Log — Wallet Reservation
                   ============================================== */

                if (
                    walletAmount > 0
                ) {
                    await AuditLog.create(
                        [
                            {
                                actorId:
                                    buyerId,

                                actorType:
                                    "BUYER",

                                action:
                                    "PAYMENT_RESERVED",

                                entityType:
                                    "Procurement",

                                entityId:
                                    procurementId,

                                description:
                                    `₦${walletAmount.toLocaleString()} wallet funds reserved for procurement ${procurementNumber}.`,

                                metadata: {
                                    procurementNumber,

                                    paymentMethod:
                                        input.paymentMethod,

                                    walletAmount,

                                    creditAmount,
                                },
                            },
                        ],
                        {
                            session,
                        }
                    );
                }

                /* ==============================================
                   Audit Log — Credit Commitment
                   ============================================== */

                if (
                    creditAmount > 0
                ) {
                    await AuditLog.create(
                        [
                            {
                                actorId:
                                    buyerId,

                                actorType:
                                    "BUYER",

                                action:
                                    "PAYMENT_CHARGED",

                                entityType:
                                    "Procurement",

                                entityId:
                                    procurementId,

                                description:
                                    `₦${creditAmount.toLocaleString()} credit facility committed to procurement ${procurementNumber}.`,

                                metadata: {
                                    procurementNumber,

                                    paymentMethod:
                                        input.paymentMethod,

                                    walletAmount,

                                    creditAmount,
                                },
                            },
                        ],
                        {
                            session,
                        }
                    );
                }

                /* ==============================================
                   Audit Log — Supplier Contact
                   ============================================== */

                await AuditLog.create(
                    [
                        {
                            actorId:
                                buyerId,

                            actorType:
                                "BUYER",

                            action:
                                "SUPPLIER_CONTACTED",

                            entityType:
                                "Procurement",

                            entityId:
                                procurementId,

                            description:
                                `Supplier ${selectedSupplier.supplierName} was selected and contacted for procurement ${procurementNumber}.`,

                            metadata: {
                                procurementNumber,

                                supplierId:
                                    supplierId.toString(),

                                supplierProductId:
                                    supplierProductId.toString(),

                                supplierName:
                                    selectedSupplier.supplierName,

                                supplierType:
                                    selectedSupplier.supplierType,

                                rank:
                                    selectedIndex + 1,

                                score:
                                    selectedSupplier.totalScore,
                            },
                        },
                    ],
                    {
                        session,
                    }
                );

                return createdProcurement;
            }
        );

        /* =====================================================
           Transaction Completed
           ===================================================== */

        /* =====================================================
           Safe Client Response
           ===================================================== */

      return {
    success: true,

    procurement: {
        id: createdProcurement._id.toString(),

        procurementNumber:
            createdProcurement.procurementNumber,

        status:
            createdProcurement.status,

        totalAmount,

        walletAmount,

        creditAmount,

        supplierName:
            selectedSupplier.supplierName,

        supplierType:
            selectedSupplier.supplierType,

        quantity,

        unitPrice,
    },
};
    } finally {
        await session.endSession();
    }
}
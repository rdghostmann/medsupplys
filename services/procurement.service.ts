// /services/procurement.service.ts

"use server";

import crypto from "crypto";
import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";
import { getCurrentUser } from "@/auth";

import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { User } from "@/models/User";

import { Procurement } from "@/models/Procurement";

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

/* =========================================================
   Helpers
   ========================================================= */

function generateProcurementNumber(): string {
    const date = new Date();

    const yyyy = date.getFullYear();

    const mm = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const dd = String(
        date.getDate()
    ).padStart(2, "0");

    const random = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `PROC-${yyyy}${mm}${dd}-${random}`;
}

function generateReference(
    prefix: string
): string {
    const random = crypto
        .randomBytes(8)
        .toString("hex")
        .toUpperCase();

    return `${prefix}-${Date.now()}-${random}`;
}

function normalizeId(
    value: unknown
): string {
    return String(value);
}

function assertObjectId(
    value: string,
    field: string
): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
        throw new Error(
            `Invalid ${field}.`
        );
    }

    return new Types.ObjectId(value);
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

    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        throw new Error(
            "You must be authenticated to create a procurement."
        );
    }

    const buyerId = assertObjectId(
        String(currentUser.id),
        "buyer"
    );

    /* =======================================================
       Input Validation
       ======================================================= */

    const productId = assertObjectId(
        input.productId,
        "product"
    );

    const supplierProductId =
        assertObjectId(
            input.supplierProductId,
            "supplier listing"
        );

    const quantity = Math.floor(
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
        input.deliveryAddress.trim();

    if (!deliveryAddress) {
        throw new Error(
            "Delivery address is required."
        );
    }

    if (
        ![
            "WALLET",
            "CREDIT",
            "WALLET_AND_CREDIT",
        ].includes(input.paymentMethod)
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

    const buyer = await User.findById(
        buyerId
    ).lean();

    if (!buyer) {
        throw new Error(
            "Buyer account could not be found."
        );
    }

    if (
        String(
            (buyer as { role?: string }).role ?? ""
        ).toLowerCase() !== "buyer"
    ) {
        throw new Error(
            "Only buyer accounts can create procurements."
        );
    }

    const buyerName =
        String(
            (buyer as {
                fullName?: string;
                organizationName?: string;
                name?: string;
            }).organizationName ??
            (buyer as {
                fullName?: string;
            }).fullName ??
            (buyer as {
                name?: string;
            }).name ??
            "Buyer"
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
       
       IMPORTANT:
       Never trust the SupplierScoreBreakdown sent by
       the browser.
       ======================================================= */

    const matches =
        await matchSuppliers(
            input.productId,
            quantity
        );

    const selectedSupplier =
        matches.find(
            (
                supplier: SupplierScoreBreakdown
            ) =>
                normalizeId(
                    supplier.supplierProductId
                ) ===
                normalizeId(
                    supplierProductId
                ) &&
                supplier.isEligible
        );

    if (!selectedSupplier) {
        throw new Error(
            "The selected supplier is no longer eligible for this quantity."
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

    if (
        supplierProduct.finalPrice !==
        selectedSupplier.finalPrice
    ) {
        throw new Error(
            "Supplier pricing changed. Please refresh the supplier pool and try again."
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
        supplierProduct.stock < quantity
    ) {
        throw new Error(
            "The selected supplier no longer has sufficient stock."
        );
    }

    /* =======================================================
       Total
       ======================================================= */

    const unitPrice =
        Number(
            supplierProduct.finalPrice
        );

    if (
        !Number.isFinite(unitPrice) ||
        unitPrice <= 0
    ) {
        throw new Error(
            "Supplier pricing is invalid."
        );
    }

    const totalAmount = Math.round(
        unitPrice * quantity
    );

    if (totalAmount <= 0) {
        throw new Error(
            "Procurement total must be greater than zero."
        );
    }

    /* =======================================================
       Payment Allocation
       ======================================================= */

    let walletAmount = 0;
    let creditAmount = 0;

    if (
        input.paymentMethod ===
        "WALLET"
    ) {
        walletAmount = totalAmount;
    }

    if (
        input.paymentMethod ===
        "CREDIT"
    ) {
        creditAmount = totalAmount;
    }

    if (
        input.paymentMethod ===
        "WALLET_AND_CREDIT"
    ) {
        walletAmount = Math.min(
            totalAmount,
            Math.max(
                0,
                Math.round(
                    Number(
                        input.splitWalletAmount ?? 0
                    )
                )
            )
        );

        creditAmount =
            totalAmount -
            walletAmount;
    }

    if (
        walletAmount + creditAmount !==
        totalAmount
    ) {
        throw new Error(
            "Payment allocation does not equal the procurement total."
        );
    }

    /* =======================================================
       Start Mongo Transaction
       ======================================================= */

    const session =
        await Procurement.db.startSession();

    try {
        let createdProcurement:
            | typeof Procurement.prototype
            | null = null;

        await session.withTransaction(
            async () => {
                /* ================================================
                   Wallet
                   ================================================ */

                let wallet =
                    walletAmount > 0
                        ? await Wallet.findOne({
                            buyerId,
                        }).session(session)
                        : null;

                if (walletAmount > 0) {
                    if (!wallet) {
                        throw new Error(
                            "Buyer wallet was not found."
                        );
                    }

                    if (
                        wallet.status !== "ACTIVE"
                    ) {
                        throw new Error(
                            "Buyer wallet is not active."
                        );
                    }

                    if (
                        wallet.availableBalance <
                        walletAmount
                    ) {
                        throw new Error(
                            "Insufficient wallet balance."
                        );
                    }
                }

                /* ================================================
                   Credit Account
                   ================================================ */

                let creditAccount =
                    creditAmount > 0
                        ? await CreditAccount.findOne({
                            buyerId,
                        }).session(session)
                        : null;

                if (creditAmount > 0) {
                    if (!creditAccount) {
                        throw new Error(
                            "Buyer credit account was not found."
                        );
                    }

                    if (
                        creditAccount.status !==
                        "ACTIVE"
                    ) {
                        throw new Error(
                            "Buyer credit facility is not active."
                        );
                    }

                    if (
                        creditAccount.availableCredit <
                        creditAmount
                    ) {
                        throw new Error(
                            "Insufficient available credit."
                        );
                    }
                }

                /* ================================================
                   Procurement Candidates
                   
                   Store the ranked eligible pool as a snapshot.
                   ================================================ */

                const eligibleCandidates =
                    matches.filter(
                        (supplier) =>
                            supplier.isEligible
                    );

                const supplierCandidates =
                    eligibleCandidates.map(
                        (
                            supplier,
                            index
                        ) => ({
                            supplierId:
                                assertObjectId(
                                    supplier.supplierId,
                                    "supplier"
                                ),

                            supplierName:
                                supplier.supplierName,

                            supplierType:
                                supplier.supplierType,

                            supplierProductId:
                                assertObjectId(
                                    supplier.supplierProductId,
                                    "supplier listing"
                                ),

                            unitPrice:
                                supplier.finalPrice,

                            totalPrice:
                                Math.round(
                                    supplier.finalPrice *
                                    quantity
                                ),

                            stock:
                                supplier.stock,

                            rank:
                                index + 1,

                            score:
                                Math.round(
                                    supplier.totalScore *
                                    100
                                ) / 100,

                            status:
                                supplier.supplierProductId ===
                                    selectedSupplier.supplierProductId
                                    ? "CONTACTED"
                                    : "QUEUED",
                        })
                    );

                /* ================================================
                   Procurement
                   ================================================ */

                const procurementNumber =
                    generateProcurementNumber();

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

                                        quantity,

                                        unit:
                                            supplierProduct.unit,

                                        preferredSupplierType:
                                            selectedSupplier.supplierType,
                                    },
                                ],

                                /*
                                 * We are immediately beginning sourcing
                                 * against the selected ranked supplier.
                                 */
                                status: "SUPPLIER_CONTACTED",

                                supplierCandidates,

                                currentSupplierIndex: 0,

                                currentSupplierId:
                                    assertObjectId(
                                        selectedSupplier.supplierId,
                                        "supplier"
                                    ),

                                currentSupplierName:
                                    selectedSupplier.supplierName,

                                attemptHistory: [
                                    {
                                        attemptNumber: 1,

                                        supplierId:
                                            assertObjectId(
                                                selectedSupplier.supplierId,
                                                "supplier"
                                            ),

                                        supplierName:
                                            selectedSupplier.supplierName,

                                        supplierType:
                                            selectedSupplier.supplierType,

                                        offeredPrice:
                                            selectedSupplier.finalPrice,

                                        status:
                                            "CONTACTED",

                                        contactedAt:
                                            new Date(),
                                    },
                                ],

                                deliveryAddress,

                                notes:
                                    input.notes?.trim() ||
                                    undefined,
                                matchingWeightsSnapshot?: {
                                    priceWeight: number;
                                    stockWeight: number;
                                    ratingWeight: number;
                                    fulfillmentWeight: number;
                                    deliveryWeight: number;
                                    supplierTypeWeight: number;
                                };                           /*
                                 * Procurement should not remain open
                                 * indefinitely.
                                 */
                                expiresAt:
                                    new Date(
                                        Date.now() +
                                        24 *
                                        60 *
                                        60 *
                                        1000
                                    ),
                            },
                        ],
                        {
                            session,
                        }
                    );

                createdProcurement =
                    procurementDocs[0];

                const procurementId =
                    createdProcurement._id;

                /* ================================================
                   Wallet Reservation
                   
                   We use heldBalance rather than immediately
                   treating the money as spent.
                   ================================================ */

                if (
                    wallet &&
                    walletAmount > 0
                ) {
                    const before =
                        wallet.availableBalance;

                    wallet.availableBalance -=
                        walletAmount;

                    wallet.heldBalance +=
                        walletAmount;

                    await wallet.save({
                        session,
                    });

                    await WalletTransaction.create(
                        [
                            {
                                walletId:
                                    wallet._id,

                                buyerId,

                                type: "HOLD",

                                amount:
                                    walletAmount,

                                direction: "DEBIT",

                                balanceBefore:
                                    before,

                                balanceAfter:
                                    wallet.availableBalance,

                                reference:
                                    generateReference(
                                        "WALLET-HOLD"
                                    ),

                                description:
                                    `Wallet funds reserved for procurement ${procurementNumber}`,

                                status: "SUCCESS",

                                source: "ORDER",

                                procurementId,

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

                /* ================================================
                   Credit Reservation / Charge
                   
                   The credit facility is committed immediately.
                   ================================================ */

                if (
                    creditAccount &&
                    creditAmount > 0
                ) {
                    const before =
                        creditAccount.availableCredit;

                    creditAccount.availableCredit -=
                        creditAmount;

                    creditAccount.creditUsed +=
                        creditAmount;

                    creditAccount.outstandingBalance +=
                        creditAmount;

                    await creditAccount.save({
                        session,
                    });

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

                                balanceBefore:
                                    before,

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

                /* ================================================
                   Buyer Notification
                   ================================================ */

                await Notification.create(
                    [
                        {
                            recipientId:
                                buyerId,

                            recipientRole:
                                "buyer",

                            title:
                                "Procurement request created",

                            message:
                                `Procurement ${procurementNumber} has been created for ${quantity.toLocaleString()} ${supplierProduct.unit} of ${product.name}. ${selectedSupplier.supplierName} is currently being contacted.`,

                            type:
                                "ORDER",

                            isRead: false,

                            entityType:
                                "Procurement",

                            entityId:
                                procurementId,
                        },
                    ],
                    {
                        session,
                    }
                );

                /* ================================================
                   Supplier Notification
                   ================================================ */

                await Notification.create(
                    [
                        {
                            recipientId:
                                assertObjectId(
                                    selectedSupplier.supplierId,
                                    "supplier"
                                ),

                            recipientRole:
                                "supplier",

                            title:
                                "New procurement request",

                            message:
                                `You have received procurement ${procurementNumber} for ${quantity.toLocaleString()} ${supplierProduct.unit} of ${product.name}. Please review and respond.`,

                            type:
                                "ORDER",

                            isRead: false,

                            entityType:
                                "Procurement",

                            entityId:
                                procurementId,
                        },
                    ],
                    {
                        session,
                    }
                );

                /* ================================================
                   Audit Log — Procurement
                   ================================================ */

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
                                    selectedSupplier.supplierId,

                                supplierProductId:
                                    selectedSupplier.supplierProductId,

                                supplierName:
                                    selectedSupplier.supplierName,

                                supplierType:
                                    selectedSupplier.supplierType,

                                quantity,

                                unit:
                                    supplierProduct.unit,

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

                /* ================================================
                   Audit Log — Financial Commitment
                   ================================================ */

                if (walletAmount > 0) {
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

                if (creditAmount > 0) {
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
            }
        );

        if (!createdProcurement) {
            throw new Error(
                "Procurement creation failed."
            );
        }

        /* =====================================================
           Return Safe Client Response
           ===================================================== */

        return {
            success: true,

            procurement: {
                id:
                    createdProcurement._id.toString(),

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
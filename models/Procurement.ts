// /models/Procurement.ts

import {
    Schema,
    model,
    models,
    Document,
    Model,
} from "mongoose";

export type ProcurementStatus =
    | "DRAFT"
    | "OPEN"
    | "MATCHING"
    | "SOURCING"
    | "SUPPLIER_CONTACTED"
    | "SUPPLIER_CONFIRMED"
    | "VERIFICATION"
    | "ORDER_CREATED"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED";

export type SupplierCandidateStatus =
    | "QUEUED"
    | "CONTACTED"
    | "ACCEPTED"
    | "DECLINED"
    | "TIMEOUT"
    | "SKIPPED";

export interface IProcurementItem {
    productId: Schema.Types.ObjectId;

    productName: string;

    quantity: number;

    unit: string;

    preferredSupplierType?: string;

    requiredByDate?: Date;
}

export interface ISupplierCandidate {
    supplierId: Schema.Types.ObjectId;

    supplierName: string;

    supplierType: string;

    supplierProductId: Schema.Types.ObjectId;

    unitPrice: number;

    totalPrice: number;

    stock: number;

    rank: number;

    score: number;

    status: SupplierCandidateStatus;
}

export interface IProcurementAttempt {
    attemptNumber: number;

    supplierId: Schema.Types.ObjectId;

    supplierName: string;

    supplierType: string;

    offeredPrice?: number;

    status: SupplierCandidateStatus;

    contactedAt?: Date;

    respondedAt?: Date;
}

export interface IProcurement extends Document {
    procurementNumber: string;

    buyerId: Schema.Types.ObjectId;

    buyerName: string;

    items: IProcurementItem[];

    status: ProcurementStatus;

    supplierCandidates: ISupplierCandidate[];

    currentSupplierIndex: number;

    currentSupplierId?: Schema.Types.ObjectId;

    currentSupplierName?: string;

    attemptHistory: IProcurementAttempt[];

    deliveryAddress: string;

    notes?: string;

    matchingWeightsSnapshot?: {
        availabilityWeight: number;
        priceWeight: number;
        supplierTypeWeight: number;
        fulfillmentWeight: number;
        reliabilityWeight: number;
    };

    expiresAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

const ProcurementItemSchema =
    new Schema<IProcurementItem>(
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            productName: {
                type: String,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            unit: {
                type: String,
                required: true,
            },

            preferredSupplierType: String,

            requiredByDate: Date,
        },
        { _id: false }
    );

const SupplierCandidateSchema =
    new Schema<ISupplierCandidate>(
        {
            supplierId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            supplierName: {
                type: String,
                required: true,
            },

            supplierType: {
                type: String,
                required: true,
            },

            supplierProductId: {
                type: Schema.Types.ObjectId,
                ref: "SupplierProduct",
                required: true,
            },

            unitPrice: {
                type: Number,
                required: true,
                min: 0,
            },

            totalPrice: {
                type: Number,
                required: true,
                min: 0,
            },

            stock: {
                type: Number,
                required: true,
                min: 0,
            },

            rank: {
                type: Number,
                required: true,
            },

            score: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            status: {
                type: String,
                enum: [
                    "QUEUED",
                    "CONTACTED",
                    "ACCEPTED",
                    "DECLINED",
                    "TIMEOUT",
                    "SKIPPED",
                ],
                default: "QUEUED",
            },
        },
        { _id: false }
    );

const ProcurementAttemptSchema =
    new Schema<IProcurementAttempt>(
        {
            attemptNumber: {
                type: Number,
                required: true,
            },

            supplierId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            supplierName: {
                type: String,
                required: true,
            },

            supplierType: {
                type: String,
                required: true,
            },

            offeredPrice: Number,

            status: {
                type: String,
                enum: [
                    "QUEUED",
                    "CONTACTED",
                    "ACCEPTED",
                    "DECLINED",
                    "TIMEOUT",
                    "SKIPPED",
                ],
                required: true,
            },

            contactedAt: Date,
            respondedAt: Date,
        },
        { _id: false }
    );

const ProcurementSchema =
    new Schema<IProcurement>(
        {
            procurementNumber: {
                type: String,
                required: true,
                unique: true,
                index: true,
            },

            buyerId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            buyerName: {
                type: String,
                required: true,
            },

            items: {
                type: [ProcurementItemSchema],
                required: true,
                validate: {
                    validator: (items: unknown[]) =>
                        items.length > 0,
                    message:
                        "Procurement must contain at least one item",
                },
            },

            status: {
                type: String,
                enum: [
                    "DRAFT",
                    "OPEN",
                    "MATCHING",
                    "SOURCING",
                    "SUPPLIER_CONTACTED",
                    "SUPPLIER_CONFIRMED",
                    "VERIFICATION",
                    "ORDER_CREATED",
                    "COMPLETED",
                    "CANCELLED",
                    "EXPIRED",
                ],
                default: "DRAFT",
                index: true,
            },

            supplierCandidates: {
                type: [SupplierCandidateSchema],
                default: [],
            },

            currentSupplierIndex: {
                type: Number,
                default: 0,
            },

            currentSupplierId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },

            currentSupplierName: String,

            attemptHistory: {
                type: [ProcurementAttemptSchema],
                default: [],
            },

            deliveryAddress: {
                type: String,
                required: true,
            },

            notes: String,

            matchingWeightsSnapshot: {
                availabilityWeight: Number,
                priceWeight: Number,
                supplierTypeWeight: Number,
                fulfillmentWeight: Number,
                reliabilityWeight: Number,
            },

            expiresAt: Date,
        },
        {
            timestamps: true,
            versionKey: false,
        }
    );

ProcurementSchema.index({
    buyerId: 1,
    status: 1,
});

ProcurementSchema.index({
    status: 1,
    createdAt: -1,
});

export const Procurement: Model<IProcurement> = models.Procurement || model<IProcurement>("Procurement", ProcurementSchema);
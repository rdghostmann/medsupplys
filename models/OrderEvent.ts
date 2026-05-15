import { Schema, model, models } from "mongoose"

const OrderEventSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    supplierId: { type: Schema.Types.ObjectId, ref: "User" },

    eventType: {
      type: String,
      enum: [
        "ORDER_CREATED",
        "SUPPLIER_NOTIFIED",
        "SUPPLIER_ACCEPTED",
        "SUPPLIER_REJECTED",
        "TIMEOUT",
        "ORDER_ASSIGNED",
      ],
    },

    metadata: Object,
  },
  { timestamps: true }
)

export const OrderEvent =  models.OrderEvent || model("OrderEvent", OrderEventSchema)
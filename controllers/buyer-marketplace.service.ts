// /app/(dashboard)/buyer.marketplace.service.ts


"use server";


export async function getSupplierMatches(
  productId: string,
  quantity: number
) {
  try {
    const matches = await matchSuppliers(
      productId,
      quantity
    );

    return {
      success: true,
      matches,
    };
  } catch (error) {
    return {
      success: false,
      matches: [],
      message:
        error instanceof Error
          ? error.message
          : "Unable to match suppliers.",
    };
  }
}

export async function createBuyerProcurement(
  params: {
    buyerId: string;
    productId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    walletAmount?: number;
    creditAmount?: number;
    deliveryAddress: string;
    targetMaxUnitPrice?: number;
    selectedSupplierId?: string;
  }
) {
  try {
    const procurement =
      await procurementService.createProcurement(
        params
      );

    return {
      success: true,
      procurement,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create procurement.",
    };
  }
}
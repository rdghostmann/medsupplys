import { db } from '../db';
import {
  Procurement,
  ProcurementQueueItem,
  SupplierAttemptHistory,
  PaymentMethod,
  Order,
  OrderItem,
  SupplierType,
} from '../../types';
import { supplierMatchingService } from './matching.service';
import { walletService } from './wallet.service';
import { creditService } from './credit.service';
import { auditService } from './audit.service';
import { notificationService } from './notification.service';

export class ProcurementService {
  /**
   * Initializes a new procurement sourcing request.
   * Runs the supplier matching engine, establishes the ranked queue,
   * reserves/checks payment authorization, and contacts the Top-Ranked Supplier #1.
   */
  public createProcurement(params: {
    buyerId: string;
    productId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    walletAmount?: number;
    creditAmount?: number;
    deliveryAddress: string;
    targetMaxUnitPrice?: number;
    selectedSupplierId?: string; // Optional manual supplier pre-selection
  }): Procurement {
    const {
      buyerId,
      productId,
      quantity,
      paymentMethod,
      deliveryAddress,
      targetMaxUnitPrice,
      selectedSupplierId,
    } = params;

    const buyer = db.users.find((u) => u.id === buyerId);
    if (!buyer) throw new Error('Buyer account not found.');

    const product = db.products.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found in master catalogue.');

    if (quantity <= 0) throw new Error('Procurement quantity must be greater than 0.');

    // 1. Run the Matching Engine across the verified supplier pool
    const matches = supplierMatchingService.matchSuppliers(productId, quantity);
    const eligibleMatches = matches.filter((m) => m.isEligible);

    if (eligibleMatches.length === 0) {
      throw new Error(
        'No eligible verified suppliers currently available with adequate stock and MOQ compliance for this product.'
      );
    }

    // Build the ordered supplier queue
    let queue: ProcurementQueueItem[] = eligibleMatches.map((m, idx) => ({
      supplierId: m.supplierId,
      supplierName: m.supplierName,
      supplierType: m.supplierType,
      unitPrice: m.finalPrice,
      totalPrice: m.finalPrice * quantity,
      stock: m.stock,
      rank: idx + 1,
      score: m.totalScore,
      status: idx === 0 ? 'ACTIVE' : 'QUEUED',
    }));

    // If buyer manually picked a specific supplier, move that supplier to index 0
    if (selectedSupplierId) {
      const chosenIdx = queue.findIndex((q) => q.supplierId === selectedSupplierId);
      if (chosenIdx > 0) {
        const [chosen] = queue.splice(chosenIdx, 1);
        queue.unshift(chosen);
        queue.forEach((item, i) => {
          item.rank = i + 1;
          item.status = i === 0 ? 'ACTIVE' : 'QUEUED';
        });
      }
    }

    const currentSupplier = queue[0];
    const unitPrice = currentSupplier.unitPrice;
    const totalAmount = unitPrice * quantity;
    const baseAmount = Math.round((totalAmount / (100 + product.commissionPercent)) * 100);
    const platformCommission = totalAmount - baseAmount;

    // 2. Validate Payment availability
    let effectiveWalletAmount = 0;
    let effectiveCreditAmount = 0;

    if (paymentMethod === 'WALLET') {
      const wallet = walletService.getOrCreateWallet(buyerId, buyer.name);
      if (wallet.balance < totalAmount) {
        throw new Error(
          `Insufficient wallet balance. Total required: ₦${totalAmount.toLocaleString()}, Current balance: ₦${wallet.balance.toLocaleString()}`
        );
      }
      effectiveWalletAmount = totalAmount;
    } else if (paymentMethod === 'CREDIT') {
      const credit = creditService.getOrCreateCreditAccount(buyerId, buyer.name);
      if (credit.availableCredit < totalAmount) {
        throw new Error(
          `Insufficient credit limit. Total required: ₦${totalAmount.toLocaleString()}, Available: ₦${credit.availableCredit.toLocaleString()}`
        );
      }
      effectiveCreditAmount = totalAmount;
    } else if (paymentMethod === 'WALLET_AND_CREDIT') {
      const reqWallet = params.walletAmount || 0;
      const reqCredit = params.creditAmount || 0;

      if (reqWallet + reqCredit < totalAmount) {
        throw new Error(
          `Split payment sum (₦${(reqWallet + reqCredit).toLocaleString()}) does not cover order total (₦${totalAmount.toLocaleString()}).`
        );
      }

      const wallet = walletService.getOrCreateWallet(buyerId, buyer.name);
      const credit = creditService.getOrCreateCreditAccount(buyerId, buyer.name);

      if (wallet.balance < reqWallet) {
        throw new Error(
          `Insufficient wallet portion: ₦${reqWallet.toLocaleString()} requested, ₦${wallet.balance.toLocaleString()} available.`
        );
      }
      if (credit.availableCredit < reqCredit) {
        throw new Error(
          `Insufficient credit portion: ₦${reqCredit.toLocaleString()} requested, ₦${credit.availableCredit.toLocaleString()} available.`
        );
      }

      effectiveWalletAmount = reqWallet;
      effectiveCreditAmount = reqCredit;
    }

    const procurementId = `prc-${Date.now()}`;
    const procurementNumber = `PRC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const attemptHistory: SupplierAttemptHistory[] = [
      {
        attemptNumber: 1,
        supplierId: currentSupplier.supplierId,
        supplierName: currentSupplier.supplierName,
        supplierType: currentSupplier.supplierType,
        offeredPrice: currentSupplier.unitPrice,
        status: 'CONTACTED',
        contactedAt: new Date().toISOString(),
      },
    ];

    const procurement: Procurement = {
      id: procurementId,
      procurementNumber,
      buyerId,
      buyerName: buyer.organization || buyer.name,
      productId,
      productName: product.name,
      unit: product.unit,
      quantity,
      targetMaxUnitPrice,
      status: 'SUPPLIER_CONTACTED',
      paymentMethod,
      walletAmount: effectiveWalletAmount,
      creditAmount: effectiveCreditAmount,
      totalAmount,
      platformCommission,
      supplierQueue: queue,
      currentSupplierIndex: 0,
      currentSupplierId: currentSupplier.supplierId,
      currentSupplierName: currentSupplier.supplierName,
      attemptHistory,
      deliveryAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.procurements.unshift(procurement);

    // Audit log
    auditService.log({
      actorId: buyerId,
      actorName: buyer.name,
      actorRole: 'BUYER',
      action: 'PROCUREMENT_REQUEST_CREATED',
      entity: 'Procurement',
      entityId: procurement.id,
      newValue: `${quantity}x ${product.name} (Total: ₦${totalAmount.toLocaleString()})`,
      details: `Matched with Top Supplier ${currentSupplier.supplierName} (${currentSupplier.supplierType})`,
    });

    // Notify Top Supplier
    notificationService.notify({
      recipientId: currentSupplier.supplierId,
      recipientRole: 'SUPPLIER',
      title: 'New Procurement Request Received',
      message: `${buyer.organization || buyer.name} submitted a procurement request for ${quantity.toLocaleString()} units of ${product.name}.`,
      type: 'SUPPLIER',
      link: `/suppliers/procurement/${procurement.id}`,
    });

    return procurement;
  }

  /**
   * Supplier responds to a procurement request (ACCEPT / REJECT / UNAVAILABLE / PARTIAL).
   * If REJECTED/UNAVAILABLE -> Automatically advances to next supplier in the queue!
   */
  public respondToProcurement(params: {
    procurementId: string;
    supplierId: string;
    response: 'ACCEPT' | 'REJECT' | 'UNAVAILABLE' | 'PARTIAL';
    note?: string;
  }): { procurement: Procurement; order?: Order } {
    const { procurementId, supplierId, response, note } = params;

    const procurement = db.procurements.find((p) => p.id === procurementId);
    if (!procurement) throw new Error('Procurement request not found.');

    if (procurement.currentSupplierId !== supplierId) {
      throw new Error('This supplier is not currently active for this procurement request.');
    }

    const currentAttempt = procurement.attemptHistory[procurement.attemptHistory.length - 1];
    if (currentAttempt) {
      currentAttempt.respondedAt = new Date().toISOString();
      currentAttempt.responseNote = note;
    }

    if (response === 'ACCEPT') {
      if (currentAttempt) currentAttempt.status = 'ACCEPTED';
      procurement.supplierQueue[procurement.currentSupplierIndex].status = 'ACCEPTED';
      procurement.status = 'SUPPLIER_CONFIRMED';
      procurement.updatedAt = new Date().toISOString();

      // Convert to Committed Order and process Financial Settlement
      const order = this.convertProcurementToOrder(procurement);
      procurement.associatedOrderId = order.id;

      auditService.log({
        actorId: supplierId,
        actorName: procurement.currentSupplierName,
        actorRole: 'SUPPLIER',
        action: 'PROCUREMENT_ACCEPTED',
        entity: 'Procurement',
        entityId: procurement.id,
        newValue: `Committed to Order ${order.orderNumber}`,
        details: `Supplier confirmed availability for ${procurement.quantity} units`,
      });

      notificationService.notify({
        recipientId: procurement.buyerId,
        recipientRole: 'BUYER',
        title: 'Supplier Confirmed Order',
        message: `${procurement.currentSupplierName} confirmed your procurement of ${procurement.productName}. Order ${order.orderNumber} is now moving to Pharmaceutical Verification.`,
        type: 'ORDER',
        link: `/orders/${order.id}`,
      });

      return { procurement, order };
    }

    // If REJECT or UNAVAILABLE: Mark status and advance to next fallback supplier!
    if (currentAttempt) {
      currentAttempt.status = response === 'UNAVAILABLE' ? 'UNAVAILABLE' : 'REJECTED';
      currentAttempt.reason = note || 'Supplier inventory or capacity unable to fulfill request at this time.';
    }
    procurement.supplierQueue[procurement.currentSupplierIndex].status = 'REJECTED';

    auditService.log({
      actorId: supplierId,
      actorName: procurement.currentSupplierName,
      actorRole: 'SUPPLIER',
      action: 'PROCUREMENT_DECLINED',
      entity: 'Procurement',
      entityId: procurement.id,
      newValue: response,
      details: note || 'Supplier unable to fulfill',
    });

    // Advance to next supplier
    this.advanceToNextSupplier(procurement, note || 'Primary supplier was unavailable.');

    return { procurement };
  }

  /**
   * Advances the procurement to the next eligible supplier in the queue.
   * Supplier #1 -> Supplier #2 -> Supplier #3 -> Fallback pool
   */
  public advanceToNextSupplier(procurement: Procurement, reason?: string): boolean {
    const nextIndex = procurement.currentSupplierIndex + 1;

    if (nextIndex >= procurement.supplierQueue.length) {
      // Queue exhausted
      procurement.status = 'BUYER_ACTION_REQUIRED';
      procurement.updatedAt = new Date().toISOString();

      notificationService.notify({
        recipientId: procurement.buyerId,
        recipientRole: 'BUYER',
        title: 'Procurement Sourcing Notice',
        message: `All primary ranked suppliers for ${procurement.productName} are currently unavailable. Please review alternate fulfillment options.`,
        type: 'ORDER',
      });

      return false;
    }

    const nextSupplier = procurement.supplierQueue[nextIndex];
    procurement.currentSupplierIndex = nextIndex;
    procurement.currentSupplierId = nextSupplier.supplierId;
    procurement.currentSupplierName = nextSupplier.supplierName;
    procurement.status = 'NEXT_SUPPLIER_PENDING';
    nextSupplier.status = 'ACTIVE';

    // Recalculate amounts if price differs
    procurement.totalAmount = nextSupplier.unitPrice * procurement.quantity;

    // Log new attempt in history
    procurement.attemptHistory.push({
      attemptNumber: procurement.attemptHistory.length + 1,
      supplierId: nextSupplier.supplierId,
      supplierName: nextSupplier.supplierName,
      supplierType: nextSupplier.supplierType,
      offeredPrice: nextSupplier.unitPrice,
      status: 'CONTACTED',
      contactedAt: new Date().toISOString(),
    });

    procurement.status = 'SUPPLIER_CONTACTED';
    procurement.updatedAt = new Date().toISOString();

    auditService.log({
      actorId: 'system',
      actorName: 'MediSupply Fallback Engine',
      actorRole: 'ADMIN',
      action: 'PROCUREMENT_FALLBACK_ADVANCED',
      entity: 'Procurement',
      entityId: procurement.id,
      newValue: `Advanced to Supplier #${nextIndex + 1}: ${nextSupplier.supplierName} (${nextSupplier.supplierType})`,
      details: reason || 'Previous supplier rejected or was unresponsive',
    });

    notificationService.notify({
      recipientId: procurement.buyerId,
      recipientRole: 'BUYER',
      title: 'Auto-Advancing to Alternate Supplier',
      message: `Previous supplier was unavailable. System automatically contacted ${nextSupplier.supplierName} (Rank #${nextSupplier.rank}) for your ${procurement.productName} order.`,
      type: 'ORDER',
    });

    notificationService.notify({
      recipientId: nextSupplier.supplierId,
      recipientRole: 'SUPPLIER',
      title: 'New Procurement Request Received (Priority)',
      message: `${procurement.buyerName} submitted a procurement request for ${procurement.quantity.toLocaleString()} units of ${procurement.productName}.`,
      type: 'SUPPLIER',
    });

    return true;
  }

  /**
   * Converts confirmed procurement into an atomic committed Order
   * and executes financial debits / credit charges atomically.
   */
  private convertProcurementToOrder(procurement: Procurement): Order {
    const product = db.products.find((p) => p.id === procurement.productId)!;
    const supProduct = db.supplierProducts.find(
      (sp) => sp.productId === procurement.productId && sp.supplierId === procurement.currentSupplierId
    );

    const unitPrice = procurement.supplierQueue[procurement.currentSupplierIndex].unitPrice;
    const total = unitPrice * procurement.quantity;
    const commission = Math.round((total * product.commissionPercent) / (100 + product.commissionPercent));
    const subtotal = total - commission;

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Process payment transactions
    if (procurement.paymentMethod === 'WALLET' || procurement.walletAmount > 0) {
      const walletAmt = procurement.walletAmount || total;
      walletService.atomicDebit({
        buyerId: procurement.buyerId,
        amount: walletAmt,
        reference: `PAY_ORD_${orderNumber}`,
        description: `Procurement Payment for Order #${orderNumber} (${procurement.productName})`,
        metadata: { orderId, procurementId: procurement.id },
      });
    }

    if (procurement.paymentMethod === 'CREDIT' || procurement.creditAmount > 0) {
      const creditAmt = procurement.creditAmount || total;
      creditService.authorizeCreditPurchase({
        buyerId: procurement.buyerId,
        amount: creditAmt,
        orderId,
        reference: `CRD_ORD_${orderNumber}`,
        description: `Institutional 30-Day Credit for Order #${orderNumber} (${procurement.productName})`,
      });
    }

    // Deduct stock from supplier inventory
    if (supProduct) {
      supProduct.stock = Math.max(0, supProduct.stock - procurement.quantity);
      if (supProduct.stock === 0) supProduct.status = 'OUT_OF_STOCK';
      else if (supProduct.stock < supProduct.minOrderQuantity) supProduct.status = 'LOW_STOCK';
    }

    const orderItem: OrderItem = {
      productId: procurement.productId,
      supplierProductId: supProduct ? supProduct.id : 'sp-custom',
      name: product.name,
      unit: product.unit,
      quantity: procurement.quantity,
      unitPrice,
      subtotal: total,
      batchNumber: supProduct ? supProduct.batchNumber : 'BATCH-2025-01',
      expiryDate: supProduct ? supProduct.expiryDate : '2027-12-31',
    };

    const order: Order = {
      id: orderId,
      orderNumber,
      procurementId: procurement.id,
      buyerId: procurement.buyerId,
      buyerName: procurement.buyerName,
      supplierId: procurement.currentSupplierId,
      supplierName: procurement.currentSupplierName,
      supplierType: procurement.supplierQueue[procurement.currentSupplierIndex].supplierType,
      items: [orderItem],
      subtotal,
      commission,
      total,
      paymentMethod: procurement.paymentMethod,
      walletAmount: procurement.walletAmount,
      creditAmount: procurement.creditAmount,
      status: 'VERIFICATION', // Ready for pharmaceutical compliance review
      deliveryAddress: procurement.deliveryAddress,
      batchNumber: orderItem.batchNumber || 'BATCH-2025-01',
      expiryDate: orderItem.expiryDate || '2027-12-31',
      trackingUpdates: [
        {
          status: 'PAYMENT_CONFIRMED',
          title: 'Payment & Authorization Confirmed',
          description: `Settled via ${procurement.paymentMethod.replace('_', ' + ')}`,
          timestamp: new Date().toISOString(),
        },
        {
          status: 'SUPPLIER_CONFIRMED',
          title: 'Supplier Inventory Reserved',
          description: `${procurement.currentSupplierName} scheduled batch ${orderItem.batchNumber} for pickup.`,
          timestamp: new Date().toISOString(),
        },
        {
          status: 'VERIFICATION',
          title: 'Transferred to Pharmaceutical QA Inspection',
          description: 'Awaiting licensed pharmacist chemical & NAFDAC compliance review.',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(order);

    // Notify Pharmacist
    notificationService.notify({
      recipientId: 'usr-pharmacist-1',
      recipientRole: 'PHARMACIST',
      title: 'New Order Awaiting Pharmaceutical Verification',
      message: `Order #${order.orderNumber} (${product.name}, Batch: ${order.batchNumber}) received for compliance check.`,
      type: 'VERIFICATION',
      link: `/pharmacist/verify/${order.id}`,
    });

    return order;
  }
}

export const procurementService = new ProcurementService();

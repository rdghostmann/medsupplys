import { db } from '../db';
import { Order, ProcurementStatus, VerificationResult } from '../../types';
import { walletService } from './wallet.service';
import { creditService } from './credit.service';
import { auditService } from './audit.service';
import { notificationService } from './notification.service';

export class OrderService {
  /**
   * Transitions an order through its regulated state machine.
   */
  public updateOrderStatus(params: {
    orderId: string;
    nextStatus: ProcurementStatus;
    title?: string;
    description?: string;
    actorId: string;
    actorName: string;
    actorRole: 'BUYER' | 'SUPPLIER' | 'PHARMACIST' | 'ADMIN';
  }): Order {
    const { orderId, nextStatus, title, description, actorId, actorName, actorRole } = params;

    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found.');

    const oldStatus = order.status;
    order.status = nextStatus;
    order.updatedAt = new Date().toISOString();

    const updateTitle = title || `Status updated to ${nextStatus.replace(/_/g, ' ')}`;
    const updateDesc = description || `Updated by ${actorName} (${actorRole})`;

    order.trackingUpdates.push({
      status: nextStatus,
      title: updateTitle,
      description: updateDesc,
      timestamp: new Date().toISOString(),
    });

    auditService.log({
      actorId,
      actorName,
      actorRole,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'Order',
      entityId: order.id,
      oldValue: oldStatus,
      newValue: nextStatus,
      details: updateDesc,
    });

    // Notify Buyer on major delivery milestones
    if (['PROCESSING', 'READY_FOR_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(nextStatus)) {
      notificationService.notify({
        recipientId: order.buyerId,
        recipientRole: 'BUYER',
        title: `Order Update: #${order.orderNumber}`,
        message: `${updateTitle} — ${updateDesc}`,
        type: 'ORDER',
        link: `/orders/${order.id}`,
      });
    }

    return order;
  }

  /**
   * Licensed Pharmacist Verification Review
   */
  public verifyOrder(params: {
    orderId: string;
    pharmacistId: string;
    pharmacistName: string;
    result: VerificationResult;
    batchValid: boolean;
    expiryValid: boolean;
    sealIntact: boolean;
    storageCompliant: boolean;
    notes: string;
  }): Order {
    const {
      orderId,
      pharmacistId,
      pharmacistName,
      result,
      batchValid,
      expiryValid,
      sealIntact,
      storageCompliant,
      notes,
    } = params;

    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found.');

    order.pharmacistVerification = {
      verifiedBy: pharmacistId,
      verifiedByName: pharmacistName,
      result,
      batchValid,
      expiryValid,
      sealIntact,
      storageCompliant,
      notes,
      verifiedAt: new Date().toISOString(),
    };

    if (result === 'APPROVED') {
      order.status = 'READY_FOR_DISPATCH';
      order.trackingUpdates.push({
        status: 'READY_FOR_DISPATCH',
        title: 'NAFDAC & Quality Verification Passed',
        description: `Inspected & approved by ${pharmacistName}. Batch ${order.batchNumber} cleared for cold-chain dispatch.`,
        timestamp: new Date().toISOString(),
      });

      auditService.log({
        actorId: pharmacistId,
        actorName: pharmacistName,
        actorRole: 'PHARMACIST',
        action: 'PHARMACEUTICAL_INSPECTION_APPROVED',
        entity: 'Order',
        entityId: order.id,
        newValue: 'APPROVED',
        details: `Batch ${order.batchNumber} passed all regulatory compliance checks: ${notes}`,
      });

      notificationService.notify({
        recipientId: order.buyerId,
        recipientRole: 'BUYER',
        title: `Quality Compliance Passed for #${order.orderNumber}`,
        message: `Dr. Amaka Obi has verified batch ${order.batchNumber}. Order is now ready for secure dispatch.`,
        type: 'VERIFICATION',
      });

      notificationService.notify({
        recipientId: order.supplierId,
        recipientRole: 'SUPPLIER',
        title: `Verification Cleared: #${order.orderNumber}`,
        message: `Your supplied batch ${order.batchNumber} has been verified and authorized for final dispatch.`,
        type: 'VERIFICATION',
      });
    } else if (result === 'REJECTED') {
      order.status = 'CANCELLED';
      order.trackingUpdates.push({
        status: 'CANCELLED',
        title: 'Pharmaceutical Inspection Rejected — Product Quarantined',
        description: `Rejected by ${pharmacistName}. Reason: ${notes}. Automatic refund/reversal initiated.`,
        timestamp: new Date().toISOString(),
      });

      auditService.log({
        actorId: pharmacistId,
        actorName: pharmacistName,
        actorRole: 'PHARMACIST',
        action: 'PHARMACEUTICAL_INSPECTION_REJECTED',
        entity: 'Order',
        entityId: order.id,
        newValue: 'REJECTED',
        details: `Quarantine ordered. Reason: ${notes}`,
      });

      // Auto refund buyer
      if (order.walletAmount > 0) {
        walletService.atomicRefund({
          buyerId: order.buyerId,
          amount: order.walletAmount,
          reference: `REFUND_ORD_${order.orderNumber}`,
          description: `Automatic Refund for Rejected Batch (Order #${order.orderNumber})`,
        });
      }

      if (order.creditAmount > 0) {
        creditService.repayCredit({
          buyerId: order.buyerId,
          amount: order.creditAmount,
          reference: `REV_CRD_ORD_${order.orderNumber}`,
          notes: `Credit Reversal for Rejected Inspection (Order #${order.orderNumber})`,
        });
      }

      notificationService.notify({
        recipientId: order.buyerId,
        recipientRole: 'BUYER',
        title: `Order Cancelled: Compliance Alert for #${order.orderNumber}`,
        message: `Batch failed pharmacist quality standards (${notes}). Full refund has been credited to your account.`,
        type: 'VERIFICATION',
      });
    } else {
      // FLAGGED
      order.trackingUpdates.push({
        status: 'VERIFICATION',
        title: 'Product Batch Flagged for Supplementary Laboratory Analysis',
        description: `Flagged by ${pharmacistName}: ${notes}`,
        timestamp: new Date().toISOString(),
      });
    }

    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export const orderService = new OrderService();

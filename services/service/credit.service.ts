import { db } from '../db';
import { CreditAccount, CreditTransaction } from '../../types';
import { auditService } from './audit.service';
import { notificationService } from './notification.service';

export class CreditService {
  public getOrCreateCreditAccount(buyerId: string, buyerName: string): CreditAccount {
    let account = db.creditAccounts.get(buyerId);
    if (!account) {
      account = {
        id: `crd-${buyerId}`,
        buyerId,
        buyerName,
        creditLimit: 3000000,
        availableCredit: 3000000,
        creditUsed: 0,
        outstandingBalance: 0,
        status: 'ACTIVE',
        approvedBy: 'usr-admin-1',
        approvedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        terms: 'Net 30 Days Institutional Credit',
        interestRatePercent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.creditAccounts.set(buyerId, account);
    }
    return account;
  }

  public authorizeCreditPurchase(params: {
    buyerId: string;
    amount: number;
    orderId: string;
    reference: string;
    description: string;
  }): { account: CreditAccount; transaction: CreditTransaction } {
    const { buyerId, amount, orderId, reference, description } = params;

    if (amount <= 0) {
      throw new Error('Credit amount must be greater than zero.');
    }

    const buyer = db.users.find((u) => u.id === buyerId);
    const buyerName = buyer ? buyer.organization || buyer.name : 'Authorized Buyer';
    const account = this.getOrCreateCreditAccount(buyerId, buyerName);

    if (account.status !== 'ACTIVE' && account.status !== 'APPROVED') {
      throw new Error(`Credit facility is ${account.status}. Credit procurements restricted.`);
    }

    if (account.availableCredit < amount) {
      throw new Error(
        `Insufficient credit line. Required: ₦${amount.toLocaleString()}, Available: ₦${account.availableCredit.toLocaleString()}`
      );
    }

    const balanceBefore = account.outstandingBalance;
    const balanceAfter = balanceBefore + amount;

    account.creditUsed += amount;
    account.availableCredit -= amount;
    account.outstandingBalance = balanceAfter;
    account.updatedAt = new Date().toISOString();

    const transaction: CreditTransaction = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      creditAccountId: account.id,
      buyerId,
      type: 'CREDIT_PURCHASE',
      amount,
      direction: 'CHARGE',
      balanceBefore,
      balanceAfter,
      reference,
      orderId,
      description,
      createdAt: new Date().toISOString(),
    };

    db.creditTransactions.unshift(transaction);

    auditService.log({
      actorId: buyerId,
      actorName: buyerName,
      actorRole: 'BUYER',
      action: 'CREDIT_PURCHASE_AUTHORIZED',
      entity: 'CreditAccount',
      entityId: account.id,
      oldValue: `Outstanding: ₦${balanceBefore.toLocaleString()}`,
      newValue: `Outstanding: ₦${balanceAfter.toLocaleString()}`,
      details: `Authorized ₦${amount.toLocaleString()} on credit for ${description}`,
    });

    return { account, transaction };
  }

  public repayCredit(params: {
    buyerId: string;
    amount: number;
    reference: string;
    notes?: string;
  }): { account: CreditAccount; transaction: CreditTransaction } {
    const { buyerId, amount, reference, notes } = params;

    if (amount <= 0) {
      throw new Error('Repayment amount must be greater than zero.');
    }

    const buyer = db.users.find((u) => u.id === buyerId);
    const buyerName = buyer ? buyer.organization || buyer.name : 'Authorized Buyer';
    const account = this.getOrCreateCreditAccount(buyerId, buyerName);

    const balanceBefore = account.outstandingBalance;
    const effectiveRepayment = Math.min(amount, account.outstandingBalance);
    const balanceAfter = Math.max(0, balanceBefore - effectiveRepayment);

    account.outstandingBalance = balanceAfter;
    account.creditUsed = Math.max(0, account.creditUsed - effectiveRepayment);
    account.availableCredit = Math.min(account.creditLimit, account.availableCredit + effectiveRepayment);
    account.updatedAt = new Date().toISOString();

    const transaction: CreditTransaction = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      creditAccountId: account.id,
      buyerId,
      type: 'CREDIT_REPAYMENT',
      amount: effectiveRepayment,
      direction: 'REPAYMENT',
      balanceBefore,
      balanceAfter,
      reference,
      description: notes || `Revolving Credit Facility Repayment (Ref: ${reference})`,
      createdAt: new Date().toISOString(),
    };

    db.creditTransactions.unshift(transaction);

    auditService.log({
      actorId: buyerId,
      actorName: buyerName,
      actorRole: 'BUYER',
      action: 'CREDIT_REPAYMENT_RECORDED',
      entity: 'CreditAccount',
      entityId: account.id,
      oldValue: `Outstanding: ₦${balanceBefore.toLocaleString()}`,
      newValue: `Outstanding: ₦${balanceAfter.toLocaleString()}`,
      details: `Credit repayment of ₦${effectiveRepayment.toLocaleString()} settled`,
    });

    notificationService.notify({
      recipientId: buyerId,
      recipientRole: 'BUYER',
      title: 'Credit Repayment Acknowledged',
      message: `Your payment of ₦${effectiveRepayment.toLocaleString()} has been applied. Available credit restored to ₦${account.availableCredit.toLocaleString()}.`,
      type: 'CREDIT',
    });

    return { account, transaction };
  }

  public getTransactions(buyerId?: string): CreditTransaction[] {
    if (buyerId) {
      return db.creditTransactions.filter((tx) => tx.buyerId === buyerId);
    }
    return db.creditTransactions;
  }
}

export const creditService = new CreditService();

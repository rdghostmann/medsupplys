import { db } from '../db';
import { Wallet, WalletTransaction, WalletTransactionType } from '../../types';
import { auditService } from './audit.service';
import { notificationService } from './notification.service';

export class WalletService {
  /**
   * Retrieves or initializes a buyer wallet.
   */
  public getOrCreateWallet(buyerId: string, buyerName: string): Wallet {
    let wallet = db.wallets.get(buyerId);
    if (!wallet) {
      wallet = {
        id: `wlt-${buyerId}`,
        buyerId,
        buyerName,
        balance: 0,
        currency: 'NGN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.wallets.set(buyerId, wallet);
    }
    return wallet;
  }

  /**
   * Idempotent Paystack Topup Settlement
   */
  public fundWalletViaPaystack(params: {
    buyerId: string;
    amount: number;
    reference: string;
    channel?: string;
    gatewayMetadata?: Record<string, any>;
  }): { wallet: Wallet; transaction: WalletTransaction } {
    const { buyerId, amount, reference, channel = 'paystack_card_or_bank' } = params;

    if (amount <= 0) {
      throw new Error('Top-up amount must be greater than zero.');
    }

    // Idempotency check: Ensure reference was not processed previously
    const existingTx = db.walletTransactions.find((tx) => tx.reference === reference);
    if (existingTx) {
      const wallet = this.getOrCreateWallet(buyerId, 'Authorized Buyer');
      return { wallet, transaction: existingTx };
    }

    const buyer = db.users.find((u) => u.id === buyerId);
    const buyerName = buyer ? buyer.organization || buyer.name : 'Authorized Healthcare Buyer';
    const wallet = this.getOrCreateWallet(buyerId, buyerName);

    if (wallet.status !== 'ACTIVE') {
      throw new Error(`Wallet cannot be funded because its status is ${wallet.status}.`);
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    wallet.balance = balanceAfter;
    wallet.updatedAt = new Date().toISOString();

    const transaction: WalletTransaction = {
      id: `wtx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      walletId: wallet.id,
      buyerId,
      type: 'TOPUP',
      amount,
      direction: 'CREDIT',
      balanceBefore,
      balanceAfter,
      reference,
      description: `Paystack Verified Direct Funding (Ref: ${reference})`,
      status: 'SUCCESS',
      metadata: {
        channel,
        gateway: 'Paystack Gateway',
        ...params.gatewayMetadata,
      },
      createdAt: new Date().toISOString(),
    };

    db.walletTransactions.unshift(transaction);

    // Audit log
    auditService.log({
      actorId: buyerId,
      actorName: buyerName,
      actorRole: 'BUYER',
      action: 'WALLET_TOPUP_SUCCESS',
      entity: 'Wallet',
      entityId: wallet.id,
      oldValue: `₦${balanceBefore.toLocaleString()}`,
      newValue: `₦${balanceAfter.toLocaleString()}`,
      details: `Funded ₦${amount.toLocaleString()} via Paystack settlement (Ref: ${reference})`,
    });

    // Notify buyer
    notificationService.notify({
      recipientId: buyerId,
      recipientRole: 'BUYER',
      title: 'Wallet Funded Successfully',
      message: `Your MediSupply Wallet has been credited with ₦${amount.toLocaleString()}. Current balance: ₦${balanceAfter.toLocaleString()}.`,
      type: 'WALLET',
    });

    return { wallet, transaction };
  }

  /**
   * Atomic Wallet Debit for procurement purchases
   */
  public atomicDebit(params: {
    buyerId: string;
    amount: number;
    reference: string;
    description: string;
    type?: WalletTransactionType;
    metadata?: Record<string, any>;
  }): { wallet: Wallet; transaction: WalletTransaction } {
    const { buyerId, amount, reference, description, type = 'PURCHASE', metadata } = params;

    if (amount <= 0) {
      throw new Error('Debit amount must be greater than zero.');
    }

    const buyer = db.users.find((u) => u.id === buyerId);
    const buyerName = buyer ? buyer.organization || buyer.name : 'Authorized Healthcare Buyer';
    const wallet = this.getOrCreateWallet(buyerId, buyerName);

    if (wallet.status !== 'ACTIVE') {
      throw new Error(`Wallet is ${wallet.status}. Transactions prohibited.`);
    }

    if (wallet.balance < amount) {
      throw new Error(
        `Insufficient wallet balance. Required: ₦${amount.toLocaleString()}, Available: ₦${wallet.balance.toLocaleString()}`
      );
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore - amount;

    // Apply debit atomically
    wallet.balance = balanceAfter;
    wallet.updatedAt = new Date().toISOString();

    const transaction: WalletTransaction = {
      id: `wtx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      walletId: wallet.id,
      buyerId,
      type,
      amount,
      direction: 'DEBIT',
      balanceBefore,
      balanceAfter,
      reference,
      description,
      status: 'SUCCESS',
      metadata,
      createdAt: new Date().toISOString(),
    };

    db.walletTransactions.unshift(transaction);

    // Audit log
    auditService.log({
      actorId: buyerId,
      actorName: buyerName,
      actorRole: 'BUYER',
      action: 'WALLET_DEBIT_PURCHASE',
      entity: 'Wallet',
      entityId: wallet.id,
      oldValue: `₦${balanceBefore.toLocaleString()}`,
      newValue: `₦${balanceAfter.toLocaleString()}`,
      details: `Debited ₦${amount.toLocaleString()} for ${description}`,
    });

    return { wallet, transaction };
  }

  /**
   * Atomic Refund in case of cancelled or unfulfillable order
   */
  public atomicRefund(params: {
    buyerId: string;
    amount: number;
    reference: string;
    description: string;
  }): { wallet: Wallet; transaction: WalletTransaction } {
    const { buyerId, amount, reference, description } = params;

    const buyer = db.users.find((u) => u.id === buyerId);
    const buyerName = buyer ? buyer.organization || buyer.name : 'Authorized Healthcare Buyer';
    const wallet = this.getOrCreateWallet(buyerId, buyerName);

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    wallet.balance = balanceAfter;
    wallet.updatedAt = new Date().toISOString();

    const transaction: WalletTransaction = {
      id: `wtx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      walletId: wallet.id,
      buyerId,
      type: 'REFUND',
      amount,
      direction: 'CREDIT',
      balanceBefore,
      balanceAfter,
      reference,
      description,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };

    db.walletTransactions.unshift(transaction);

    auditService.log({
      actorId: buyerId,
      actorName: buyerName,
      actorRole: 'BUYER',
      action: 'WALLET_REFUND_CREDITED',
      entity: 'Wallet',
      entityId: wallet.id,
      oldValue: `₦${balanceBefore.toLocaleString()}`,
      newValue: `₦${balanceAfter.toLocaleString()}`,
      details: `Refund of ₦${amount.toLocaleString()} credited: ${description}`,
    });

    return { wallet, transaction };
  }

  public getTransactions(buyerId?: string): WalletTransaction[] {
    if (buyerId) {
      return db.walletTransactions.filter((tx) => tx.buyerId === buyerId);
    }
    return db.walletTransactions;
  }
}

export const walletService = new WalletService();

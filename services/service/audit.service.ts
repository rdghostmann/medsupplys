import { db } from '../db';
import { AuditLog, Notification, UserRole } from '../../types';

export class AuditService {
  public log(params: {
    actorId: string;
    actorName: string;
    actorRole: UserRole;
    action: string;
    entity: string;
    entityId: string;
    details: string;
    oldValue?: string;
    newValue?: string;
    ipAddress?: string;
  }): AuditLog {
    const entry: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actorId: params.actorId,
      actorName: params.actorName,
      actorRole: params.actorRole,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      details: params.details,
      oldValue: params.oldValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress || '197.210.14.88 (Lagos, NG)',
      timestamp: new Date().toISOString(),
    };

    db.auditLogs.unshift(entry);
    return entry;
  }
}

export class NotificationService {
  public notify(params: {
    recipientId: string;
    recipientRole: UserRole | 'ALL';
    title: string;
    message: string;
    type: 'ORDER' | 'WALLET' | 'CREDIT' | 'VERIFICATION' | 'SUPPLIER' | 'SYSTEM';
    link?: string;
  }): Notification {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipientId: params.recipientId,
      recipientRole: params.recipientRole,
      title: params.title,
      message: params.message,
      type: params.type,
      isRead: false,
      link: params.link,
      createdAt: new Date().toISOString(),
    };

    db.notifications.unshift(notif);
    return notif;
  }
}

export const auditService = new AuditService();
export const notificationService = new NotificationService();

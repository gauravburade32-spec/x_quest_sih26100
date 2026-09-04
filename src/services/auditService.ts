import { AuditEvent, MOCK_AUDIT_EVENTS } from '@/data/mockData';

let auditEventsStore: AuditEvent[] = [...MOCK_AUDIT_EVENTS];

export const auditService = {
  getAuditEvents: (): AuditEvent[] => {
    return auditEventsStore;
  },

  logAuditEvent: (event: AuditEvent): AuditEvent => {
    auditEventsStore = [event, ...auditEventsStore];
    return event;
  },

  getAuditEventsByTenderId: (tenderId: string): AuditEvent[] => {
    return auditEventsStore.filter((e) => e.tenderId === tenderId);
  },

  getAuditEventsByBidderId: (bidderId: string): AuditEvent[] => {
    return auditEventsStore.filter((e) => e.bidderId === bidderId);
  },
};

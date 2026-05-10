export interface AuditLog {

  id: number;

  userId: number;

  action: string;

  entity: string;

  entityId: number | null;

  oldValue: any | null;

  newValue: any | null;

  createdAt: Date;

  // ================= USER =================

  user?: {

    id: number;

    username: string;

    role: 'ADMIN' | 'CLIENT';
  };
}
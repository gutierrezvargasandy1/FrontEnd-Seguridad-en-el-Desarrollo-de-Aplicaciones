// app/services/audit-log.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/api/services/api-service';

export interface AuditLog {

  id: number;

  userId: number;

  action: string;

  entity: string;

  entityId?: number | null;

  oldValue?: any;

  newValue?: any;

  ip: string | null;

  createdAt: Date;

  // Relación user que viene del include de Prisma
  user?: {
    id: number;
    username: string;
    role: 'ADMIN' | 'CLIENT';
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(private api: ApiService) {}

  // ================= ADMIN =================
  getAll(): Observable<AuditLog[]> {

    return this.api.get<AuditLog[]>('audit-log/all');
  }

  // ================= USER =================
  getMine(): Observable<AuditLog[]> {

    return this.api.get<AuditLog[]>('audit-log/me');
  }
}
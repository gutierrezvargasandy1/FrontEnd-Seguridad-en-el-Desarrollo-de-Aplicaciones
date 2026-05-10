import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuditLog} from '../audit-log.service/interface/auditLog.interface'
import { ApiService } from '../../core/api/services/api-service';

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
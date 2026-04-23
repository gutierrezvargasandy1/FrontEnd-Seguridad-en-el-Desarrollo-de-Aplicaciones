import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  username?: string; // para búsqueda visual (si el back lo retorna por join)
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {

  private readonly API = 'http://localhost:3000/audit-log';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.API}/all`, { withCredentials: true });
  }

  getMine(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.API}/me`, { withCredentials: true });
  }
}
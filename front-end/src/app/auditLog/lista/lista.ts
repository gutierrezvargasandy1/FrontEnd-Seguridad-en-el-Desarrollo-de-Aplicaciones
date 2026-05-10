import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  AuditLogService
} from '../../services/audit-log.service/audit-log.service';

import { Auth } from '../../services/auth.service/auth';
import { AuditLog } from '../../services/audit-log.service/interface/auditLog.interface';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.html',
  standalone: false,
  styleUrl: './lista.css',
  encapsulation: ViewEncapsulation.None

})
export class Lista implements OnInit {

  logs: AuditLog[] = [];

  filteredLogs: AuditLog[] = [];

  searchAction = '';

  searchEntity = '';

  searchUser = '';

  fromDate = '';

  toDate = '';

  loading = false;

  errorMessage = '';

  constructor(
    private auditService: AuditLogService,
    private authService: Auth
  ) {}

  ngOnInit(): void {

    this.loadLogs();
  }

  // ================= LOAD LOGS =================

  loadLogs(): void {

    this.loading = true;

    this.errorMessage = '';

    // ================= SI ES ADMIN =================

    if (this.isAdmin()) {

      this.auditService.getAll().subscribe({

        next: (res: AuditLog[]) => {

          this.logs = res || [];

          this.filteredLogs = [...this.logs];

          this.loading = false;
        },

        error: (error) => {

          this.errorMessage =
            error?.error?.message ||
            'Error al cargar logs de auditoría';

          this.loading = false;
        }
      });

      return;
    }

    // ================= SI ES CLIENT =================

    this.auditService.getMine().subscribe({

      next: (res: AuditLog[]) => {

        this.logs = res || [];

        this.filteredLogs = [...this.logs];

        this.loading = false;
      },

      error: (error) => {

        this.errorMessage =
          error?.error?.message ||
          'Error al cargar logs de auditoría';

        this.loading = false;
      }
    });
  }

  // ================= FILTER =================

  filter(): void {

    this.filteredLogs = this.logs.filter((log: AuditLog) => {

      // ================= ACTION =================

      const action = log.action?.toLowerCase() || '';

      const matchesAction =
        this.searchAction === '' ||
        action.includes(this.searchAction.toLowerCase());

      // ================= ENTITY =================

      const entity = log.entity?.toLowerCase() || '';

      const matchesEntity =
        this.searchEntity === '' ||
        entity.includes(this.searchEntity.toLowerCase());

      // ================= USER =================

      const username = log.user?.username?.toLowerCase() || '';

      const matchesUser =
        this.searchUser === '' ||
        username.includes(this.searchUser.toLowerCase());

      // ================= DATE =================

      const logDate = new Date(log.createdAt).getTime();

      // ================= FROM =================

      const matchesFrom =
        this.fromDate === '' ||
        logDate >= new Date(this.fromDate).getTime();

      // ================= TO =================

      const matchesTo =
        this.toDate === '' ||
        logDate <= new Date(this.toDate).getTime();

      // ================= RESULT =================

      return (
        matchesAction &&
        matchesEntity &&
        matchesUser &&
        matchesFrom &&
        matchesTo
      );
    });
  }

  // ================= CLEAR FILTERS =================

  clearFilters(): void {

    this.searchAction = '';

    this.searchEntity = '';

    this.searchUser = '';

    this.fromDate = '';

    this.toDate = '';

    this.filteredLogs = [...this.logs];
  }

  // ================= FORMAT JSON =================

  formatJson(data: any): string {

    if (!data) {

      return '-';
    }

    // ================= SI ES OBJETO =================

    if (typeof data === 'object') {

      return Object.values(data)
        .filter(value =>
          value !== null &&
          value !== undefined &&
          value !== ''
        )
        .join(' | ');
    }

    // ================= SI ES STRING O NUMBER =================

    return String(data);
  }

  // ================= ROLE =================

  isAdmin(): boolean {

    return this.authService.isAdmin();
  }
}
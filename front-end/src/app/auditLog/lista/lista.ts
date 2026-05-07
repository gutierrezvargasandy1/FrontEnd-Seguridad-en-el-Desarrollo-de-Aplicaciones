import { Component, OnInit } from '@angular/core';

import {
  AuditLog,
  AuditLogService
} from '../../services/audit-log.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.html',
  standalone: false,
  styleUrl: './lista.css',
})
export class Lista implements OnInit {

  logs: AuditLog[] = [];

  filteredLogs: AuditLog[] = [];

  searchUser = '';

  fromDate = '';

  toDate = '';

  loading = false;

  errorMessage = '';

  constructor(
    private auditService: AuditLogService
  ) {}

  ngOnInit(): void {

    this.loadLogs();
  }

  // ================= LOAD LOGS =================

  loadLogs(): void {

    this.loading = true;

    this.errorMessage = '';

    this.auditService.getMine().subscribe({

      next: (res: AuditLog[]) => {

        console.log('Logs recibidos:', res);

        this.logs = res || [];

        this.filteredLogs = [...this.logs];

        this.loading = false;
      },

      error: (error) => {

        console.error('Error al cargar logs:', error);

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

      // ================= USERNAME =================

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

      return matchesUser && matchesFrom && matchesTo;
    });
  }

  // ================= CLEAR FILTERS =================

  clearFilters(): void {

    this.searchUser = '';

    this.fromDate = '';

    this.toDate = '';

    this.filteredLogs = [...this.logs];
  }
}
import { Component, OnInit } from '@angular/core';
import { AuditLog, AuditLogService } from '../../services/audit-log.service';


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

  constructor(private auditService: AuditLogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.auditService.getAll().subscribe(res => {
      this.logs = res;
      this.filteredLogs = res;
    });
  }

  filter() {
    this.filteredLogs = this.logs.filter(log => {

      const matchesUser =
        this.searchUser === '' ||
        (log.username?.toLowerCase().includes(this.searchUser.toLowerCase()));

      const logDate = new Date(log.createdAt).getTime();

      const matchesFrom =
        this.fromDate === '' ||
        logDate >= new Date(this.fromDate).getTime();

      const matchesTo =
        this.toDate === '' ||
        logDate <= new Date(this.toDate).getTime();

      return matchesUser && matchesFrom && matchesTo;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, User, UpdateUserDto, UserError } from '../../services/user';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.html',
  styleUrl: './user-update.css',
})
export class UserUpdate implements OnInit {

  userId!: number;

  userData: UpdateUserDto = {
    name: '',
    lastname: '',
    username: ''
  };

  loading = true;
  saving = false;
  serverError = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUsers().subscribe({
      next: (users) => {
        const user = users.find(u => u.id === this.userId);
        if (!user) {
          this.serverError = 'Usuario no encontrado';
          this.loading = false;
          return;
        }

        this.userData = {
          name: user.name,
          lastname: user.lastname,
          username: user.username
        };

        this.loading = false;
      },
      error: (err: UserError) => {
        this.loading = false;
        this.serverError = err.userMessage;
      }
    });
  }

  updateUser(form: NgForm): void {
    this.userData.name = this.userData.name?.trim();
    this.userData.lastname = this.userData.lastname?.trim();
    this.userData.username = this.userData.username?.trim();

    this.serverError = '';
    this.fieldErrors = {};

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.saving = true;

    // 🔥 cuando agregues updateUser al service, solo cambia esta línea
    this.userService.createUser(this.userData as any).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/dashboard/users', this.userId]);
      },
      error: (err: UserError) => {
        this.saving = false;
        if (err.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.serverError = err.userMessage;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/users', this.userId]);
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {UserService} from '../../services/user.service/user';
import { UpdateUserDto } from '../../services/user.service/interface/update-user-dto.interface';
import { ErrorResponse } from '../../services/error-response.interface';

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

    this.userId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUsers().subscribe({

      next: (users) => {

        const user =
          users.find(u => u.id === this.userId);

        if (!user) {

          this.serverError =
            'Usuario no encontrado';

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

      error: (err: ErrorResponse) => {

        this.loading = false;

        this.serverError =
          err.userMessage;
      }
    });
  }

  updateUser(form: NgForm): void {


    this.userData.name =
      this.userData.name?.trim();

    this.userData.lastname =
      this.userData.lastname?.trim();

    this.userData.username =
      this.userData.username?.trim();


    this.serverError = '';

    this.fieldErrors = {};


    if (form.invalid) {

      form.control.markAllAsTouched();

      return;
    }

    this.saving = true;

    this.userService.updateUser(
      this.userId,
      this.userData
    ).subscribe({

      next: () => {

        this.saving = false;

        this.router.navigate([
          '/dashboard/users',
          this.userId
        ]);
      },

      error: (err: ErrorResponse) => {

        this.saving = false;

        if (err.fieldErrors) {

          this.fieldErrors =
            err.fieldErrors;

        } else {

          this.serverError =
            err.userMessage;
        }
      }
    });
  }

  trimField(field: string): void {

    switch (field) {

      case 'name':

        this.userData.name =
          this.userData.name?.trim();

        break;

      case 'lastname':

        this.userData.lastname =
          this.userData.lastname?.trim();

        break;

      case 'username':

        this.userData.username =
          this.userData.username?.trim();

        break;
    }
  }

  goBack(): void {

    this.router.navigate([
      '/dashboard/users',
      this.userId
    ]);
  }
}
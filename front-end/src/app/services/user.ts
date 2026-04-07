import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  created_at: string | Date;
  hash?: string | null;

}

export interface CreateUserDto {
  name: string;
  lastname: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  lastname: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private API = 'http://localhost:3000/api/users';
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}


  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.API}`, user, { withCredentials: true });
  }

  updateProfile(updateUserDto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.API}/profile`, updateUserDto, { withCredentials: true });
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.API}/profile`, { withCredentials: true });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API}/${id}`, { withCredentials: true });
  }

  getUsers() {
  return this.http.get<User[]>(`${this.API}`, { withCredentials: true });
}

 deleteUser(id: number) {
  return this.http.delete(`${this.API}/${id}`, { withCredentials: true });
}

updateUserById(id: number, dto: UpdateUserDto): Observable<User> {
  return this.http.patch<User>(`${this.API}/${id}`, dto, { withCredentials: true });
}


}

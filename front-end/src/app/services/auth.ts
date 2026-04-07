import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  created_at: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API = 'http://localhost:3000/api/auth';

  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, {
      username,
      password
    }, {
      withCredentials: true
    }).pipe(
      tap(res => {
        this.setAccessToken(res.access_token); 
      })
    );
  }

  refresh() {
    return this.http.post<any>(`${this.API}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      tap(res => {
        this.setAccessToken(res.access_token); 
      })
    );
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  logout() {
    this.accessToken = null;
    return this.http.post(`${this.API}/logout`, {}, {
      withCredentials: true
    });
  }

  me() {
    return this.http.get<User>(`${this.API}/me`, { withCredentials: true });
  }
}

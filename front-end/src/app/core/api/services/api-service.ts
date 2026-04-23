// app/core/api/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enveroments/environment';

export interface ApiOptions {
  headers?:         HttpHeaders | Record<string, string>;
  params?:          HttpParams  | Record<string, string>;
  withCredentials?: boolean;
  context?:         HttpContext;  // ← nuevo
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment?.apiUrl || 'http://localhost:3000/api';
  }

  get<T>(endpoint: string, options?: ApiOptions): Observable<T> {
    return this.http.request<T>('GET', this.buildUrl(endpoint), {
      headers:         this.buildHeaders(options?.headers),
      params:          this.buildParams(options?.params),
      withCredentials: options?.withCredentials ?? true,
      context:         options?.context,
    });
  }

  post<T>(endpoint: string, body?: any, options?: ApiOptions): Observable<T> {
    return this.http.request<T>('POST', this.buildUrl(endpoint), {
      body,
      headers:         this.buildHeaders(options?.headers),
      params:          this.buildParams(options?.params),
      withCredentials: options?.withCredentials ?? true,
      context:         options?.context,
    });
  }

  put<T>(endpoint: string, body?: any, options?: ApiOptions): Observable<T> {
    return this.http.request<T>('PUT', this.buildUrl(endpoint), {
      body,
      headers:         this.buildHeaders(options?.headers),
      params:          this.buildParams(options?.params),
      withCredentials: options?.withCredentials ?? true,
      context:         options?.context,
    });
  }

  patch<T>(endpoint: string, body?: any, options?: ApiOptions): Observable<T> {
    return this.http.request<T>('PATCH', this.buildUrl(endpoint), {
      body,
      headers:         this.buildHeaders(options?.headers),
      params:          this.buildParams(options?.params),
      withCredentials: options?.withCredentials ?? true,
      context:         options?.context,
    });
  }

  delete<T>(endpoint: string, options?: ApiOptions): Observable<T> {
    return this.http.request<T>('DELETE', this.buildUrl(endpoint), {
      headers:         this.buildHeaders(options?.headers),
      params:          this.buildParams(options?.params),
      withCredentials: options?.withCredentials ?? true,
      context:         options?.context,
    });
  }

  // ============ PRIVADOS ============

  private buildUrl(endpoint: string): string {
    const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${clean}`;
  }

  private buildHeaders(
    headers?: HttpHeaders | Record<string, string>
  ): HttpHeaders | undefined {
    if (!headers) return undefined;
    if (headers instanceof HttpHeaders) return headers;
    return new HttpHeaders(headers);
  }

  private buildParams(
    params?: HttpParams | Record<string, string>
  ): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;

    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }
}
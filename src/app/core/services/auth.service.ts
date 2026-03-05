import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginDto } from '../models/auth.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;  
  private tokenKey = 'access_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();  

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true // ← IMPORTANTE para cookies!
    }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, {
    withCredentials: true
  }).pipe(
    tap(response => {
      localStorage.setItem(this.tokenKey, response.token);
      this.isAuthenticatedSubject.next(true);
    }),
    catchError(error => {
      console.error('Erro no refresh token', error);
      // NÃO FAZ LOGOUT AQUI! Deixa o interceptor tratar
      return throwError(() => error);
    })
  );
}

  logout(): Observable<any> {
    // Se não tem token, só limpa localStorage
    if (!this.getToken()) {
      localStorage.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
      return new Observable(observer => observer.complete());
    }

    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Erro no logout, limpando sessão local', error);
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
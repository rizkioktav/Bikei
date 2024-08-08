import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  authStatus = this.loggedIn.asObservable();

  private apiUrl = environment.apiUrl;

  constructor(
    private token: TokenService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loggedIn.next(this.token.loggedIn());
  }

  setAuthToken(token: string) {
    this.token.handle(token);
    console.log('Token set in AuthService:', token);
    this.loggedIn.next(true);
  }

  getAuthToken(): string | null {
    return this.token.get();
  }

  removeAuthToken() {
    this.token.remove();
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this.token.loggedIn();
  }

  loginWithGoogle(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google/callback`, { token }).pipe(
      catchError(error => {
        console.error('Google login error:', error);
        return throwError(() => new Error('Google login failed'));
      })
    );
  }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/api/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, data).pipe(
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): Observable<any> {
    console.log('Logging out...');
    return this.http.post<any>(`${this.apiUrl}/api/logout`, {}).pipe(
      tap(() => {
        this.removeAuthToken();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return throwError(() => new Error('Logout failed'));
      })
    );
  }

  hasCompany(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/api/user/companies`).pipe(
      map(response => response.success && response.companies && response.companies.length > 0)
    );
  }
}

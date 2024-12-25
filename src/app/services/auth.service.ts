// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000'; // Backend server URL
  private TOKEN_KEY = 'auth_token';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('current_user');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Register a new user
  register(name: string, email: string, password: string): Observable<boolean> {
    return this.http.post<{ message: string }>(`${this.API_URL}/register`, { name, email, password })
      .pipe(
        map(response => response.message === 'User registered successfully.'),
        catchError(error => {
          console.error('Registration error:', error);
          return of(false);
        })
      );
  }

  // Login user
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string, user: User }>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem('current_user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        map(response => !!response.token),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  // Get JWT Token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Get current user synchronously
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}

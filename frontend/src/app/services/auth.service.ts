import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegistroRequest, Usuario } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private usuarioSignal = signal<Usuario | null>(this.getStoredUser());

  usuario = this.usuarioSignal.asReadonly();
  isAuthenticated = computed(() => !!this.usuarioSignal());
  userRole = computed(() => this.usuarioSignal()?.rol ?? '');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          const usuario: Usuario = {
            username: response.username,
            rol: response.rol,
            token: response.token
          };
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioSignal.set(usuario);
        })
      );
  }

  registro(data: RegistroRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/registro`, data, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.usuarioSignal()?.token ?? null;
  }

  private getStoredUser(): Usuario | null {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  }
}

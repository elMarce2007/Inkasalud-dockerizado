import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <h1>Registro de Usuario</h1>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username">
              <mat-icon matPrefix>person</mat-icon>
              @if (registroForm.get('username')?.hasError('required') && registroForm.get('username')?.touched) {
                <mat-error>El usuario es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contrasena</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
              @if (registroForm.get('password')?.hasError('required') && registroForm.get('password')?.touched) {
                <mat-error>La contrasena es requerida</mat-error>
              }
              @if (registroForm.get('password')?.hasError('minlength') && registroForm.get('password')?.touched) {
                <mat-error>Minimo 6 caracteres</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="rol">
                <mat-option value="ADMIN">Administrador</mat-option>
                <mat-option value="VENDEDOR">Vendedor</mat-option>
                <mat-option value="USUARIO">Usuario</mat-option>
              </mat-select>
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary"
                    type="submit"
                    class="full-width"
                    [disabled]="loading() || registroForm.invalid">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Registrarse
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <a mat-button routerLink="/auth/login">Ya tengo una cuenta</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  registroForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['USUARIO', Validators.required]
  });

  onSubmit() {
    if (this.registroForm.invalid) return;

    this.loading.set(true);
    this.authService.registro(this.registroForm.getRawValue()).subscribe({
      next: (message) => {
        this.snackBar.open(message || 'Usuario registrado exitosamente', 'OK', { duration: 3000 });
        this.router.navigate(['/auth/login']);
      },
      error: () => this.loading.set(false)
    });
  }
}

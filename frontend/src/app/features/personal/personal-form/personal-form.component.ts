import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonalService } from '../../../services/personal.service';

@Component({
  selector: 'app-personal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ id() ? 'Editar' : 'Nuevo' }} Personal</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombres</mat-label>
                <input matInput formControlName="nombres">
                @if (form.get('nombres')?.hasError('required') && form.get('nombres')?.touched) {
                  <mat-error>Nombres es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Apellidos</mat-label>
                <input matInput formControlName="apellidos">
                @if (form.get('apellidos')?.hasError('required') && form.get('apellidos')?.touched) {
                  <mat-error>Apellidos es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cargo</mat-label>
                <input matInput formControlName="cargo">
                @if (form.get('cargo')?.hasError('required') && form.get('cargo')?.touched) {
                  <mat-error>Cargo es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
                @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
                  <mat-error>Email es requerido</mat-error>
                }
                @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                  <mat-error>Email no valido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="form.invalid || loading()">
                {{ id() ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class PersonalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private personalService = inject(PersonalService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  id = input<string>();
  loading = signal(false);

  form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    cargo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    if (this.id()) {
      this.cargarPersonal();
    }
  }

  cargarPersonal() {
    this.personalService.obtener(+this.id()!).subscribe(personal => {
      this.form.patchValue(personal);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const personal = this.form.getRawValue();

    const operacion = this.id()
      ? this.personalService.actualizar(+this.id()!, personal)
      : this.personalService.crear(personal);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          `Personal ${this.id() ? 'actualizado' : 'creado'} exitosamente`,
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/personal']);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/personal']);
  }
}

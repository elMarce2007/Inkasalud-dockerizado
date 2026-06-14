import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
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
          <mat-card-title>{{ id() ? 'Editar' : 'Nuevo' }} Cliente</mat-card-title>
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
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" maxlength="8">
                @if (form.get('dni')?.hasError('required') && form.get('dni')?.touched) {
                  <mat-error>DNI es requerido</mat-error>
                }
                @if (form.get('dni')?.hasError('pattern') && form.get('dni')?.touched) {
                  <mat-error>DNI debe tener 8 digitos</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Telefono</mat-label>
                <input matInput formControlName="telefono">
                @if (form.get('telefono')?.hasError('required') && form.get('telefono')?.touched) {
                  <mat-error>Telefono es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
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
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  id = input<string>();
  loading = signal(false);

  form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    telefono: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    if (this.id()) {
      this.cargarCliente();
    }
  }

  cargarCliente() {
    this.clienteService.obtener(+this.id()!).subscribe(cliente => {
      this.form.patchValue(cliente);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const cliente = this.form.getRawValue();

    const operacion = this.id()
      ? this.clienteService.actualizar(+this.id()!, cliente)
      : this.clienteService.crear(cliente);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          `Cliente ${this.id() ? 'actualizado' : 'creado'} exitosamente`,
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/clientes']);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}

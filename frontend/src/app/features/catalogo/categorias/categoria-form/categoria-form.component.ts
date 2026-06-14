import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoriaService } from '../../../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
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
          <mat-card-title>{{ id() ? 'Editar' : 'Nueva' }} Categoria</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre">
                @if (form.get('nombre')?.hasError('required') && form.get('nombre')?.touched) {
                  <mat-error>Nombre es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripcion</mat-label>
                <textarea matInput formControlName="descripcion" rows="3"></textarea>
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
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  id = input<string>();
  loading = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit() {
    if (this.id()) {
      this.cargarCategoria();
    }
  }

  cargarCategoria() {
    this.categoriaService.obtener(+this.id()!).subscribe(categoria => {
      this.form.patchValue(categoria);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const categoria = this.form.getRawValue();

    const operacion = this.id()
      ? this.categoriaService.actualizar(+this.id()!, categoria)
      : this.categoriaService.crear(categoria);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          `Categoria ${this.id() ? 'actualizada' : 'creada'} exitosamente`,
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/catalogo/categorias']);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/catalogo/categorias']);
  }
}

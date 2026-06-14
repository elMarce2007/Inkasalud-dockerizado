import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductoService } from '../../../../services/producto.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from '../../../../models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ id() ? 'Editar' : 'Nuevo' }} Producto</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre">
                @if (form.get('nombre')?.hasError('required') && form.get('nombre')?.touched) {
                  <mat-error>Nombre es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Categoria</mat-label>
                <mat-select formControlName="categoriaId">
                  @for (cat of categorias(); track cat.id) {
                    <mat-option [value]="cat.id">{{ cat.nombre }}</mat-option>
                  }
                </mat-select>
                @if (form.get('categoriaId')?.hasError('required') && form.get('categoriaId')?.touched) {
                  <mat-error>Categoria es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Precio</mat-label>
                <input matInput type="number" formControlName="precio" step="0.01">
                <span matTextPrefix>S/&nbsp;</span>
                @if (form.get('precio')?.hasError('required') && form.get('precio')?.touched) {
                  <mat-error>Precio es requerido</mat-error>
                }
                @if (form.get('precio')?.hasError('min') && form.get('precio')?.touched) {
                  <mat-error>Precio debe ser mayor a 0</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Stock</mat-label>
                <input matInput type="number" formControlName="stock">
                @if (form.get('stock')?.hasError('required') && form.get('stock')?.touched) {
                  <mat-error>Stock es requerido</mat-error>
                }
                @if (form.get('stock')?.hasError('min') && form.get('stock')?.touched) {
                  <mat-error>Stock no puede ser negativo</mat-error>
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
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  id = input<string>();
  loading = signal(false);
  categorias = signal<Categoria[]>([]);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoriaId: [0 as number, Validators.required]
  });

  ngOnInit() {
    this.cargarCategorias();
    if (this.id()) {
      this.cargarProducto();
    }
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe(data => {
      this.categorias.set(data);
    });
  }

  cargarProducto() {
    this.productoService.obtener(+this.id()!).subscribe(producto => {
      this.form.patchValue(producto);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const producto = this.form.getRawValue();

    const operacion = this.id()
      ? this.productoService.actualizar(+this.id()!, producto)
      : this.productoService.crear(producto);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          `Producto ${this.id() ? 'actualizado' : 'creado'} exitosamente`,
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/catalogo/productos']);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/catalogo/productos']);
  }
}

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { VentaService } from '../../../services/venta.service';
import { Cliente } from '../../../models/cliente.model';
import { Producto } from '../../../models/producto.model';
import { DetalleVenta } from '../../../models/venta.model';

@Component({
  selector: 'app-venta-nueva',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="venta-container">
      <div class="page-header">
        <h1>Nueva Venta</h1>
      </div>

      <div class="venta-grid">
        <!-- Panel Cliente -->
        <mat-card class="cliente-card">
          <mat-card-header>
            <mat-card-title>Cliente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Seleccionar Cliente</mat-label>
              <mat-select [(value)]="clienteSeleccionado">
                @for (cliente of clientes(); track cliente.id) {
                  <mat-option [value]="cliente">
                    {{ cliente.nombres }} {{ cliente.apellidos }} - {{ cliente.dni }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Panel Agregar Producto -->
        <mat-card class="producto-card">
          <mat-card-header>
            <mat-card-title>Agregar Producto</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="productoForm" (ngSubmit)="agregarProducto()">
              <mat-form-field appearance="outline">
                <mat-label>Producto</mat-label>
                <mat-select formControlName="producto">
                  @for (producto of productos(); track producto.id) {
                    <mat-option [value]="producto" [disabled]="producto.stock === 0">
                      {{ producto.nombre }} - S/{{ producto.precio }} (Stock: {{ producto.stock }})
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" formControlName="cantidad" min="1">
              </mat-form-field>

              <button mat-raised-button color="accent" type="submit"
                      [disabled]="productoForm.invalid">
                <mat-icon>add_shopping_cart</mat-icon> Agregar
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabla de Detalles -->
      <mat-card class="detalles-card">
        <mat-card-header>
          <mat-card-title>Detalle de Venta</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="detalles()" class="full-width">
            <ng-container matColumnDef="producto">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let row">{{ row.productoNombre }}</td>
            </ng-container>

            <ng-container matColumnDef="cantidad">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let row">{{ row.cantidad }}</td>
            </ng-container>

            <ng-container matColumnDef="precioUnitario">
              <th mat-header-cell *matHeaderCellDef>Precio Unit.</th>
              <td mat-cell *matCellDef="let row">{{ row.precioUnitario | currency:'PEN':'S/ ' }}</td>
            </ng-container>

            <ng-container matColumnDef="subtotal">
              <th mat-header-cell *matHeaderCellDef>Subtotal</th>
              <td mat-cell *matCellDef="let row">{{ row.subtotal | currency:'PEN':'S/ ' }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let row; let i = index">
                <button mat-icon-button color="warn" (click)="eliminarDetalle(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="5" style="text-align: center; padding: 20px;">
                Agregue productos a la venta
              </td>
            </tr>
          </table>

          <div class="total-section">
            <h2>TOTAL: {{ total() | currency:'PEN':'S/ ' }}</h2>
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button (click)="cancelar()">Cancelar</button>
          <button mat-raised-button color="primary"
                  (click)="confirmarVenta()"
                  [disabled]="!clienteSeleccionado || detalles().length === 0 || loading()">
            <mat-icon>check</mat-icon> Confirmar Venta
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class VentaNuevaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private ventaService = inject(VentaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  clientes = signal<Cliente[]>([]);
  productos = signal<Producto[]>([]);
  detalles = signal<DetalleVenta[]>([]);
  clienteSeleccionado: Cliente | null = null;
  loading = signal(false);

  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal', 'acciones'];

  total = computed(() =>
    this.detalles().reduce((sum, d) => sum + d.subtotal, 0)
  );

  productoForm = this.fb.group({
    producto: [null as Producto | null, Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.clienteService.listar().subscribe(data => this.clientes.set(data));
    this.productoService.listar().subscribe(data => this.productos.set(data));
  }

  agregarProducto() {
    const { producto, cantidad } = this.productoForm.value;
    if (!producto || !cantidad) return;

    if (cantidad > producto.stock) {
      this.snackBar.open('Stock insuficiente', 'OK', { duration: 3000 });
      return;
    }

    const detalle: DetalleVenta = {
      productoId: producto.id!,
      productoNombre: producto.nombre,
      cantidad: cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cantidad
    };

    this.detalles.update(arr => [...arr, detalle]);
    this.productoForm.reset({ cantidad: 1 });
  }

  eliminarDetalle(index: number) {
    this.detalles.update(arr => arr.filter((_, i) => i !== index));
  }

  confirmarVenta() {
    if (!this.clienteSeleccionado) return;

    this.loading.set(true);
    const venta = {
      clienteId: this.clienteSeleccionado.id!,
      detalles: this.detalles().map(d => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))
    };

    this.ventaService.crear(venta).subscribe({
      next: () => {
        this.snackBar.open('Venta registrada exitosamente', 'OK', { duration: 3000 });
        this.router.navigate(['/ventas']);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/ventas']);
  }
}

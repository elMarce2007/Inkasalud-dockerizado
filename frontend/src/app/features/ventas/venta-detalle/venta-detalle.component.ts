import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/venta.model';

@Component({
  selector: 'app-venta-detalle',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Detalle de Venta #{{ venta()?.id }}</h1>
        <button mat-button (click)="volver()">
          <mat-icon>arrow_back</mat-icon> Volver
        </button>
      </div>

      @if (venta()) {
        <mat-card>
          <mat-card-content>
            <div class="venta-info">
              <div class="info-item">
                <strong>Fecha:</strong>
                <span>{{ venta()!.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item">
                <strong>Cliente ID:</strong>
                <span>{{ venta()!.clienteId }}</span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <h3>Productos</h3>
            <table mat-table [dataSource]="venta()!.detalles" class="full-width">
              <ng-container matColumnDef="productoId">
                <th mat-header-cell *matHeaderCellDef>Producto ID</th>
                <td mat-cell *matCellDef="let row">{{ row.productoId }}</td>
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

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="total-section">
              <h2>TOTAL: {{ venta()!.total | currency:'PEN':'S/ ' }}</h2>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .venta-info {
      display: flex;
      gap: 32px;
      margin-bottom: 16px;
    }
    .info-item {
      display: flex;
      gap: 8px;
    }
    h3 {
      margin: 16px 0;
    }
    .total-section {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
      background: rgba(63, 81, 181, 0.08);
      border-radius: 4px;
      margin-top: 16px;
    }
    .total-section h2 {
      margin: 0;
      color: #3f51b5;
    }
  `]
})
export class VentaDetalleComponent implements OnInit {
  private ventaService = inject(VentaService);
  private router = inject(Router);

  id = input<string>();
  venta = signal<Venta | null>(null);

  displayedColumns = ['productoId', 'cantidad', 'precioUnitario', 'subtotal'];

  ngOnInit() {
    if (this.id()) {
      this.ventaService.obtener(+this.id()!).subscribe(data => {
        this.venta.set(data);
      });
    }
  }

  volver() {
    this.router.navigate(['/ventas']);
  }
}

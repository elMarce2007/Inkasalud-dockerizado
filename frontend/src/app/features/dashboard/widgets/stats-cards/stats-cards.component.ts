import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="stats-container">
      <mat-card class="stat-card clientes">
        <mat-icon>people</mat-icon>
        <div class="stat-content">
          <span class="stat-value">{{ totalClientes() }}</span>
          <span class="stat-label">Clientes</span>
        </div>
      </mat-card>

      <mat-card class="stat-card productos">
        <mat-icon>inventory_2</mat-icon>
        <div class="stat-content">
          <span class="stat-value">{{ totalProductos() }}</span>
          <span class="stat-label">Productos</span>
        </div>
      </mat-card>

      <mat-card class="stat-card ventas">
        <mat-icon>point_of_sale</mat-icon>
        <div class="stat-content">
          <span class="stat-value">{{ totalVentas() }}</span>
          <span class="stat-label">Ventas</span>
        </div>
      </mat-card>

      <mat-card class="stat-card personal">
        <mat-icon>badge</mat-icon>
        <div class="stat-content">
          <span class="stat-value">{{ totalPersonal() }}</span>
          <span class="stat-label">Personal</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class StatsCardsComponent {
  totalClientes = input(0);
  totalProductos = input(0);
  totalVentas = input(0);
  totalPersonal = input(0);
}

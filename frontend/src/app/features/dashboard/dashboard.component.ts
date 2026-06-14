import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';

import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { PersonalService } from '../../services/personal.service';
import { StatsCardsComponent } from './widgets/stats-cards/stats-cards.component';
import { Venta } from '../../models/venta.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    BaseChartDirective,
    StatsCardsComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>

      <app-stats-cards
        [totalClientes]="stats().clientes"
        [totalProductos]="stats().productos"
        [totalVentas]="stats().ventas"
        [totalPersonal]="stats().personal" />

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Ventas por Mes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
                    [data]="ventasChartData"
                    [options]="barChartOptions"
                    type="bar">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Stock de Productos (Top 10 menor stock)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
                    [data]="stockChartData"
                    [options]="stockChartOptions"
                    type="bar">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: ``
})
export class DashboardComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private ventaService = inject(VentaService);
  private personalService = inject(PersonalService);

  stats = signal({ clientes: 0, productos: 0, ventas: 0, personal: 0 });

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  stockChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { beginAtZero: true }
    }
  };

  ventasChartData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'Ventas (S/)',
      backgroundColor: 'rgba(63, 81, 181, 0.7)',
      borderColor: 'rgba(63, 81, 181, 1)',
      borderWidth: 1
    }]
  };

  stockChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Stock',
      backgroundColor: 'rgba(255, 152, 0, 0.7)',
      borderColor: 'rgba(255, 152, 0, 1)',
      borderWidth: 1
    }]
  };

  ngOnInit() {
    this.loadStats();
    this.loadChartData();
  }

  private loadStats() {
    forkJoin({
      clientes: this.clienteService.listar(),
      productos: this.productoService.listar(),
      ventas: this.ventaService.listar(),
      personal: this.personalService.listar()
    }).subscribe({
      next: (data) => {
        this.stats.set({
          clientes: data.clientes.length,
          productos: data.productos.length,
          ventas: data.ventas.length,
          personal: data.personal.length
        });
      },
      error: () => {
        // Si hay error, mantener valores en 0
      }
    });
  }

  private loadChartData() {
    this.ventaService.listar().subscribe({
      next: (ventas) => {
        const ventasPorMes = this.agruparVentasPorMes(ventas);
        this.ventasChartData = {
          ...this.ventasChartData,
          datasets: [{
            ...this.ventasChartData.datasets[0],
            data: ventasPorMes
          }]
        };
      }
    });

    this.productoService.listar().subscribe({
      next: (productos) => {
        const topProductos = productos
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 10);

        this.stockChartData = {
          labels: topProductos.map(p => p.nombre.substring(0, 20)),
          datasets: [{
            ...this.stockChartData.datasets[0],
            data: topProductos.map(p => p.stock)
          }]
        };
      }
    });
  }

  private agruparVentasPorMes(ventas: Venta[]): number[] {
    const meses = new Array(12).fill(0);
    ventas.forEach(v => {
      const fecha = new Date(v.fecha);
      const mes = fecha.getMonth();
      meses[mes] += v.total;
    });
    return meses;
  }
}

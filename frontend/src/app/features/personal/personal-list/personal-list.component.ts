import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonalService } from '../../../services/personal.service';
import { Personal } from '../../../models/personal.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-personal-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Personal</h1>
        <div class="header-actions">
          <button mat-raised-button class="btn-excel" (click)="descargarReporte()">
            <mat-icon>description</mat-icon> Exportar
          </button>
          <button mat-raised-button color="primary" routerLink="nuevo">
            <mat-icon>add</mat-icon> Nuevo Personal
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Buscar</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Buscar personal...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
              <td mat-cell *matCellDef="let row">{{ row.id }}</td>
            </ng-container>

            <ng-container matColumnDef="nombres">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombres</th>
              <td mat-cell *matCellDef="let row">{{ row.nombres }}</td>
            </ng-container>

            <ng-container matColumnDef="apellidos">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Apellidos</th>
              <td mat-cell *matCellDef="let row">{{ row.apellidos }}</td>
            </ng-container>

            <ng-container matColumnDef="cargo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Cargo</th>
              <td mat-cell *matCellDef="let row">{{ row.cargo }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let row">{{ row.email }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="primary" [routerLink]="['editar', row.id]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminar(row)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6" style="text-align: center; padding: 20px;">
                No se encontraron resultados
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-excel {
      background-color: #1D7044;
      color: #ffffff;
    }

    .btn-excel:hover {
      background-color: #155c36;
    }
  `
})
export class PersonalListComponent implements OnInit, AfterViewInit {
  private personalService = inject(PersonalService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['id', 'nombres', 'apellidos', 'cargo', 'email', 'acciones'];
  dataSource = new MatTableDataSource<Personal>();

  ngOnInit() {
    this.cargarDatos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarDatos() {
    this.personalService.listar().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  descargarReporte() {
    this.personalService.descargarReporte().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `personal_${new Date().toISOString().slice(0, 10)}.csv`;
        enlace.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Reporte descargado', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al generar el reporte', 'OK', { duration: 3000 });
      }
    });
  }

  eliminar(personal: Personal) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Personal',
        message: `Esta seguro de eliminar a ${personal.nombres} ${personal.apellidos}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && personal.id) {
        this.personalService.eliminar(personal.id).subscribe(() => {
          this.snackBar.open('Personal eliminado', 'OK', { duration: 3000 });
          this.cargarDatos();
        });
      }
    });
  }
}
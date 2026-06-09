import { Component, input, output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button (click)="toggleSidenav.emit()">
        <mat-icon>{{ sidenavOpened() ? 'menu_open' : 'menu' }}</mat-icon>
      </button>

      <span class="spacer"></span>

      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="user-info" mat-menu-item disabled>
          <strong>{{ authService.usuario()?.username }}</strong>
          <small>{{ authService.usuario()?.rol }}</small>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
          <span>Cerrar sesion</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: ``
})
export class ToolbarComponent {
  sidenavOpened = input(true);
  toggleSidenav = output<void>();

  authService = inject(AuthService);
}

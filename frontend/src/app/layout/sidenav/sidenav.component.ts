import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  template: `
    <div class="sidenav-header">
      <mat-icon class="logo">local_pharmacy</mat-icon>
      @if (expanded()) {
        <span class="brand-name">InkaSalud</span>
      }
    </div>

    <mat-nav-list>
      @for (item of navItems; track item.route) {
        <a mat-list-item
           [routerLink]="item.route"
           routerLinkActive="active"
           [matTooltip]="!expanded() ? item.label : ''"
           matTooltipPosition="right">
          <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
          @if (expanded()) {
            <span matListItemTitle>{{ item.label }}</span>
          }
        </a>
      }
    </mat-nav-list>

    <div class="sidenav-footer">
      <button mat-icon-button (click)="toggleExpand.emit()">
        <mat-icon>{{ expanded() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
      </button>
    </div>
  `,
  styles: ``
})
export class SidenavComponent {
  expanded = input(true);
  toggleExpand = output<void>();

  authService = inject(AuthService);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Clientes', icon: 'people', route: '/clientes' },
    { label: 'Categorias', icon: 'category', route: '/catalogo/categorias' },
    { label: 'Productos', icon: 'inventory_2', route: '/catalogo/productos' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/ventas' },
    { label: 'Personal', icon: 'badge', route: '/personal' }
  ];
}

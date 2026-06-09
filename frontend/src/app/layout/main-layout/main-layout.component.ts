import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SidenavComponent,
    ToolbarComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #sidenav
        mode="side"
        [opened]="sidenavOpened()"
        class="sidenav"
        [class.collapsed]="!sidenavExpanded()">
        <app-sidenav
          [expanded]="sidenavExpanded()"
          (toggleExpand)="toggleSidenavExpand()" />
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <app-toolbar
          (toggleSidenav)="toggleSidenav()"
          [sidenavOpened]="sidenavOpened()" />
        <main class="main-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ``
})
export class MainLayoutComponent {
  sidenavOpened = signal(true);
  sidenavExpanded = signal(true);

  toggleSidenav() {
    this.sidenavOpened.update(v => !v);
  }

  toggleSidenavExpand() {
    this.sidenavExpanded.update(v => !v);
  }
}

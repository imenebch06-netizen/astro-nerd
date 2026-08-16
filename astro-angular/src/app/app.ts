import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Astro Imene';

  navLinks = [
    { path: '/home', label: 'Home', icon: 'auto_awesome' },
    { path: '/explore', label: 'Explore Space', icon: 'public' },
    { path: '/theories', label: 'Physics & Theories', icon: 'science' },
    { path: '/lab', label: 'Stargazer Lab', icon: 'gamepad' }
  ];
}
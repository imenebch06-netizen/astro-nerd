import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.isDarkMode.set(initialDark);

      effect(() => {
        const dark = this.isDarkMode();
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
  }
}
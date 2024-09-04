import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private activeTheme: string = 'light';

  constructor() {
    // // Check if a theme is already set in localStorage
    // const storedTheme = localStorage.getItem('theme');
    // // if (storedTheme) {
    // //   this.setTheme(storedTheme);
    // // }
  }

  setTheme(theme: string) {
    this.activeTheme = theme;
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    if (this.activeTheme === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  getActiveTheme(): string {
    return this.activeTheme;
  }
}

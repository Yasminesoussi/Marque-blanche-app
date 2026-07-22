import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_THEME, ThemeColors } from './theme.model';

const STORAGE_KEY = 'wl_theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<ThemeColors>(this.loadFromStorage());

  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  getTheme(): ThemeColors {
    return this.themeSubject.value;
  }

  applyTheme(colors: ThemeColors): void {
    const root = document.documentElement;
    root.style.setProperty('--wl-primary', colors.primaryColor);
    root.style.setProperty('--wl-primary-dark', this.darken(colors.primaryColor, 0.22));
    root.style.setProperty('--wl-primary-soft', this.lighten(colors.primaryColor, 0.35));
    root.style.setProperty('--wl-secondary', colors.secondaryColor);
    root.style.setProperty('--wl-accent', colors.secondaryColor);
  }

  saveTheme(colors: ThemeColors): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    this.themeSubject.next(colors);
    this.applyTheme(colors);
  }

  resetTheme(): ThemeColors {
    localStorage.removeItem(STORAGE_KEY);
    this.themeSubject.next({ ...DEFAULT_THEME });
    this.applyTheme(DEFAULT_THEME);
    return { ...DEFAULT_THEME };
  }

  private loadFromStorage(): ThemeColors {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...DEFAULT_THEME };
      }
      const parsed = JSON.parse(raw) as ThemeColors;
      if (parsed.primaryColor && parsed.secondaryColor) {
        return parsed;
      }
    } catch {
      // ignore invalid storage
    }
    return { ...DEFAULT_THEME };
  }

  private darken(hex: string, amount: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) {
      return hex;
    }
    return this.rgbToHex(
      Math.round(rgb.r * (1 - amount)),
      Math.round(rgb.g * (1 - amount)),
      Math.round(rgb.b * (1 - amount)),
    );
  }

  private lighten(hex: string, amount: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) {
      return hex;
    }
    return this.rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * amount),
      Math.round(rgb.g + (255 - rgb.g) * amount),
      Math.round(rgb.b + (255 - rgb.b) * amount),
    );
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const value = hex.replace('#', '').trim();
    if (value.length !== 6) {
      return null;
    }
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }
}

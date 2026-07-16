import { InjectionToken } from '@angular/core';

export interface BrandConfig {
  appName: string;
  tagline: string;
  primaryColor: string;
  primaryDark: string;
  accentColor: string;
  supportEmail: string;
}

export const BRAND_CONFIG: BrandConfig = {
  appName: 'Shop',
  tagline: 'Gérez votre catalogue produits',
  primaryColor: '#b89a88',
  primaryDark: '#8f7668',
  accentColor: '#a39e97',
  supportEmail: 'contact@shop.app',
};

export const BRAND = new InjectionToken<BrandConfig>('BRAND', {
  providedIn: 'root',
  factory: () => BRAND_CONFIG,
});

export function applyBrandTheme(brand: BrandConfig = BRAND_CONFIG): void {
  const root = document.documentElement;
  root.style.setProperty('--wl-primary', brand.primaryColor);
  root.style.setProperty('--wl-primary-dark', brand.primaryDark);
  root.style.setProperty('--wl-accent', brand.accentColor);
}

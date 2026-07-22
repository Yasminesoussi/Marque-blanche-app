import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';

registerLocaleData(localeFr);

const ShopPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--wl-surface-card)',
      100: 'var(--wl-surface-alt)',
      200: 'var(--wl-primary-soft)',
      300: 'var(--wl-surface)',
      400: 'var(--wl-secondary)',
      500: 'var(--wl-secondary)',
      600: 'var(--wl-primary-dark)',
      700: 'var(--wl-text-muted)',
      800: 'var(--wl-text)',
      900: 'var(--wl-border)',
      950: 'var(--wl-footer-bg)',
    },
    colorScheme: {
      light: {
        surface: {
          0: 'var(--wl-surface-card)',
          50: 'var(--wl-surface)',
          100: 'var(--wl-surface-alt)',
          200: 'var(--wl-border)',
          300: 'var(--wl-surface)',
          400: 'var(--wl-secondary)',
          500: 'var(--wl-secondary)',
          600: 'var(--wl-text-muted)',
          700: 'var(--wl-text)',
          800: 'var(--wl-text)',
          900: 'var(--wl-text)',
          950: 'var(--wl-text)',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    providePrimeNG({
      theme: {
        preset: ShopPreset,
        options: { darkModeSelector: false },
      },
      ripple: true,
    }),
    MessageService,
    ConfirmationService,
  ],
};

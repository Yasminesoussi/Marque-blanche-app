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
      50: '#f8f4ef',
      100: '#f0e8e0',
      200: '#e8ddd4',
      300: '#d6c4b6',
      400: '#c9ae9c',
      500: '#b89a88',
      600: '#a38674',
      700: '#8f7668',
      800: '#746055',
      900: '#5c4c44',
      950: '#3d332e',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#f8f4ef',
          50: '#f3eee8',
          100: '#ebe4dc',
          200: '#ddd5cc',
          300: '#cfc6bc',
          400: '#b5ada5',
          500: '#a39e97',
          600: '#7a736c',
          700: '#5c564f',
          800: '#3d3834',
          900: '#2f2b28',
          950: '#1f1c1a',
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

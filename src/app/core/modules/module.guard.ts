import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { APP_MODULES } from './module.model';
import { ModuleService } from './module.service';

export const moduleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const moduleService = inject(ModuleService);
  const router = inject(Router);
  const path = route.routeConfig?.path ?? '';

  const module = APP_MODULES.find((item) => {
    if (item.route === '/') {
      return path === '';
    }
    return item.route === `/${path}`;
  });

  if (!module || module.locked || moduleService.isEnabled(module.id)) {
    return true;
  }

  const fallback = moduleService.getFallbackRoute();
  const currentUrl = state.url.split('?')[0];

  if (currentUrl === fallback || currentUrl === fallback.replace(/\/$/, '')) {
    return router.createUrlTree(['/theme-config']);
  }

  return router.parseUrl(fallback);
};

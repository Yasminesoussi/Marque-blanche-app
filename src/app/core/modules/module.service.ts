import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  APP_MODULES,
  AppModule,
  DEFAULT_MODULE_STATE,
  ModuleState,
} from './module.model';

const STORAGE_KEY = 'wl_modules';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly stateSubject = new BehaviorSubject<ModuleState>(this.loadFromStorage());

  readonly modules$ = this.stateSubject.asObservable();

  getState(): ModuleState {
    return this.stateSubject.value;
  }

  isEnabled(moduleId: string): boolean {
    return this.stateSubject.value[moduleId] ?? true;
  }

  setEnabled(moduleId: string, enabled: boolean): void {
    const module = APP_MODULES.find((item) => item.id === moduleId);
    if (!module || module.locked) {
      return;
    }

    const next = { ...this.stateSubject.value, [moduleId]: enabled };
    this.persist(next);
  }

  resetModules(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.stateSubject.next({ ...DEFAULT_MODULE_STATE });
  }

  getVisibleNavItems(): NavItem[] {
    return APP_MODULES.filter((module) => this.isEnabled(module.id)).map((module) => ({
      label: module.label,
      icon: module.icon,
      route: module.route,
    }));
  }

  getFallbackRoute(): string {
    const visible = this.getVisibleNavItems();
    return visible.find((item) => item.route !== '/')?.route ?? visible[0]?.route ?? '/theme-config';
  }

  isRouteEnabled(path: string): boolean {
    const normalized = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
    const module = APP_MODULES.find((item) => item.route === normalized);
    if (!module) {
      return true;
    }
    return this.isEnabled(module.id);
  }

  getModulesForConfig(): AppModule[] {
    return APP_MODULES;
  }

  private persist(state: ModuleState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    this.stateSubject.next(state);
  }

  private loadFromStorage(): ModuleState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...DEFAULT_MODULE_STATE };
      }
      const parsed = JSON.parse(raw) as ModuleState;
      return { ...DEFAULT_MODULE_STATE, ...parsed, 'theme-config': true };
    } catch {
      return { ...DEFAULT_MODULE_STATE };
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModule } from '../../core/modules/module.model';
import { ModuleService } from '../../core/modules/module.service';
import { DEFAULT_THEME, ThemeColors } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-theme-config',
  imports: [FormsModule, Button, Card, ToggleSwitch],
  templateUrl: './theme-config.html',
  styleUrl: './theme-config.scss',
})
export class ThemeConfig implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly moduleService = inject(ModuleService);
  private readonly messageService = inject(MessageService);

  draft: ThemeColors = { ...DEFAULT_THEME };
  modules: AppModule[] = [];
  moduleState: Record<string, boolean> = {};

  ngOnInit(): void {
    this.draft = { ...this.themeService.getTheme() };
    this.modules = this.moduleService.getModulesForConfig();
    this.moduleState = { ...this.moduleService.getState() };
    this.moduleService.modules$.subscribe((state) => {
      this.moduleState = { ...state };
    });
  }

  onColorChange(): void {
    // L'aperçu se met à jour automatiquement via le binding avec draft
    // Le thème ne sera appliqué à l'app que lors de l'enregistrement
  }

  onModuleToggle(module: AppModule, enabled: boolean): void {
    if (module.locked) {
      return;
    }

    this.moduleService.setEnabled(module.id, enabled);
    this.messageService.add({
      severity: 'success',
      summary: enabled ? 'Module activé' : 'Module désactivé',
      detail: `« ${module.label} » est ${enabled ? 'visible' : 'masqué'} dans l'application.`,
    });
  }

  saveTheme(): void {
    this.themeService.saveTheme({ ...this.draft });
    this.messageService.add({
      severity: 'success',
      summary: 'Thème enregistré',
      detail: 'Les couleurs ont été appliquées à l\'application.',
    });
  }

  resetTheme(): void {
    this.draft = this.themeService.resetTheme();
    this.messageService.add({
      severity: 'info',
      summary: 'Thème réinitialisé',
      detail: 'Les couleurs par défaut ont été restaurées.',
    });
  }

  resetModules(): void {
    this.moduleService.resetModules();
    this.moduleState = { ...this.moduleService.getState() };
    this.messageService.add({
      severity: 'info',
      summary: 'Modules réinitialisés',
      detail: 'Tous les modules sont à nouveau activés.',
    });
  }
}

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';
import { BRAND } from '../../core/brand/brand.config';
import { NavItem, ModuleService } from '../../core/modules/module.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header implements OnInit {
  readonly brand = inject(BRAND);
  private readonly moduleService = inject(ModuleService);

  navItems: NavItem[] = [];

  ngOnInit(): void {
    this.refreshItems();
    this.moduleService.modules$.subscribe(() => this.refreshItems());
  }

  private refreshItems(): void {
    this.navItems = this.moduleService
      .getVisibleNavItems()
      .filter((item) => item.route !== '/theme-config');
  }
}

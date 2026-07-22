import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';
import { NavItem, ModuleService } from '../../core/modules/module.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar implements OnInit {
  private readonly moduleService = inject(ModuleService);

  items: NavItem[] = [];

  ngOnInit(): void {
    this.refreshItems();
    this.moduleService.modules$.subscribe(() => this.refreshItems());
  }

  private refreshItems(): void {
    this.items = this.moduleService.getVisibleNavItems();
  }
}

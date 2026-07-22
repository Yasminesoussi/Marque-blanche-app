import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { BRAND } from '../../core/brand/brand.config';
import { ModuleService } from '../../core/modules/module.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Button, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  readonly brand = inject(BRAND);
  private readonly moduleService = inject(ModuleService);

  showProductForm = true;
  showProducts = true;

  ngOnInit(): void {
    this.refreshModules();
    this.moduleService.modules$.subscribe(() => this.refreshModules());
  }

  private refreshModules(): void {
    this.showProductForm = this.moduleService.isEnabled('product-form');
    this.showProducts = this.moduleService.isEnabled('products');
  }
}

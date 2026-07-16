import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly items: NavItem[] = [
    { label: 'Accueil', icon: 'pi pi-home', route: '/' },
    { label: 'Produits', icon: 'pi pi-list', route: '/products' },
    { label: 'Nouveau produit', icon: 'pi pi-plus', route: '/product-form' },
  ];
}

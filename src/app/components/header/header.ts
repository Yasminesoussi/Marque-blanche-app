import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';
import { BRAND } from '../../core/brand/brand.config';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly brand = inject(BRAND);
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { BRAND } from '../../core/brand/brand.config';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Button, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly brand = inject(BRAND);
}

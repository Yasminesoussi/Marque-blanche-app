import { Component, inject } from '@angular/core';
import { BRAND } from '../../core/brand/brand.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly brand = inject(BRAND);
  readonly year = new Date().getFullYear();
}

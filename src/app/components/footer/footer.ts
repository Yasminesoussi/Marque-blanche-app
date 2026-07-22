import { Component, inject } from '@angular/core';
import { BRAND } from '../../core/brand/brand.config';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly brand = inject(BRAND);
  readonly year = new Date().getFullYear();
  readonly themeService = inject(ThemeService);

  get supportEmail(): string {
    const email = this.themeService.getTheme().email;
    return email || this.brand.supportEmail;
  }
}

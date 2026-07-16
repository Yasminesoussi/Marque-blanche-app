import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Stepper, StepList, Step } from 'primeng/stepper';
import {
  PRODUCT_CATEGORIES,
  ProductFormData,
  ProductMedia,
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [
    CurrencyPipe,
    FormsModule,
    Button,
    InputText,
    InputNumber,
    Textarea,
    Select,
    FileUpload,
    Card,
    Message,
    Stepper,
    StepList,
    Step,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  activeStep = 1;
  submitting = false;
  mediaLoading = false;
  step1Error = '';

  readonly categories = [...PRODUCT_CATEGORIES];

  formData: ProductFormData = {
    step1: {
      name: '',
      description: '',
      category: '',
      price: null,
      stock: 0,
      sku: '',
      brand: '',
    },
    step2: {
      images: [],
      videos: [],
    },
  };

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  goNext(): void {
    if (this.activeStep === 1 && !this.validateStep1()) {
      return;
    }
    if (this.mediaLoading) {
      this.messageService.add({
        severity: 'info',
        summary: 'Chargement',
        detail: 'Patientez le temps que les médias soient prêts.',
      });
      return;
    }
    if (this.activeStep < 3) {
      this.activeStep += 1;
    }
  }

  goPrev(): void {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
    }
  }

  async onImageSelect(event: FileSelectEvent): Promise<void> {
    await this.appendMedia('images', event.files ?? []);
  }

  async onVideoSelect(event: FileSelectEvent): Promise<void> {
    await this.appendMedia('videos', event.files ?? []);
  }

  removeImage(media: ProductMedia): void {
    this.formData.step2.images = this.formData.step2.images.filter((m) => m !== media);
  }

  removeVideo(media: ProductMedia): void {
    this.formData.step2.videos = this.formData.step2.videos.filter((m) => m !== media);
  }

  submitForm(): void {
    if (!this.validateStep1()) {
      this.activeStep = 1;
      return;
    }

    this.submitting = true;

    try {
      this.productService.addProduct({
        name: this.formData.step1.name.trim(),
        description: this.formData.step1.description.trim(),
        category: this.formData.step1.category,
        price: this.formData.step1.price ?? 0,
        stock: this.formData.step1.stock ?? 0,
        sku: this.formData.step1.sku.trim(),
        brand: this.formData.step1.brand.trim(),
        images: this.formData.step2.images,
        videos: this.formData.step2.videos,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Produit créé',
        detail: `"${this.formData.step1.name}" a été ajouté au catalogue.`,
      });

      this.router.navigate(['/products']);
    } finally {
      this.submitting = false;
    }
  }

  private async appendMedia(kind: 'images' | 'videos', files: File[]): Promise<void> {
    if (!files?.length) {
      return;
    }

    this.mediaLoading = true;
    this.cdr.markForCheck();

    try {
      const media = await this.productService.filesToMedia([...files]);
      this.formData.step2[kind] = this.mergeMedia(this.formData.step2[kind], media);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur média',
        detail: 'Impossible de lire un ou plusieurs fichiers.',
      });
    } finally {
      this.mediaLoading = false;
      this.cdr.detectChanges();
    }
  }

  private validateStep1(): boolean {
    const { name, description, category, price, stock, sku, brand } = this.formData.step1;

    if (!name?.trim()) {
      return this.fail('Veuillez saisir un nom de produit.');
    }
    if (!sku?.trim()) {
      return this.fail('Veuillez saisir un SKU.');
    }
    if (!category) {
      return this.fail('Veuillez sélectionner une catégorie.');
    }
    if (!brand?.trim()) {
      return this.fail('Veuillez saisir une marque.');
    }
    if (price === null || price === undefined || price <= 0) {
      return this.fail('Veuillez saisir un prix valide (supérieur à 0).');
    }
    if (stock === null || stock === undefined || stock < 0) {
      return this.fail('Veuillez saisir un stock valide.');
    }
    if (!description?.trim()) {
      return this.fail('Veuillez saisir une description.');
    }

    this.step1Error = '';
    return true;
  }

  private fail(message: string): boolean {
    this.step1Error = message;
    this.messageService.add({
      severity: 'warn',
      summary: 'Formulaire incomplet',
      detail: message,
    });
    return false;
  }

  private mergeMedia(existing: ProductMedia[], incoming: ProductMedia[]): ProductMedia[] {
    const keys = new Set(existing.map((m) => `${m.name}_${m.size}`));
    const unique = incoming.filter((m) => m.dataUrl && !keys.has(`${m.name}_${m.size}`));
    return [...existing, ...unique];
  }
}

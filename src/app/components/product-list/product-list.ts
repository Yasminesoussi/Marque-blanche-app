import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { Product, ProductMedia } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, DatePipe, RouterLink, Button, TableModule, Tag, Dialog, GalleriaModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  products: Product[] = [];
  galleryVisible = false;
  galleryImages: ProductMedia[] = [];
  galleryTitle = '';
  activeIndex = 0;
  videoDialogVisible = false;
  videoDialogTitle = '';
  videoDialogItems: ProductMedia[] = [];

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;
    });
  }

  openGallery(product: Product, event?: Event): void {
    event?.stopPropagation();
    const images = product.images?.filter((image) => image.dataUrl) ?? [];
    if (!images.length) {
      return;
    }
    this.galleryTitle = product.name;
    this.galleryImages = images;
    this.activeIndex = 0;
    this.galleryVisible = true;
  }

  onGalleryHide(): void {
    this.galleryVisible = false;
    this.galleryImages = [];
  }

  openVideos(product: Product, event?: Event): void {
    event?.stopPropagation();
    if (!product.videos?.length) {
      return;
    }

    this.videoDialogTitle = product.name;
    this.videoDialogItems = product.videos.filter((video) => video.dataUrl);
    this.videoDialogVisible = this.videoDialogItems.length > 0;
  }

  onVideoDialogHide(): void {
    this.videoDialogVisible = false;
    this.videoDialogItems = [];
  }

  getStockSeverity(stock: number): 'success' | 'warn' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warn';
    return 'success';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Rupture';
    if (stock < 10) return 'Faible';
    return 'En stock';
  }

  confirmDelete(product: Product): void {
    this.confirmationService.confirm({
      message: `Supprimer le produit « ${product.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.deleteProduct(product.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `« ${product.name} » a été retiré du catalogue.`,
        });
      },
    });
  }
}

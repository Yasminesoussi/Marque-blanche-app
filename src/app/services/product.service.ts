import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductMedia } from '../models/product.model';
import { MediaStorageService } from './media-storage.service';

const STORAGE_KEY = 'wl_products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private readonly mediaStorage: MediaStorageService) {
    const products = this.readFromStorage();
    this.productsSubject.next(products);
    void this.hydrateAllProducts(products);
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const productId = this.generateId();
    const storedImages = await this.storeMediaList(productId, product.images);
    const storedVideos = await this.storeMediaList(productId, product.videos);

    const created: Product = {
      ...product,
      id: productId,
      images: this.attachDataUrls(storedImages, product.images),
      videos: this.attachDataUrls(storedVideos, product.videos),
      createdAt: new Date().toISOString(),
    };

    try {
      const next = [...this.productsSubject.value, created];
      this.persistProducts(next);
      return created;
    } catch (error) {
      await this.deleteStoredMedia(productId, [...storedImages, ...storedVideos]);
      throw error;
    }
  }

  deleteProduct(id: string): void {
    const product = this.productsSubject.value.find((item) => item.id === id);
    if (product) {
      void this.deleteStoredMedia(id, [...product.images, ...product.videos]);
    }

    const next = this.productsSubject.value.filter((item) => item.id !== id);
    this.persistProducts(next);
  }

  async filesToMedia(files: File[]): Promise<ProductMedia[]> {
    return Promise.all(files.map((file) => this.fileToMedia(file)));
  }

  private fileToMedia(file: File): Promise<ProductMedia> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl.startsWith('data:')) {
          reject(new Error(`Lecture impossible pour ${file.name}`));
          return;
        }
        resolve({
          id: this.generateMediaId(),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl,
        });
      };
      reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  }

  private async storeMediaList(productId: string, media: ProductMedia[]): Promise<ProductMedia[]> {
    const stored: ProductMedia[] = [];

    for (const item of media) {
      const mediaId = item.id ?? this.generateMediaId();
      if (item.dataUrl) {
        try {
          await this.mediaStorage.save(this.mediaStorage.mediaKey(productId, mediaId), item.dataUrl);
        } catch {
          // IndexedDB indisponible : le média reste disponible en mémoire pour cette session.
        }
      }

      stored.push({
        id: mediaId,
        name: item.name,
        type: item.type,
        size: item.size,
      });
    }

    return stored;
  }

  private attachDataUrls(stored: ProductMedia[], original: ProductMedia[]): ProductMedia[] {
    const originals = new Map(original.map((item) => [`${item.name}_${item.size}`, item] as const));

    return stored.map((item) => {
      const source = originals.get(`${item.name}_${item.size}`);
      return source?.dataUrl ? { ...item, dataUrl: source.dataUrl } : item;
    });
  }

  private async hydrateAllProducts(products: Product[]): Promise<void> {
    const hydrated = await Promise.all(products.map((product) => this.hydrateProduct(product)));
    this.productsSubject.next(hydrated);
  }

  private async hydrateProduct(product: Product): Promise<Product> {
    const [images, videos] = await Promise.all([
      this.hydrateMediaList(product.id, product.images),
      this.hydrateMediaList(product.id, product.videos),
    ]);

    return { ...product, images, videos };
  }

  private async hydrateMediaList(productId: string, media: ProductMedia[]): Promise<ProductMedia[]> {
    return Promise.all(media.map((item) => this.hydrateMedia(productId, item)));
  }

  private async hydrateMedia(productId: string, media: ProductMedia): Promise<ProductMedia> {
    if (media.dataUrl) {
      return media;
    }

    if (!media.id) {
      return media;
    }

    const dataUrl = await this.mediaStorage.get(this.mediaStorage.mediaKey(productId, media.id));
    return dataUrl ? { ...media, dataUrl } : media;
  }

  private async deleteStoredMedia(productId: string, media: ProductMedia[]): Promise<void> {
    const keys = media
      .filter((item) => item.id)
      .map((item) => this.mediaStorage.mediaKey(productId, item.id!));
    await this.mediaStorage.deleteKeys(keys);
  }

  private persistProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serializeProducts(products)));
      this.productsSubject.next(products);
    } catch (error) {
      if (this.isQuotaError(error)) {
        throw new Error('STORAGE_QUOTA_EXCEEDED');
      }
      throw error;
    }
  }

  private serializeProducts(products: Product[]): Product[] {
    return products.map((product) => ({
      ...product,
      images: product.images.map(({ id, name, type, size }) => ({ id, name, type, size })),
      videos: product.videos.map(({ id, name, type, size }) => ({ id, name, type, size })),
    }));
  }

  private readFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }

  private isQuotaError(error: unknown): boolean {
    return (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.code === 22)
    );
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private generateMediaId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

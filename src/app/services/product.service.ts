import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductMedia } from '../models/product.model';

const STORAGE_KEY = 'wl_products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>(this.readFromStorage());

  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const created: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const next = [...this.productsSubject.value, created];
    this.persist(next);
    return created;
  }

  deleteProduct(id: string): void {
    const next = this.productsSubject.value.filter((p) => p.id !== id);
    this.persist(next);
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

  private persist(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  private readFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

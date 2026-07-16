export interface ProductMedia {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  brand: string;
  images: ProductMedia[];
  videos: ProductMedia[];
  createdAt: string;
}

export interface ProductFormData {
  step1: {
    name: string;
    description: string;
    category: string;
    price: number | null;
    stock: number | null;
    sku: string;
    brand: string;
  };
  step2: {
    images: ProductMedia[];
    videos: ProductMedia[];
  };
}

export const PRODUCT_CATEGORIES = [
  'Électronique',
  'Vêtements',
  'Alimentation',
  'Maison',
  'Sports',
  'Beauté',
  'Livres',
  'Autre',
] as const;

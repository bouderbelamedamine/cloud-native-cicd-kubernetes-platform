export enum Unit {
  PIECE = 'PIECE',
  KG = 'KG',
  LITER = 'LITER',
  BOX = 'BOX'
}

export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface Category {
  id?: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  quantity: number;
  unit: Unit;
  status?: ProductStatus;
  category?: Category;
}

export interface StockMovement {
  id?: number;
  quantity: number;
  date?: string;
  type: MovementType;
  product?: Product;
}
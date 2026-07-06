import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product, StockMovement } from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // ===== CATEGORIES =====
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  // ===== PRODUCTS =====
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  // ===== STOCK MOVEMENTS =====
  getMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.baseUrl}/movements`);
  }

  createMovement(productId: number, movement: StockMovement): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.baseUrl}/movements/product/${productId}`, movement);
  }
}
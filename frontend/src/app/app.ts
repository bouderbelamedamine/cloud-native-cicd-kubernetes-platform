import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from './services/stock';
import { Product, Category, StockMovement, Unit, ProductStatus, MovementType } from './models/stock.models';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private stockService = inject(StockService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  movements = signal<StockMovement[]>([]);

  newProductName = '';
  newProductQuantity: number | null = null;
  newProductUnit: Unit = Unit.PIECE;
  newProductCategoryId: number | null = null;

  newCategoryName = '';

  selectedProductId: number | null = null;
  movementQuantity: number | null = null;
  movementType: MovementType = MovementType.IN;

  units = Object.values(Unit);
  movementTypes = Object.values(MovementType);

  totalProducts = computed(() => this.products().length);
  inStockCount = computed(() => this.products().filter(p => p.status === ProductStatus.IN_STOCK).length);
  lowStockCount = computed(() => this.products().filter(p => p.status === ProductStatus.LOW_STOCK).length);
  outOfStockCount = computed(() => this.products().filter(p => p.status === ProductStatus.OUT_OF_STOCK).length);

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadMovements();
  }

  loadProducts(): void {
    this.stockService.getProducts().subscribe(data => this.products.set(data));
  }

  loadCategories(): void {
    this.stockService.getCategories().subscribe(data => this.categories.set(data));
  }

  loadMovements(): void {
    this.stockService.getMovements().subscribe(data => this.movements.set(data));
  }

  addProduct(): void {
    if (!this.newProductName.trim() || this.newProductQuantity === null) {
      return;
    }

    const product: Product = {
      name: this.newProductName,
      quantity: this.newProductQuantity,
      unit: this.newProductUnit,
      category: this.newProductCategoryId ? { id: this.newProductCategoryId, name: '' } : undefined
    };

    this.stockService.createProduct(product).subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => console.error('Error creating product:', err)
    });
  }

  deleteProduct(id: number | undefined): void {
    if (id === undefined) return;
    this.stockService.deleteProduct(id).subscribe(() => this.loadProducts());
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      return;
    }

    const category: Category = { name: this.newCategoryName };

    this.stockService.createCategory(category).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => console.error('Error creating category:', err)
    });
  }

  deleteCategory(id: number | undefined): void {
    if (id === undefined) return;
    this.stockService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.loadProducts();
      },
      error: (err) => console.error('Error deleting category:', err)
    });
  }

  addMovement(): void {
    if (this.selectedProductId === null || this.movementQuantity === null) {
      return;
    }

    const movement: StockMovement = {
      quantity: this.movementQuantity,
      type: this.movementType
    };

    this.stockService.createMovement(this.selectedProductId, movement).subscribe({
      next: () => {
        this.selectedProductId = null;
        this.movementQuantity = null;
        this.movementType = MovementType.IN;
        this.loadProducts();
        this.loadMovements();
      },
      error: (err) => console.error('Error creating movement:', err)
    });
  }

  private resetForm(): void {
    this.newProductName = '';
    this.newProductQuantity = null;
    this.newProductUnit = Unit.PIECE;
    this.newProductCategoryId = null;
  }

  getStatusClass(status: ProductStatus | undefined): string {
    switch (status) {
      case ProductStatus.IN_STOCK: return 'badge-success';
      case ProductStatus.LOW_STOCK: return 'badge-warning';
      case ProductStatus.OUT_OF_STOCK: return 'badge-danger';
      default: return '';
    }
  }

  getStatusLabel(status: ProductStatus | undefined): string {
    switch (status) {
      case ProductStatus.IN_STOCK: return 'In stock';
      case ProductStatus.LOW_STOCK: return 'Low stock';
      case ProductStatus.OUT_OF_STOCK: return 'Out of stock';
      default: return '-';
    }
  }
}
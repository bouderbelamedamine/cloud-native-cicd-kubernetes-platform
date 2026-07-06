package com.devops.backend.service;

import com.devops.backend.exception.ResourceNotFoundException;
import com.devops.backend.model.Product;
import com.devops.backend.model.ProductStatus;
import com.devops.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(Product product) {
        product.setStatus(calculateStatus(product.getQuantity()));
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public ProductStatus calculateStatus(int quantity) {
        if (quantity <= 0) {
            return ProductStatus.OUT_OF_STOCK;
        } else if (quantity < LOW_STOCK_THRESHOLD) {
            return ProductStatus.LOW_STOCK;
        } else {
            return ProductStatus.IN_STOCK;
        }
    }
}
package com.devops.backend.service;

import com.devops.backend.exception.BusinessException;
import com.devops.backend.model.MovementType;
import com.devops.backend.model.Product;
import com.devops.backend.model.StockMovement;
import com.devops.backend.repository.ProductRepository;
import com.devops.backend.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public StockMovementService(StockMovementRepository movementRepository,
                                ProductRepository productRepository,
                                ProductService productService) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
        this.productService = productService;
    }

    public List<StockMovement> getAllMovements() {
        return movementRepository.findAll();
    }

    @Transactional
    public StockMovement createMovement(Long productId, StockMovement movement) {

        Product product = productService.getProductById(productId);

        int newQuantity = calculateNewQuantity(product, movement);

        if (newQuantity < 0) {
            throw new BusinessException(
                    "Insufficient stock. Available: " + product.getQuantity()
                            + ", requested out: " + movement.getQuantity());
        }

        product.setQuantity(newQuantity);
        product.setStatus(productService.calculateStatus(newQuantity));
        productRepository.save(product);

        movement.setProduct(product);
        movement.setDate(LocalDate.now());

        return movementRepository.save(movement);
    }

    private int calculateNewQuantity(Product product, StockMovement movement) {
        if (movement.getType() == MovementType.IN) {
            return product.getQuantity() + movement.getQuantity();
        } else {
            return product.getQuantity() - movement.getQuantity();
        }
    }
}
package com.devops.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private MovementType type;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public StockMovement() {
    }

    public StockMovement(int quantity, LocalDate date, MovementType type) {
        this.quantity = quantity;
        this.date = date;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
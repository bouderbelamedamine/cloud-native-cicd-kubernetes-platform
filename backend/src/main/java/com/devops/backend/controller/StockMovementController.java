package com.devops.backend.controller;

import com.devops.backend.model.StockMovement;
import com.devops.backend.service.StockMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "*")
public class StockMovementController {

    private final StockMovementService movementService;

    public StockMovementController(StockMovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    public List<StockMovement> getAllMovements() {
        return movementService.getAllMovements();
    }

    @PostMapping("/product/{productId}")
    public StockMovement createMovement(@PathVariable Long productId,
                                        @RequestBody StockMovement movement) {
        return movementService.createMovement(productId, movement);
    }
}
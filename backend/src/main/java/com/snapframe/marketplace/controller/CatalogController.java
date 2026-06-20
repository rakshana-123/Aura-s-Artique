package com.snapframe.marketplace.controller;

import com.snapframe.marketplace.model.InventoryItem;
import com.snapframe.marketplace.repository.InventoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    @Autowired
    private InventoryRepository inventoryRepository;

    // Seeding database with initial catalog metadata on startup (FR-2.1)
    @PostConstruct
    public void seedCatalog() {
        if (inventoryRepository.count() == 0) {
            inventoryRepository.save(new InventoryItem("Acrylic Floating Desktop Frame", "FRAME", 250.0, "", "Premium optical acrylic plates."));
            inventoryRepository.save(new InventoryItem("Retro Glass Brass Border Frame", "FRAME", 400.0, "", "Vintage brass border styling."));
            inventoryRepository.save(new InventoryItem("Mini Film Layout", "FILM", 50.0, "", "Classic mini credit-card format."));
            inventoryRepository.save(new InventoryItem("Classic Square Layout", "FILM", 80.0, "", "Symmetrical 1:1 square format."));
            inventoryRepository.save(new InventoryItem("Panoramic Wide Layout", "FILM", 120.0, "", "Landscape wide layout format."));
        }
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getActiveCatalog() {
        return ResponseEntity.ok(inventoryRepository.findByActiveTrue());
    }

    @GetMapping("/frames")
    public ResponseEntity<List<InventoryItem>> getActiveFrames() {
        return ResponseEntity.ok(inventoryRepository.findByTypeAndActiveTrue("FRAME"));
    }

    @GetMapping("/films")
    public ResponseEntity<List<InventoryItem>> getActiveFilms() {
        return ResponseEntity.ok(inventoryRepository.findByTypeAndActiveTrue("FILM"));
    }
}

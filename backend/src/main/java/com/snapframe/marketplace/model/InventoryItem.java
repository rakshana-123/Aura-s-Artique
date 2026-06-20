package com.snapframe.marketplace.model;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // FRAME, FILM, KIT, etc.

    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Column(name = "image_url")
    private String imageUrl;

    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    public InventoryItem() {}

    public InventoryItem(String name, String type, Double basePrice, String imageUrl, String description) {
        this.name = name;
        this.type = type;
        this.basePrice = basePrice;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

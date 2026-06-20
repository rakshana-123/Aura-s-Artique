package com.snapframe.marketplace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @Column(name = "frame_name", nullable = false)
    private String frameName;

    @Column(name = "frame_price", nullable = false)
    private Double framePrice;

    @Column(name = "film_name", nullable = false)
    private String filmName;

    @Column(name = "film_price", nullable = false)
    private Double filmPrice;

    @Column(name = "reseller_margin", nullable = false)
    private Double resellerMargin = 0.0;

    @Column(name = "custom_text")
    private String customText;

    @Column(name = "custom_image_resolution")
    private String customImageResolution;

    @Column(name = "custom_image_url")
    private String customImageUrl;

    @Column(name = "frame_color_tint")
    private String frameColorTint;

    @Column(name = "frame_size_layout")
    private String frameSizeLayout; // Mini, Square, Wide

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "price_per_unit", nullable = false)
    private Double pricePerUnit;

    public OrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getFrameName() { return frameName; }
    public void setFrameName(String frameName) { this.frameName = frameName; }

    public Double getFramePrice() { return framePrice; }
    public void setFramePrice(Double framePrice) { this.framePrice = framePrice; }

    public String getFilmName() { return filmName; }
    public void setFilmName(String filmName) { this.filmName = filmName; }

    public Double getFilmPrice() { return filmPrice; }
    public void setFilmPrice(Double filmPrice) { this.filmPrice = filmPrice; }

    public Double getResellerMargin() { return resellerMargin; }
    public void setResellerMargin(Double resellerMargin) { this.resellerMargin = resellerMargin; }

    public String getCustomText() { return customText; }
    public void setCustomText(String customText) { this.customText = customText; }

    public String getCustomImageResolution() { return customImageResolution; }
    public void setCustomImageResolution(String customImageResolution) { this.customImageResolution = customImageResolution; }

    public String getCustomImageUrl() { return customImageUrl; }
    public void setCustomImageUrl(String customImageUrl) { this.customImageUrl = customImageUrl; }

    public String getFrameColorTint() { return frameColorTint; }
    public void setFrameColorTint(String frameColorTint) { this.frameColorTint = frameColorTint; }

    public String getFrameSizeLayout() { return frameSizeLayout; }
    public void setFrameSizeLayout(String frameSizeLayout) { this.frameSizeLayout = frameSizeLayout; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
}

package com.snapframe.marketplace.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String status = "PENDING_PAYMENT"; // PENDING_PAYMENT, PAID, IN_PRODUCTION, DISPATCHED

    @Column(name = "tracking_awb")
    private String trackingAwb;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "reseller_handle")
    private String resellerHandle;

    @Column(name = "reseller_earnings")
    private Double resellerEarnings = 0.0;

    @Column(name = "gst_amount", nullable = false)
    private Double gstAmount;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTrackingAwb() { return trackingAwb; }
    public void setTrackingAwb(String trackingAwb) { this.trackingAwb = trackingAwb; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getResellerHandle() { return resellerHandle; }
    public void setResellerHandle(String resellerHandle) { this.resellerHandle = resellerHandle; }

    public Double getResellerEarnings() { return resellerEarnings; }
    public void setResellerEarnings(Double resellerEarnings) { this.resellerEarnings = resellerEarnings; }

    public Double getGstAmount() { return gstAmount; }
    public void setGstAmount(Double gstAmount) { this.gstAmount = gstAmount; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) {
        this.items = items;
        if (items != null) {
            for (OrderItem item : items) {
                item.setOrder(this);
            }
        }
    }
}

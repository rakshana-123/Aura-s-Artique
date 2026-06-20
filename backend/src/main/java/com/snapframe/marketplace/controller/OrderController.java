package com.snapframe.marketplace.controller;

import com.snapframe.marketplace.model.Order;
import com.snapframe.marketplace.model.OrderItem;
import com.snapframe.marketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("customerName");
        String email = (String) payload.get("customerEmail");
        String address = (String) payload.get("shippingAddress");
        String resellerHandle = (String) payload.get("resellerHandle");
        List<Map<String, Object>> itemsRaw = (List<Map<String, Object>>) payload.get("items");

        if (name == null || email == null || address == null || itemsRaw == null || itemsRaw.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Insufficient checkout parameters."));
        }

        Order order = new Order();
        order.setCustomerName(name);
        order.setCustomerEmail(email);
        order.setShippingAddress(address);
        order.setResellerHandle(resellerHandle);

        double totalAmount = 0.0;
        double totalResellerEarnings = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (Map<String, Object> raw : itemsRaw) {
            OrderItem item = new OrderItem();
            item.setFrameName((String) raw.get("baseProductName"));
            item.setFramePrice(Double.valueOf(raw.get("baseProductPrice").toString()));
            item.setFilmName((String) raw.get("filmLayoutName"));
            item.setFilmPrice(Double.valueOf(raw.get("filmLayoutPrice").toString()));
            item.setResellerMargin(Double.valueOf(raw.get("resellerMargin").toString()));
            item.setCustomText((String) raw.get("customText"));
            item.setCustomImageUrl((String) raw.get("customImageUrl"));
            item.setCustomImageResolution((String) raw.get("customImageResolution"));
            item.setFrameColorTint((String) raw.get("frameColorTint"));
            item.setFrameSizeLayout((String) raw.get("frameSizeLayout"));
            
            int quantity = raw.get("quantity") != null ? (Integer) raw.get("quantity") : 1;
            item.setQuantity(quantity);

            // Matrix Pricing Formula (FR-3.2)
            // P_customer = (P_base + P_customization + M_reseller) * 1.18
            double pBase = item.getFramePrice() + item.getFilmPrice();
            double pCustomization = item.getCustomImageUrl() != null ? 50.0 : 0.0;
            double mReseller = item.getResellerMargin();
            
            double pricePerUnit = (pBase + pCustomization + mReseller) * 1.18;
            item.setPricePerUnit(pricePerUnit);
            
            totalAmount += pricePerUnit * quantity;
            totalResellerEarnings += mReseller * quantity;
            
            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setResellerEarnings(totalResellerEarnings);
        order.setGstAmount(totalAmount - (totalAmount / 1.18));
        order.setStatus("PENDING_PAYMENT"); // Default trigger (FR-2.3)

        orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("totalAmount", order.getTotalAmount());
        response.put("status", order.getStatus());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status value is required."));
        }

        var orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found."));
        }

        Order order = orderOpt.get();
        
        // Prevent editing customization after workshop operator locks fulfillment (FR-2.3)
        if (order.getStatus().equals("IN_PRODUCTION") && !newStatus.equals("DISPATCHED")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Fulfillment edits are locked on this workshop line."));
        }

        order.setStatus(newStatus);

        // Generate AWB barcode if dispatched
        if (newStatus.equalsIgnoreCase("DISPATCHED")) {
            String awb = "AWB-" + (1000000000L + new Random().nextLong(9000000000L));
            order.setTrackingAwb(awb);
        }

        orderRepository.save(order);

        return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "status", order.getStatus(),
                "trackingAwb", order.getTrackingAwb() != null ? order.getTrackingAwb() : ""
        ));
    }

    @GetMapping("/reseller/{handle}/stats")
    public ResponseEntity<?> getResellerStats(@PathVariable String handle) {
        List<Order> resellerOrders = orderRepository.findByResellerHandle(handle);

        int unitsSold = 0;
        double grossRevenue = 0.0;
        double earnings = 0.0;

        for (Order order : resellerOrders) {
            if (order.getStatus().equalsIgnoreCase("PAID") || 
                order.getStatus().equalsIgnoreCase("IN_PRODUCTION") || 
                order.getStatus().equalsIgnoreCase("DISPATCHED")) {
                
                earnings += order.getResellerEarnings();
                grossRevenue += order.getTotalAmount();
                
                for (OrderItem item : order.getItems()) {
                    unitsSold += item.getQuantity();
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("handle", handle);
        stats.put("unitsSold", unitsSold);
        stats.put("grossRevenue", grossRevenue);
        stats.put("resellerEarnings", earnings);

        return ResponseEntity.ok(stats);
    }
}

package com.snapframe.marketplace.repository;

import com.snapframe.marketplace.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmail(String customerEmail);
    List<Order> findByResellerHandle(String resellerHandle);
}

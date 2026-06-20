package com.snapframe.marketplace.repository;

import com.snapframe.marketplace.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByActiveTrue();
    List<InventoryItem> findByTypeAndActiveTrue(String type);
}

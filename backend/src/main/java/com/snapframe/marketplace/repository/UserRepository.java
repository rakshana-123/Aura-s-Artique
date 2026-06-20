package com.snapframe.marketplace.repository;

import com.snapframe.marketplace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByResellerHandle(String resellerHandle);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByResellerHandle(String resellerHandle);
}

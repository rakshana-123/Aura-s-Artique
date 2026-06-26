package com.snapframe.marketplace.controller;

import com.snapframe.marketplace.model.User;
import com.snapframe.marketplace.repository.UserRepository;
import com.snapframe.marketplace.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        String resellerHandle = request.get("resellerHandle");
        String role = request.getOrDefault("role", "CREATOR");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken."));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }
        if (resellerHandle != null && userRepository.existsByResellerHandle(resellerHandle)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reseller handle is already in use."));
        }

        User user = new User(
                username,
                passwordEncoder.encode(password),
                email,
                resellerHandle,
                role
        );
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password."));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password."));
        }

        String token = jwtUtil.generateToken(user.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("resellerHandle", user.getResellerHandle());
        response.put("resellerMargin", user.getResellerMargin());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/creator/margin")
    public ResponseEntity<?> updateMargin(@RequestBody Map<String, Object> request) {
        String username = (String) request.get("username");
        Double margin = Double.valueOf(request.get("margin").toString());

        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Creator user not found."));
        }

        User user = userOpt.get();
        user.setResellerMargin(margin);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Creator margin updated to ₹" + margin));
    }
}

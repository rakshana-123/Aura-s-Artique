package com.snapframe.marketplace.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "reseller_handle", unique = true)
    private String resellerHandle;

    @Column(name = "reseller_margin")
    private Double resellerMargin = 120.0;

    @Column(nullable = false)
    private String role = "USER";

    public User() {}

    public User(String username, String password, String email, String resellerHandle, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.resellerHandle = resellerHandle;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getResellerHandle() { return resellerHandle; }
    public void setResellerHandle(String resellerHandle) { this.resellerHandle = resellerHandle; }

    public Double getResellerMargin() { return resellerMargin; }
    public void setResellerMargin(Double resellerMargin) { this.resellerMargin = resellerMargin; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

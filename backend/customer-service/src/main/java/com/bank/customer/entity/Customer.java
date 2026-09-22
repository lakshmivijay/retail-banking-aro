package com.bank.customer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String pan;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    public Customer() {
    }

    public Customer(String name, String pan, String email) {
        this.name = name;
        this.pan = pan;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPan() {
        return pan;
    }

    public String getEmail() {
        return email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

package com.bank.customer.dto;

public record LoginResponse(
        String token,
        String username,
        String role,
        Long customerId,
        String name
) {
}

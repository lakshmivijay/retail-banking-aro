package com.bank.account.security;

import com.bank.account.entity.Role;

public record AuthPrincipal(
        String username,
        Role role,
        Long customerId,
        String name
) {

    public boolean isStaff() {
        return role == Role.STAFF;
    }

    public boolean isCustomer() {
        return role == Role.CUSTOMER;
    }
}

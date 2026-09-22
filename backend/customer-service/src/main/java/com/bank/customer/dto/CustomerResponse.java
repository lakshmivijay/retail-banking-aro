package com.bank.customer.dto;

import com.bank.customer.entity.Customer;

public record CustomerResponse(
        Long id,
        String name,
        String pan,
        String email
) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getPan(),
                customer.getEmail()
        );
    }
}

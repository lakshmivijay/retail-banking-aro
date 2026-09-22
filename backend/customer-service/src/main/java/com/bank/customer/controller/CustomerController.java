package com.bank.customer.controller;

import com.bank.customer.dto.CreateCustomerRequest;
import com.bank.customer.dto.CustomerResponse;
import com.bank.customer.security.AuthPrincipal;
import com.bank.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse create(@Valid @RequestBody CreateCustomerRequest request) {
        requireStaff();
        return service.create(request);
    }

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable Long id) {
        AuthPrincipal principal = currentPrincipal();
        if (!principal.isStaff() && !id.equals(principal.customerId())) {
            throw new AccessDeniedException("Not allowed to view this customer");
        }
        return service.getById(id);
    }

    @GetMapping
    public List<CustomerResponse> getAll() {
        requireStaff();
        return service.getAll();
    }

    private AuthPrincipal currentPrincipal() {
        return (AuthPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void requireStaff() {
        if (!currentPrincipal().isStaff()) {
            throw new AccessDeniedException("Staff access required");
        }
    }
}

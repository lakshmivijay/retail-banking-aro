package com.bank.customer.service;

import com.bank.customer.dto.CreateCustomerRequest;
import com.bank.customer.dto.CustomerResponse;
import com.bank.customer.entity.AppUser;
import com.bank.customer.entity.Customer;
import com.bank.customer.entity.Role;
import com.bank.customer.repository.AppUserRepository;
import com.bank.customer.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(
            CustomerRepository repository,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest request) {

        if (repository.existsByPan(request.getPan())) {
            throw new IllegalArgumentException("Customer with PAN already exists");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Customer with email already exists");
        }
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Customer customer = new Customer(request.getName(), request.getPan(), request.getEmail());
        Customer saved = repository.save(customer);

        AppUser loginUser = new AppUser(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                Role.CUSTOMER,
                saved.getId()
        );
        appUserRepository.save(loginUser);

        return CustomerResponse.from(saved);
    }

    public CustomerResponse getById(Long id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
        return CustomerResponse.from(customer);
    }

    public List<CustomerResponse> getAll() {
        return repository.findAll().stream().map(CustomerResponse::from).toList();
    }
}

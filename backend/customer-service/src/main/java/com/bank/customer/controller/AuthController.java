package com.bank.customer.controller;

import com.bank.customer.dto.LoginRequest;
import com.bank.customer.dto.LoginResponse;
import com.bank.customer.entity.AppUser;
import com.bank.customer.entity.Customer;
import com.bank.customer.entity.Role;
import com.bank.customer.repository.AppUserRepository;
import com.bank.customer.repository.CustomerRepository;
import com.bank.customer.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AppUserRepository appUserRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.appUserRepository = appUserRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        AppUser user =
                appUserRepository
                        .findByUsername(request.getUsername())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid username or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        String displayName = user.getUsername();

        if (user.getRole() == Role.CUSTOMER
                && user.getCustomerId() != null) {

            displayName =
                    customerRepository
                            .findById(user.getCustomerId())
                            .map(Customer::getName)
                            .orElse(user.getUsername());
        }

        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        user.getRole(),
                        user.getCustomerId(),
                        displayName);

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getCustomerId(),
                displayName);
    }
}

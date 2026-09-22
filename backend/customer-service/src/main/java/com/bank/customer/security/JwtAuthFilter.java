package com.bank.customer.security;

import com.bank.customer.entity.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = jwtService.parseToken(token);

            String username = claims.getSubject();

            Role role = Role.valueOf(
                    claims.get("role", String.class));

            Long customerId = claims.get("customerId", Long.class);

            String name = claims.get("name", String.class);

            AuthPrincipal principal =
                    new AuthPrincipal(
                            username,
                            role,
                            customerId,
                            name);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            java.util.List.of());

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception ignored) {
            // Invalid token is treated as unauthenticated.
        }

        filterChain.doFilter(request, response);
    }
}

package com.bank.account.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@Component
public class CustomerServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public CustomerServiceClient(
            RestTemplate restTemplate,
            @Value("${customer-service.base-url:http://localhost:8081}") String baseUrl) {

        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public void assertCustomerExists(Long customerId) {

        try {
            HttpHeaders headers = new HttpHeaders();
            String authHeader = currentAuthorizationHeader();
            if (authHeader != null) {
                headers.set(HttpHeaders.AUTHORIZATION, authHeader);
            }

            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/api/customers/{id}",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class,
                    customerId);

            if (response.getBody() == null) {
                throw new IllegalArgumentException("Customer not found: " + customerId);
            }

        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Customer not found: " + customerId);

        } catch (RestClientException e) {
            throw new IllegalArgumentException(
                    "Unable to verify customer " + customerId
                            + " - customer-service unreachable: " + e.getMessage());
        }
    }

    private String currentAuthorizationHeader() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (!(attrs instanceof ServletRequestAttributes servletAttrs)) {
            return null;
        }
        HttpServletRequest request = servletAttrs.getRequest();
        return request.getHeader(HttpHeaders.AUTHORIZATION);
    }
}

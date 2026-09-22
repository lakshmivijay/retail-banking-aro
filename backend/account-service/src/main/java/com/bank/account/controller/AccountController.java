package com.bank.account.controller;

import com.bank.account.dto.CreateAccountRequest;
import com.bank.account.dto.DepositRequest;
import com.bank.account.dto.WithdrawalRequest;
import com.bank.account.entity.Account;
import com.bank.account.entity.BankingTransaction;
import com.bank.account.security.AuthPrincipal;
import com.bank.account.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Account createAccount(@Valid @RequestBody CreateAccountRequest request) {
        requireStaff();
        return accountService.createAccount(request);
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        requireStaff();
        return accountService.getAllAccounts();
    }

    @GetMapping("/{accountId}")
    public Account getAccount(@PathVariable Long accountId) {
        Account account = accountService.getAccount(accountId);
        requireOwnerOrStaff(account.getCustomerId());
        return account;
    }

    @GetMapping("/customer/{customerId}")
    public List<Account> getCustomerAccounts(@PathVariable Long customerId) {
        requireOwnerOrStaff(customerId);
        return accountService.getCustomerAccounts(customerId);
    }

    @PostMapping("/{accountId}/deposit")
    public Account deposit(@PathVariable Long accountId, @Valid @RequestBody DepositRequest request) {
        Account account = accountService.getAccount(accountId);
        requireOwnerOrStaff(account.getCustomerId());
        return accountService.deposit(accountId, request);
    }

    @PostMapping("/{accountId}/withdraw")
    public Account withdraw(@PathVariable Long accountId, @Valid @RequestBody WithdrawalRequest request) {
        Account account = accountService.getAccount(accountId);
        requireOwnerOrStaff(account.getCustomerId());
        return accountService.withdraw(accountId, request);
    }

    @GetMapping("/{accountId}/transactions")
    public List<BankingTransaction> getTransactions(@PathVariable Long accountId) {
        Account account = accountService.getAccount(accountId);
        requireOwnerOrStaff(account.getCustomerId());
        return accountService.getTransactions(accountId);
    }

    private AuthPrincipal currentPrincipal() {
        return (AuthPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void requireStaff() {
        if (!currentPrincipal().isStaff()) {
            throw new AccessDeniedException("Staff access required");
        }
    }

    private void requireOwnerOrStaff(Long ownerCustomerId) {
        AuthPrincipal principal = currentPrincipal();
        if (principal.isStaff()) return;
        if (!ownerCustomerId.equals(principal.customerId())) {
            throw new AccessDeniedException("Not allowed to access this account");
        }
    }
}

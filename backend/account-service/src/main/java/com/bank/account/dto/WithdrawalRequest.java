package com.bank.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class WithdrawalRequest {

    @NotNull(message = "Withdrawal amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Withdrawal amount must be greater than zero"
    )
    private BigDecimal amount;

    public WithdrawalRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}


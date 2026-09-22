package com.bank.account.repository;

import com.bank.account.entity.BankingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<BankingTransaction, Long> {

    List<BankingTransaction>
    findByAccountIdOrderByTransactionTimeDesc(
            Long accountId);
}

import { accountApi } from "./client";

export const getAllAccounts = () =>
  accountApi.get("/api/accounts").then((res) => res.data);

export const getAccount = (accountId) =>
  accountApi.get(`/api/accounts/${accountId}`).then((res) => res.data);

export const getCustomerAccounts = (customerId) =>
  accountApi.get(`/api/accounts/customer/${customerId}`).then((res) => res.data);

export const createAccount = (payload) =>
  accountApi.post("/api/accounts", payload).then((res) => res.data);

export const deposit = (accountId, amount) =>
  accountApi
    .post(`/api/accounts/${accountId}/deposit`, { amount })
    .then((res) => res.data);

export const withdraw = (accountId, amount) =>
  accountApi
    .post(`/api/accounts/${accountId}/withdraw`, { amount })
    .then((res) => res.data);

export const getTransactions = (accountId) =>
  accountApi.get(`/api/accounts/${accountId}/transactions`).then((res) => res.data);
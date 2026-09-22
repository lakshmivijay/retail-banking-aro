import { customerApi } from "./client";

export const getCustomers = () =>
  customerApi.get("/api/customers").then((res) => res.data);

export const getCustomer = (id) =>
  customerApi.get(`/api/customers/${id}`).then((res) => res.data);

export const createCustomer = (payload) =>
  customerApi.post("/api/customers", payload).then((res) => res.data);
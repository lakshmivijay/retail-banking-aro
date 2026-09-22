import { customerApi } from "./client";

export const login = (username, password) =>
  customerApi
    .post("/api/auth/login", { username, password })
    .then((res) => res.data);

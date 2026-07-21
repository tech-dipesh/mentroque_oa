import { apiRequest } from "./client.js";
import type { AuthUser, Role } from "../types/index.js";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

const loginPathByRole: Record<Role, string> = {
  USER: "/auth/login/user",
  MENTOR: "/auth/login/mentor",
  ADMIN: "/auth/login/admin",
};

const signupPathByRole: Record<Role, string> = {
  USER: "/auth/signup/user",
  MENTOR: "/auth/signup/mentor",
  ADMIN: "/auth/signup/admin",
};

export function login(role: Role, email: string, password: string) {
  return apiRequest<LoginResponse>(loginPathByRole[role], {
    method: "POST",
    body: { email, password },
  });
}

export function signup(role: Role, name: string, email: string, password: string) {
  return apiRequest<LoginResponse>(signupPathByRole[role], {
    method: "POST",
    body: { name, email, password },
  });
}

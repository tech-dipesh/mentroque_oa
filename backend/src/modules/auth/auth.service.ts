import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";
import type { LoginInput, SignupInput } from "./auth.schema.js";

function signToken(account: { id: string; role: Role; email: string }) {
  return jwt.sign(
    { id: account.id, role: account.role, email: account.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );
}

export async function signupAs(role: Role, input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const account = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role,
    },
  });

  const token = signToken(account);

  return {
    token,
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      tags: account.tags,
      description: account.description,
      domain: account.domain,
    },
  };
}

export async function loginAs(role: Role, input: LoginInput) {
  const account = await prisma.user.findUnique({ where: { email: input.email } });

  if (!account || account.role !== role) {
    throw new AppError("No account found with these credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, account.password);

  if (!passwordMatches) {
    throw new AppError("No account found with these credentials", 401);
  }

  const token = signToken(account);

  return {
    token,
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      tags: account.tags,
      description: account.description,
      domain: account.domain,
    },
  };
}

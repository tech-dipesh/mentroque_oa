import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.js";
import { ApiError } from "../api/client.js";
import type { Role } from "../types/index.js";

interface LoginFormProps {
  role: Role;
  title: string;
  subtitle: string;
  accentClass: string;
  redirectTo: string;
  signupTo: string;
}

export function LoginForm({
  role,
  title,
  subtitle,
  accentClass,
  redirectTo,
  signupTo,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(role, email, password);
      signIn(result.user, result.token);
      navigate(redirectTo);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not log in right now";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className={`h-1 w-12 rounded-full mb-6 ${accentClass}`} />
        <h1 className="text-2xl font-semibold mb-1">{title}</h1>
        <p className="text-ink-400 text-sm mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg bg-navy-900 border border-navy-700 px-3.5 py-2.5 text-sm outline-none focus:border-ink-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg bg-navy-900 border border-navy-700 px-3.5 py-2.5 text-sm outline-none focus:border-ink-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 text-navy-950 font-medium py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-ink-500 mt-6">
          New here?{" "}
          <Link to={signupTo} className="text-ink-50 underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

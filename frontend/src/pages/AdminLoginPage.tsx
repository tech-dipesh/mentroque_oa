import { LoginForm } from "../components/LoginForm.js";

export function AdminLoginPage() {
  return (
    <LoginForm
      role="ADMIN"
      title="Admin sign in"
      subtitle="Manage mentors, review requests, and book calls."
      accentClass="bg-amber-400"
      redirectTo="/admin"
      signupTo="/signup/admin"
    />
  );
}

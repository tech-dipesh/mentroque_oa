import { SignupForm } from "../components/SignupForm.js";

export function AdminSignupPage() {
  return (
    <SignupForm
      role="ADMIN"
      title="Create an admin account"
      subtitle="Manage mentors, review requests, and book calls."
      accentClass="bg-amber-400"
      redirectTo="/admin"
      loginTo="/login/admin"
    />
  );
}

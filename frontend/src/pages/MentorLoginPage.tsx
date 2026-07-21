import { LoginForm } from "../components/LoginForm.js";

export function MentorLoginPage() {
  return (
    <LoginForm
      role="MENTOR"
      title="Mentor sign in"
      subtitle="Keep your weekly availability up to date."
      accentClass="bg-emerald-400"
      redirectTo="/mentor"
      signupTo="/signup/mentor"
    />
  );
}

import { SignupForm } from "../components/SignupForm.js";

export function UserSignupPage() {
  return (
    <SignupForm
      role="USER"
      title="Create your account"
      subtitle="Add your availability and tell us what kind of call you need."
      accentClass="bg-sky-400"
      redirectTo="/user"
      loginTo="/login/user"
    />
  );
}

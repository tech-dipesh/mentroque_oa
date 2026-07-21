import { LoginForm } from "../components/LoginForm.js";

export function UserLoginPage() {
  return (
    <LoginForm
      role="USER"
      title="User sign in"
      subtitle="Add your availability and tell us what kind of call you need."
      accentClass="bg-sky-400"
      redirectTo="/user"
      signupTo="/signup/user"
    />
  );
}

import { SignupForm } from "../components/SignupForm.js";

export function MentorSignupPage() {
  return (
    <SignupForm
      role="MENTOR"
      title="Create your mentor account"
      subtitle="An admin will fill in your tags and description afterwards."
      accentClass="bg-emerald-400"
      redirectTo="/mentor"
      loginTo="/login/mentor"
    />
  );
}

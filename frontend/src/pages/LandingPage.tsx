import { Link } from "react-router";

const roles = [
  {
    to: "/signup/user",
    loginTo: "/login/user",
    label: "I'm a User",
    description: "Add availability, request a mentoring call",
    accent: "border-sky-400/40 hover:border-sky-400",
  },
  {
    to: "/signup/mentor",
    loginTo: "/login/mentor",
    label: "I'm a Mentor",
    description: "Add your weekly availability",
    accent: "border-emerald-400/40 hover:border-emerald-400",
  },
  {
    to: "/signup/admin",
    loginTo: "/login/admin",
    label: "I'm an Admin",
    description: "Match, review, and book calls",
    accent: "border-amber-400/40 hover:border-amber-400",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-2">Mentorque</h1>
      <p className="text-ink-400 mb-10">Mentoring call scheduling, made simple</p>

      <div className="grid gap-4 w-full max-w-sm">
        {roles.map((role) => (
          <div
            key={role.to}
            className={`rounded-xl border bg-navy-900 px-5 py-4 transition-colors ${role.accent}`}
          >
            <Link to={role.to}>
              <p className="font-medium">{role.label}</p>
              <p className="text-sm text-ink-400 mt-0.5">{role.description}</p>
            </Link>
            <Link to={role.loginTo} className="text-xs text-ink-500 underline mt-2 inline-block">
              already have an account
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

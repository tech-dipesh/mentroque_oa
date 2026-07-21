import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export function Navbar({ title }: { title: string }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-ink-500">{user?.name}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="text-sm text-ink-400 hover:text-ink-50 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

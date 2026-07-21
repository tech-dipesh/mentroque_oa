import { Navbar } from "../components/Navbar.js";
import { WeeklyAvailability } from "../components/WeeklyAvailability.js";

export function MentorDashboard() {
  return (
    <div>
      <Navbar title="Mentor dashboard" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <WeeklyAvailability />
      </div>
    </div>
  );
}

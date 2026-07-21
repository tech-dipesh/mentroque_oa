import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.js";
import { WeeklyAvailability } from "../components/WeeklyAvailability.js";
import { RequestCallForm } from "../components/RequestCallForm.js";
import { MyRequestsList } from "../components/MyRequestsList.js";
import { useAuth } from "../context/AuthContext.js";
import { getMyRequests } from "../api/requests.js";
import type { CallRequest } from "../types/index.js";

export function UserDashboard() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<CallRequest[]>([]);

  useEffect(() => {
    if (!token) return;
    getMyRequests(token).then(setRequests);
  }, [token]);

  function handleCreated(request: CallRequest) {
    setRequests((current) => [request, ...current]);
  }

  return (
    <div>
      <Navbar title="User dashboard" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <WeeklyAvailability />
        <RequestCallForm onCreated={handleCreated} />

        <div className="rounded-xl border border-navy-800 bg-navy-900 p-5">
          <h2 className="font-medium mb-4">Your requests</h2>
          <MyRequestsList requests={requests} />
        </div>
      </div>
    </div>
  );
}

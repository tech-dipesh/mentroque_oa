import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.js";
import { MentorMetaEditor } from "../components/MentorMetaEditor.js";
import { RequestRecommendationsPanel } from "../components/RequestRecommendationsPanel.js";
import { useAuth } from "../context/AuthContext.js";
import { getAllMeetings, getMentors, getPendingRequests } from "../api/admin.js";
import { CALL_TYPE_LABELS } from "../utils/callTypes.js";
import { DAY_LABELS } from "../utils/days.js";
import type { AuthUser, CallRequest, Meeting } from "../types/index.js";

type Tab = "requests" | "mentors" | "meetings";

export function AdminDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>("requests");
  const [mentors, setMentors] = useState<AuthUser[]>([]);
  const [requests, setRequests] = useState<CallRequest[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (!token) return;
    getMentors(token).then(setMentors);
    getPendingRequests(token).then(setRequests);
    getAllMeetings(token).then(setMeetings);
  }, [token]);

  function handleMentorUpdated(updated: AuthUser) {
    setMentors((current) => current.map((mentor) => (mentor.id === updated.id ? updated : mentor)));
  }

  function handleBooked(meeting: Meeting) {
    setMeetings((current) => [meeting, ...current]);
    setRequests((current) => current.filter((request) => request.id !== meeting.callRequestId));
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "requests", label: `Requests (${requests.length})` },
    { key: "mentors", label: "Mentors" },
    { key: "meetings", label: "Meetings" },
  ];

  return (
    <div>
      <Navbar title="Admin dashboard" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`text-sm rounded-lg px-3.5 py-1.5 ${
                tab === item.key
                  ? "bg-primary-600 text-navy-950 font-medium"
                  : "text-ink-400 border border-navy-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "requests" && (
          <div className="space-y-2.5">
            {requests.length === 0 && (
              <p className="text-sm text-ink-500">No pending requests right now.</p>
            )}
            {requests.map((request) => (
              <RequestRecommendationsPanel
                key={request.id}
                request={request}
                onBooked={handleBooked}
              />
            ))}
          </div>
        )}

        {tab === "mentors" && (
          <div className="space-y-2.5">
            {mentors.map((mentor) => (
              <MentorMetaEditor key={mentor.id} mentor={mentor} onUpdated={handleMentorUpdated} />
            ))}
          </div>
        )}

        {tab === "meetings" && (
          <div className="space-y-2.5">
            {meetings.length === 0 && <p className="text-sm text-ink-500">Nothing booked yet.</p>}
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-lg bg-navy-950 border border-navy-800 px-4 py-3"
              >
                <p className="text-sm font-medium">{CALL_TYPE_LABELS[meeting.callType]}</p>
                <p className="text-xs text-ink-500 mt-1">
                  {meeting.user?.name} with {meeting.mentor?.name}
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  {DAY_LABELS[meeting.dayOfWeek]} · {meeting.startTime}–{meeting.endTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

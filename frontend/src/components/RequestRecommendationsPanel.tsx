import { useState } from "react";
import { bookCall, getRecommendations } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.js";
import { ApiError } from "../api/client.js";
import { CALL_TYPE_LABELS } from "../utils/callTypes.js";
import { DAY_LABELS } from "../utils/days.js";
import type { CallRequest, Meeting, MentorMatch, OverlapWindow } from "../types/index.js";

export function RequestRecommendationsPanel({
  request,
  onBooked,
}: {
  request: CallRequest;
  onBooked: (meeting: Meeting) => void;
}) {
  const { token } = useAuth();
  const [matches, setMatches] = useState<MentorMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<{ mentorId: string; window: OverlapWindow } | null>(
    null
  );
  const [error, setError] = useState("");

  async function handleLoadRecommendations() {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const result = await getRecommendations(token, request.id);
      setMatches(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load recommendations");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmBooking() {
    if (!token || !booking) return;
    setError("");

    try {
      const meeting = await bookCall(token, request.id, {
        mentorId: booking.mentorId,
        dayOfWeek: booking.window.dayOfWeek,
        startTime: booking.window.startTime,
        endTime: booking.window.endTime,
      });
      onBooked(meeting);
      setMatches(null);
      setBooking(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book this call");
    }
  }

  return (
    <div className="rounded-lg bg-navy-950 border border-navy-800 px-4 py-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{CALL_TYPE_LABELS[request.callType]}</p>
          <p className="text-xs text-ink-500">{request.user?.name}</p>
        </div>
        {!matches && (
          <button
            onClick={handleLoadRecommendations}
            disabled={loading}
            className="text-xs rounded-lg bg-primary-600 text-navy-950 font-medium px-3 py-1.5 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "See recommendations"}
          </button>
        )}
      </div>

      <p className="text-xs text-ink-400">{request.description}</p>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {matches && matches.length === 0 && (
        <p className="text-xs text-ink-500">No mentors with availability set up yet.</p>
      )}

      {matches && (
        <div className="space-y-2 pt-1">
          {matches.map((match) => (
            <div key={match.mentor.id} className="rounded-lg bg-navy-900 border border-navy-800 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{match.mentor.name}</p>
                <span className="text-xs text-ink-500">{match.reason}</span>
              </div>
              <p className="text-xs text-ink-500 mt-1">{match.mentor.description}</p>

              {match.overlapWindows.length === 0 ? (
                <p className="text-xs text-amber-400 mt-2">No overlapping availability</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {match.overlapWindows.map((window, index) => {
                    const isSelected =
                      booking?.mentorId === match.mentor.id &&
                      booking.window.dayOfWeek === window.dayOfWeek &&
                      booking.window.startTime === window.startTime;

                    return (
                      <button
                        key={index}
                        onClick={() => setBooking({ mentorId: match.mentor.id, window })}
                        className={`text-xs rounded-md px-2.5 py-1 border ${
                          isSelected
                            ? "border-primary-600 bg-primary-600 text-navy-950"
                            : "border-navy-700 text-ink-400 hover:border-ink-400"
                        }`}
                      >
                        {DAY_LABELS[window.dayOfWeek]} {window.startTime}–{window.endTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {booking && (
            <button
              onClick={handleConfirmBooking}
              className="w-full rounded-lg bg-emerald-500 text-navy-950 text-sm font-medium py-2"
            >
              Confirm booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}

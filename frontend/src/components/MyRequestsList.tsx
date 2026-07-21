import { CALL_TYPE_LABELS } from "../utils/callTypes.js";
import { DAY_LABELS } from "../utils/days.js";
import type { CallRequest } from "../types/index.js";

const statusStyles: Record<string, string> = {
  PENDING: "text-amber-400",
  MATCHED: "text-sky-400",
  BOOKED: "text-emerald-400",
};

export function MyRequestsList({ requests }: { requests: CallRequest[] }) {
  if (requests.length === 0) {
    return <p className="text-sm text-ink-500">No requests submitted yet.</p>;
  }

  return (
    <div className="space-y-2">
      {requests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg bg-navy-950 border border-navy-800 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{CALL_TYPE_LABELS[request.callType]}</p>
            <span className={`text-xs ${statusStyles[request.status]}`}>{request.status}</span>
          </div>
          <p className="text-xs text-ink-500 mt-1">{request.description}</p>

          {request.meeting && (
            <div className="mt-2 text-xs text-ink-400">
              Booked: {DAY_LABELS[request.meeting.dayOfWeek]} · {request.meeting.startTime}–
              {request.meeting.endTime} ·{" "}
              <a
                href={request.meeting.meetLink}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline"
              >
                join link
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

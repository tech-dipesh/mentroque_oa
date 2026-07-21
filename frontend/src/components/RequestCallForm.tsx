import { useState } from "react";
import { createMyRequest } from "../api/requests.js";
import { useAuth } from "../context/AuthContext.js";
import { ApiError } from "../api/client.js";
import { CALL_TYPE_LABELS } from "../utils/callTypes.js";
import type { CallRequest, CallType } from "../types/index.js";

export function RequestCallForm({ onCreated }: { onCreated: (request: CallRequest) => void }) {
  const { token } = useAuth();
  const [callType, setCallType] = useState<CallType>("RESUME_REVAMP");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      const created = await createMyRequest(token, { callType, description });
      onCreated(created);
      setDescription("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit that request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-navy-800 bg-navy-900 p-5">
      <h2 className="font-medium mb-4">Request a mentoring call</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-ink-500 mb-1">Call type</label>
          <select
            value={callType}
            onChange={(event) => setCallType(event.target.value as CallType)}
            className="w-full rounded-lg bg-navy-950 border border-navy-700 px-3 py-2 text-sm outline-none"
          >
            {Object.entries(CALL_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1">What do you need help with?</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-lg bg-navy-950 border border-navy-700 px-3 py-2 text-sm outline-none resize-none"
            placeholder="A bit of context helps us find the right mentor"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || description.trim().length < 10}
          className="rounded-lg bg-primary-600 text-navy-950 text-sm font-medium px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </div>
    </div>
  );
}

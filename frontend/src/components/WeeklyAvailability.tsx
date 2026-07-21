import { useEffect, useState } from "react";
import { addMySlot, deleteMySlot, getMySlots } from "../api/availability.js";
import { useAuth } from "../context/AuthContext.js";
import { DAY_LABELS } from "../utils/days.js";
import { ApiError } from "../api/client.js";
import type { AvailabilitySlot } from "../types/index.js";

export function WeeklyAvailability() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getMySlots(token)
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAdd() {
    if (!token) return;
    setError("");

    try {
      const created = await addMySlot(token, { dayOfWeek, startTime, endTime });
      setSlots((current) => [...current, created]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add that slot");
    }
  }

  async function handleRemove(slotId: string) {
    if (!token) return;
    await deleteMySlot(token, slotId);
    setSlots((current) => current.filter((slot) => slot.id !== slotId));
  }

  return (
    <div className="rounded-xl border border-navy-800 bg-navy-900 p-5">
      <h2 className="font-medium mb-4">Weekly availability</h2>

      <div className="flex flex-wrap gap-2 items-end mb-5">
        <div>
          <label className="block text-xs text-ink-500 mb-1">Day</label>
          <select
            value={dayOfWeek}
            onChange={(event) => setDayOfWeek(Number(event.target.value))}
            className="rounded-lg bg-navy-950 border border-navy-700 px-3 py-2 text-sm outline-none"
          >
            {DAY_LABELS.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1">Start</label>
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="rounded-lg bg-navy-950 border border-navy-700 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1">End</label>
          <input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="rounded-lg bg-navy-950 border border-navy-700 px-3 py-2 text-sm outline-none"
          />
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-primary-600 text-navy-950 text-sm font-medium px-4 py-2"
        >
          Add slot
        </button>
      </div>

      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Loading...</p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-ink-500">No availability added yet.</p>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-lg bg-navy-950 border border-navy-800 px-4 py-2.5 text-sm"
            >
              <span>
                {DAY_LABELS[slot.dayOfWeek]} · {slot.startTime} – {slot.endTime}
              </span>
              <button
                onClick={() => handleRemove(slot.id)}
                className="text-ink-500 hover:text-red-400 transition-colors text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

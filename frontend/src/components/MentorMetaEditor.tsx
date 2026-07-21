import { useState } from "react";
import { updateMentorMeta } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.js";
import { ApiError } from "../api/client.js";
import type { AuthUser } from "../types/index.js";

export function MentorMetaEditor({
  mentor,
  onUpdated,
}: {
  mentor: AuthUser;
  onUpdated: (mentor: AuthUser) => void;
}) {
  const { token } = useAuth();
  const [tagsText, setTagsText] = useState(mentor.tags.join(", "));
  const [description, setDescription] = useState(mentor.description ?? "");
  const [domain, setDomain] = useState(mentor.domain ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setError("");

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const updated = await updateMentorMeta(token, mentor.id, { tags, description, domain });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg bg-navy-950 border border-navy-800 px-4 py-3.5 space-y-2.5">
      <p className="text-sm font-medium">{mentor.name}</p>
      <p className="text-xs text-ink-500">{mentor.email}</p>

      <input
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        placeholder="Domain, e.g. Frontend Engineering"
        className="w-full rounded-lg bg-navy-900 border border-navy-700 px-3 py-2 text-xs outline-none"
      />

      <input
        value={tagsText}
        onChange={(event) => setTagsText(event.target.value)}
        placeholder="Tags, comma separated"
        className="w-full rounded-lg bg-navy-900 border border-navy-700 px-3 py-2 text-xs outline-none"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={2}
        placeholder="Description"
        className="w-full rounded-lg bg-navy-900 border border-navy-700 px-3 py-2 text-xs outline-none resize-none"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-primary-600 text-navy-950 text-xs font-medium px-3 py-1.5 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

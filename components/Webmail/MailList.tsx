"use client";

import { Mail } from "@/mock/mockMail";

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default function MailList({
  mails,
  selectedId,
  onSelect,
}: {
  mails: Mail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-80 shrink-0 overflow-y-auto border-r border-line">
      {mails.length === 0 ? (
        <div className="px-4 py-10 text-center text-xs text-muted">메일이 없습니다.</div>
      ) : (
        mails.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`block w-full border-b border-line px-4 py-3 text-left transition-colors ${
              selectedId === m.id ? "bg-surface2" : "hover:bg-surface2/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`truncate text-sm ${
                  m.read ? "text-muted" : "font-semibold text-ink"
                }`}
              >
                {m.from.split("<")[0].trim()}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted">
                {formatDate(m.time)}
              </span>
            </div>
            <div className={`mt-0.5 truncate text-sm ${m.read ? "text-muted" : "text-ink"}`}>
              {!m.read && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-normal" />}
              {m.subject}
            </div>
            <div className="mt-0.5 truncate text-xs text-muted">{m.preview}</div>
          </button>
        ))
      )}
    </div>
  );
}

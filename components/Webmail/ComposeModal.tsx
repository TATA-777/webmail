"use client";

import { useState } from "react";

export default function ComposeModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (mail: { to: string; subject: string; body: string }) => void;
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    if (!to || !subject) return;
    onSend({ to, subject, body });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex w-[520px] flex-col rounded-lg border border-line bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-sm font-semibold text-ink">새 메일</span>
          <button onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <div className="space-y-2 p-4">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="받는사람"
            className="w-full rounded-md border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-normal"
          />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="제목"
            className="w-full rounded-md border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-normal"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="본문을 입력하세요"
            rows={8}
            className="w-full resize-none rounded-md border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-normal"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface2"
          >
            취소
          </button>
          <button
            onClick={handleSend}
            disabled={!to || !subject}
            className="rounded-md bg-normal px-3 py-1.5 text-sm font-medium text-white hover:bg-normal/90 disabled:opacity-40"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}

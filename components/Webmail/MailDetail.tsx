"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { Mail } from "@/mock/mockMail";

export default function MailDetail({
  mail,
  onDelete,
}: {
  mail: Mail | null;
  onDelete?: (id: string) => void;
}) {
  // 메일 본문은 외부(발신자)가 만든 HTML이라 그대로 렌더링하면 XSS 위험이 있음.
  // 반드시 DOMPurify로 sanitize한 뒤에만 innerHTML로 넣는다.
  const safeHtml = useMemo(() => {
    if (!mail) return "";
    return DOMPurify.sanitize(mail.bodyHtml);
  }, [mail]);

  if (!mail) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        메일을 선택하면 여기에 표시됩니다.
      </div>
    );
  }

  const handleDelete = () => {
    if (!onDelete) return;
    if (!confirm("이 메일을 삭제할까요?")) return;
    onDelete(mail.id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-ink">{mail.subject}</h2>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="shrink-0 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted hover:border-danger hover:text-danger"
          >
            삭제
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-b border-line pb-3 text-sm">
        <div>
          <div className="text-ink">{mail.from}</div>
          <div className="mt-0.5 text-xs text-muted">받는사람: {mail.to}</div>
        </div>
        <span className="font-mono text-xs text-muted">
          {new Date(mail.time).toLocaleString("ko-KR")}
        </span>
      </div>

      <div
        className="mt-4 max-w-none text-sm leading-relaxed text-ink [&_p]:mb-3 [&_strong]:text-ink [&_a]:text-normal [&_a]:underline"
        // sanitize된 HTML만 여기 들어옴
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      {mail.attachments.length > 0 && (
        <div className="mt-6 border-t border-line pt-4">
          <div className="mb-2 text-xs font-semibold text-muted">
            첨부파일 {mail.attachments.length}개
          </div>
          <div className="flex flex-wrap gap-2">
            {mail.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink"
              >
                <span>📎 {att.filename}</span>
                <span className="text-muted">({att.size})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
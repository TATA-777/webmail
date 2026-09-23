"use client";

import { FOLDER_LABELS, FolderId, Mail } from "@/mock/mockMail";

const FOLDER_ORDER: FolderId[] = ["inbox", "sent", "drafts", "spam"];

export default function FolderList({
  mails,
  activeFolder,
  onSelectFolder,
  onCompose,
}: {
  mails: Mail[];
  activeFolder: FolderId;
  onSelectFolder: (f: FolderId) => void;
  onCompose: () => void;
}) {
  return (
    <aside className="w-48 shrink-0 border-r border-line p-3">
      <button
        onClick={onCompose}
        className="mb-4 w-full rounded-md bg-normal py-2 text-sm font-medium text-white hover:bg-normal/90"
      >
        편지쓰기
      </button>

      <nav className="space-y-1">
        {FOLDER_ORDER.map((f) => {
          const count = mails.filter((m) => m.folder === f && !m.read).length;
          const active = f === activeFolder;
          return (
            <button
              key={f}
              onClick={() => onSelectFolder(f)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-surface2 text-ink" : "text-muted hover:bg-surface2/60"
              }`}
            >
              <span>{FOLDER_LABELS[f]}</span>
              {count > 0 && (
                <span className="rounded-full bg-normal/20 px-1.5 py-0.5 text-[10px] font-mono text-normal">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

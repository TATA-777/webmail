"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import WebmailLayout from "@/components/Webmail/WebmailLayout";
import FolderList from "@/components/Webmail/FolderList";
import MailList from "@/components/Webmail/MailList";
import MailDetail from "@/components/Webmail/MailDetail";
import ComposeModal from "@/components/Webmail/ComposeModal";
import { FolderId, Mail } from "@/mock/mockMail";
import { fetchMails, markMailRead, sendMail, fetchAccount, fetchMailDetail, logout, deleteMail } from "@/lib/api";

const ALL_FOLDERS: FolderId[] = ["inbox", "sent", "drafts", "spam"];

export default function WebmailPage() {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<FolderId>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // FolderList의 폴더별 안 읽음 개수 배지를 위해 전체 폴더를 한 번에 불러옴.
  const loadAllMails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(ALL_FOLDERS.map((f) => fetchMails(f)));
      setMails(results.flat());
    } catch (e) {
      setError(e instanceof Error ? e.message : "메일을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllMails();
    // 계정 정보는 메일 목록과 별개로 조용히 불러옴 (실패해도 헤더에 기본 문구만 유지).
    fetchAccount()
      .then(setAccountEmail)
      .catch(() => setAccountEmail(null));
  }, [loadAllMails]);

  const folderMails = useMemo(
    () => mails.filter((m) => m.folder === activeFolder),
    [mails, activeFolder]
  );

  const selectedMail = mails.find((m) => m.id === selectedId) ?? null;

const handleSelect = async (id: string) => {
    setSelectedId(id);
    // 낙관적 업데이트: 화면은 바로 읽음 처리하고, 서버에도 반영.
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));

    // 목록 조회에는 본문이 비어있으므로, 상세 화면을 위해 본문을 따로 가져옴.
    try {
      const detail = await fetchMailDetail(id);
      setMails((prev) => prev.map((m) => (m.id === id ? { ...detail, read: true } : m)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "메일 본문을 불러오지 못했습니다.");
    }

    try {
      await markMailRead(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "읽음 처리에 실패했습니다.");
    }
  };

  const handleSelectFolder = (f: FolderId) => {
    setActiveFolder(f);
    setSelectedId(null);
  };

  const handleSend = async (draft: { to: string; subject: string; body: string }) => {
    try {
      const newMail = await sendMail(draft);
      setMails((prev) => [newMail, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "메일 발송에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
  try {
    await deleteMail(id);
    setMails((prev) => prev.filter((m) => m.id !== id));
    setSelectedId(null);
  } catch (e) {
    setError(e instanceof Error ? e.message : "메일 삭제에 실패했습니다.");
  }
};
  return (
    <WebmailLayout accountEmail={accountEmail} onLogout={handleLogout}>
      <FolderList
        mails={mails}
        activeFolder={activeFolder}
        onSelectFolder={handleSelectFolder}
        onCompose={() => setComposing(true)}
      />

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted">
          불러오는 중...
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted">
          <p>{error}</p>
          <button
            onClick={loadAllMails}
            className="rounded-md border border-line px-3 py-1.5 hover:bg-surface2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <MailList mails={folderMails} selectedId={selectedId} onSelect={handleSelect} />
          <MailDetail mail={selectedMail} onDelete={handleDelete} />
        </>
      )}

      {composing && (
        <ComposeModal onClose={() => setComposing(false)} onSend={handleSend} />
      )}
    </WebmailLayout>
  );
}

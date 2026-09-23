// ─────────────────────────────────────────────
// 웹메일 목업 데이터 스키마
// 나중에 역할1(메일서버, Postfix+Dovecot) REST API 응답과
// 필드명을 맞춰서 fetch 함수만 교체하면 되게 설계함.
// ─────────────────────────────────────────────

export type FolderId = "inbox" | "sent" | "drafts" | "spam";

export interface Attachment {
  id: string;
  filename: string;
  size: string; // 사람이 읽기 쉬운 형태 (예: "1.2MB")
}

export interface Mail {
  id: string;
  folder: FolderId;
  from: string;
  to: string;
  subject: string;
  preview: string; // 목록에 보여줄 짧은 미리보기
  bodyHtml: string; // 상세 화면 본문 (렌더링 전 반드시 sanitize)
  time: string; // ISO
  read: boolean;
  attachments: Attachment[];
}

export const FOLDER_LABELS: Record<FolderId, string> = {
  inbox: "받은편지함",
  sent: "보낸편지함",
  drafts: "임시보관함",
  spam: "스팸함",
};

// 실제 메일서버(IMAP/SMTP) 연동 전까지는 빈 상태로 둠.
export const mockMails: Mail[] = [];

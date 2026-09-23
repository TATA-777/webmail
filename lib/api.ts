// ─────────────────────────────────────────────
// webmail-api(포트 3002) 서버와 통신하는 함수들.
// 3단계(로그인 화면 도입): 모든 요청에 credentials: "include"를 붙여서
// httpOnly 세션 쿠키가 같이 전송되도록 함. 401을 받으면 로그인 페이지로 보냄.
// ─────────────────────────────────────────────

import { Mail, FolderId } from "@/mock/mockMail";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3002";

/** 세션 만료(401) 공통 처리: 로그인 화면으로 이동 */
function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
  }

  return res;
}

/** 로그인 */
export async function login(email: string, password: string): Promise<{ email: string }> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `로그인에 실패했습니다. (${res.status})`);
  }
  return res.json();
}

/** 로그아웃 */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/** 현재 로그인된 계정 조회 (화면 헤더 표시용) */
export async function fetchAccount(): Promise<string> {
  const res = await apiFetch("/api/me");
  if (!res.ok) {
    throw new Error(`계정 정보를 불러오지 못했습니다. (${res.status})`);
  }
  const data: { email: string } = await res.json();
  return data.email;
}

interface ListMailResponse {
  folder: FolderId;
  count: number;
  mails: Mail[];
}

/** 폴더별 메일 목록 조회 */
export async function fetchMails(folder: FolderId): Promise<Mail[]> {
  const res = await apiFetch(`/api/mail?folder=${folder}`);
  if (!res.ok) {
    throw new Error(`메일 목록을 불러오지 못했습니다. (${res.status})`);
  }
  const data: ListMailResponse = await res.json();
  return data.mails;
}

/** 메일 상세(본문 포함) 조회 */
export async function fetchMailDetail(id: string): Promise<Mail> {
  const res = await apiFetch(`/api/mail/${id}`);
  if (!res.ok) {
    throw new Error(`메일 본문을 불러오지 못했습니다. (${res.status})`);
  }
  return res.json();
}

/** 읽음 처리 */
export async function markMailRead(id: string): Promise<Mail> {
  const res = await apiFetch(`/api/mail/${id}/read`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error(`읽음 처리에 실패했습니다. (${res.status})`);
  }
  return res.json();
}

/** 메일 발송 */
export async function sendMail(draft: {
  to: string;
  subject: string;
  body: string;
}): Promise<Mail> {
  const res = await apiFetch(`/api/mail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  if (!res.ok) {
    throw new Error(`메일 발송에 실패했습니다. (${res.status})`);
  }
  return res.json();
}

/** 메일 삭제 */
export async function deleteMail(id: string): Promise<void> {
  const res = await apiFetch(`/api/mail/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`메일 삭제에 실패했습니다. (${res.status})`);
  }
}
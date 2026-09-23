"use client";

export default function WebmailLayout({
  children,
  accountEmail,
  onLogout,
}: {
  children: React.ReactNode;
  accountEmail?: string | null;
  onLogout?: () => void;
}) {
  return (
    <div className="flex h-screen flex-col bg-base">
      <header className="flex items-center justify-between border-b border-line px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-normal shadow-[0_0_8px_2px_rgba(76,159,232,0.6)]" />
          <h1 className="text-base font-semibold tracking-tight text-ink">
            Zero-Watch <span className="text-muted font-normal">웹메일</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-muted">
          <a
            href="http://localhost:3000"
            className="rounded border border-line px-2 py-1 hover:bg-surface2"
          >
            관제 대시보드로 ↗
          </a>
          <span>{accountEmail || "연결 확인 중..."}</span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded border border-line px-2 py-1 hover:bg-surface2"
            >
              로그아웃
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

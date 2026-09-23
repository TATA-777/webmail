"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-base">
      <form
        onSubmit={handleSubmit}
        className="w-80 rounded-lg border border-line bg-surface2 p-8"
      >
        <h1 className="mb-1 text-base font-semibold text-ink">
          Zero-Watch <span className="font-normal text-muted">웹메일</span>
        </h1>
        <p className="mb-6 text-xs text-muted">로그인 후 10분간 세션이 유지됩니다.</p>

        <input
          type="email"
          placeholder="이메일 (예: admin@zero-watch.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-md border border-line bg-base px-3 py-2 text-sm text-ink outline-none focus:border-normal"
          autoFocus
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded-md border border-line bg-base px-3 py-2 text-sm text-ink outline-none focus:border-normal"
        />

        {error && <p className="mb-3 text-xs text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-normal px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

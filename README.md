# 역할4 — 웹메일 (독립 Next.js 프로젝트)

관제 대시보드 프로젝트와 완전히 분리된 별도 앱입니다. 포트 **3001**번에서 실행됩니다.
Roundcube를 쓰지 않고 자체 제작한 웹메일 UI입니다.

## 실행 방법

```bash
npm install
npm run dev
```

http://localhost:3001 접속

## 대시보드와 같이 실행하려면

```bash
# 터미널 1 (dashboard 프로젝트 폴더에서)
cd dashboard
npm run dev   # localhost:3000

# 터미널 2
cd webmail
npm run dev   # localhost:3001
```

헤더의 "관제 대시보드로" 버튼은 `http://localhost:3000`으로 이동합니다.
실제 배포 시에는 이 주소를 실제 도메인으로 바꿔야 합니다
(`components/Webmail/WebmailLayout.tsx`에서 수정).

## 폴더 구조

```
webmail/
├── app/                     # page.tsx, layout.tsx, globals.css
├── components/Webmail/
│   ├── WebmailLayout.tsx
│   ├── FolderList.tsx
│   ├── MailList.tsx
│   ├── MailDetail.tsx       # 본문은 DOMPurify로 sanitize 후 렌더링
│   └── ComposeModal.tsx
└── mock/mockMail.ts
```

## 나중에 실연동할 때

- `GET /api/mail/list`, `PATCH /api/mail/:id`, `POST /api/mail/send`
  로 역할1 메일서버와 연동 — `app/page.tsx` 참고
- 모든 요청에 JWT Authorization 헤더 필요
- 상세 API 스펙은 팀 작업가이드 문서 참고

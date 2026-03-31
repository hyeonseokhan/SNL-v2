@AGENTS.md

# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 필요한 가이드를 제공합니다.

## 프로젝트 개요

SNL v2는 Next.js 기반의 로스트아크 캐릭터 조회 도구입니다. KLOA(kloa.gg)의 레이아웃을 참고하여 캐릭터 검색 및 상세 정보 조회를 제공합니다.

## 개발 명령어

- `npm run dev` - 개발 서버 시작 (http://localhost:3000)
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 실행

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **테마**: next-themes (다크/라이트 모드)
- **배포**: Vercel (SSR + API Routes)
- **폰트**: Pretendard (한국어)

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (lang="ko", ThemeProvider)
│   ├── page.tsx                # 메인 페이지 (히어로 검색바)
│   ├── characters/[name]/      # 캐릭터 상세 페이지 (SSR)
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── api/characters/[name]/  # 로스트아크 API 프록시
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── layout/                 # 헤더, 검색바, 테마토글
│   └── character/              # 캐릭터 상세 컴포넌트
├── lib/                        # 유틸리티 (cn 함수 등)
├── types/                      # TypeScript 타입 정의
└── config/                     # 사이트 설정
```

## 핵심 아키텍처

### API 전략
- 로스트아크 API는 CORS 제한으로 서버에서만 호출 가능
- `/api/characters/[name]` Route로 프록시
- API 토큰은 `LOA_API_TOKEN` 환경변수 (서버 전용, NEXT_PUBLIC 금지)

### 캐릭터 페이지
- Server Component에서 데이터 fetch (SSR)
- `character-tabs.tsx`는 Client Component (탭 인터랙션)

### 테마
- shadcn/ui CSS 변수 기반 (globals.css의 :root / .dark)
- next-themes로 다크/라이트 전환

## CLI 응답 언어

**중요**: 항상 한국어로 응답하고 설명해야 합니다.

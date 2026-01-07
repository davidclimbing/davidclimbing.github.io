# CLAUDE.md

이 파일은 Claude AI가 이 프로젝트를 이해하고 작업할 때 참고하는 지침서입니다.

## 프로젝트 개요

**나의 기록** - Notion 데이터베이스와 연동되는 개인 일기/메모 웹 애플리케이션

## 기술 스택

- **프론트엔드**: React 19 + TypeScript
- **스타일링**: Tailwind CSS 4
- **빌드 도구**: Vite 7
- **호스팅**: GitHub Pages
- **백엔드 프록시**: Cloudflare Workers
- **코드 품질**: ESLint 9 + TypeScript ESLint

## 프로젝트 구조

```
src/
├── api/
│   └── notion.ts           # Notion API 호출 함수 (fetchEntries, fetchEntry)
├── components/
│   ├── EntryList.tsx       # 기록 목록 컴포넌트
│   └── EntryDetail.tsx     # 기록 상세 보기 컴포넌트
├── types/
│   └── entry.ts            # Entry, EntryDetail, Block 타입 정의
├── App.tsx                 # 메인 앱 컴포넌트 (레이아웃 + 상태 관리)
├── main.tsx                # React 엔트리 포인트
└── index.css               # Tailwind CSS 임포트
```

## 주요 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (HMR 지원)
pnpm dev

# 프로덕션 빌드 (TypeScript 컴파일 + Vite 빌드)
pnpm build

# 빌드 결과물 미리보기
pnpm preview

# ESLint 코드 검사
pnpm lint
```

## 환경변수

- `VITE_API_URL`: Cloudflare Worker API URL (필수)
  - 로컬: `.env` 파일에 설정
  - 배포: GitHub Secrets에 설정

## 아키텍처

```
[Notion Database] → [Cloudflare Worker] → [React Frontend] → [GitHub Pages]
```

- Cloudflare Worker가 Notion API 키를 보호하고 CORS 문제를 해결
- API 엔드포인트:
  - `GET /api/entries` - 기록 목록
  - `GET /api/entries/:id` - 기록 상세

## 핵심 타입

```typescript
interface Entry {
  id: string;
  title: string;
  date: string | null;
  emoji: string;
  tags: string[];
  preview?: string;
}

interface EntryDetail extends Entry {
  blocks: Block[];
}

// Block 타입: paragraph, h1~h3, bullet, number, quote, code, image, divider
```

## 코드 컨벤션

- 함수형 컴포넌트 + TypeScript 인터페이스
- Tailwind CSS 유틸리티 클래스 사용
- 파일명: 컴포넌트는 PascalCase, 유틸리티는 camelCase
- 한국어 UI (날짜 포맷: `Intl.DateTimeFormat('ko-KR')`)

## 반응형 디자인

- 모바일: 사이드바 토글 방식 (768px 미만)
- 데스크톱: 사이드바 + 메인 콘텐츠 분할 레이아웃
- 브레이크포인트: `md:` (768px)

## 배포

- `main` 브랜치 푸시 시 GitHub Actions 자동 배포
- 워크플로우: `.github/workflows/deploy.yml`

## 주의사항

- `.env` 파일은 Git에 커밋하지 않음 (.gitignore에 포함)
- Notion API 키는 절대 프론트엔드 코드에 노출하지 않음
- 빌드 결과물(`dist/`)은 Git에 커밋하지 않음


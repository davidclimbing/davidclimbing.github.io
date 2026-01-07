# 나의 기록 - Notion 연동 일기 앱

노션에 작성한 일기와 메모를 자동으로 보여주는 개인 기록 앱입니다.

## 구조

```
├── src/                      # React 앱 (GitHub Pages에 배포)
├── cloudflare-worker/        # Notion API 프록시 (Cloudflare Workers에 배포)
└── .github/workflows/        # GitHub Actions 자동 배포
```

## 설정 방법

### 1. 노션 Integration 생성

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. **Internal Integration** 선택
3. 생성 후 **Internal Integration Secret** 복사 (이것이 API 키)

### 2. 노션 데이터베이스 설정

1. 노션에서 새 데이터베이스 생성
2. 다음 속성들을 추가:
   - `Title` (제목) - 기본 타이틀 속성
   - `Date` (날짜) - Date 타입
   - `Tags` (태그) - Multi-select 타입
   - `Preview` (미리보기) - Text 타입 (선택사항)
3. 데이터베이스 페이지에서 `...` > `Connections` > 생성한 Integration 연결
4. 데이터베이스 URL에서 ID 복사:
   ```
   https://notion.so/myworkspace/데이터베이스ID?v=...
   ```

### 3. Cloudflare Worker 배포

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에서 Workers & Pages 선택
2. **Create Worker** 클릭
3. `cloudflare-worker/worker.js` 코드 붙여넣기
4. **Settings > Variables**에서 환경변수 설정:
   - `NOTION_API_KEY`: 노션 Integration Secret
   - `NOTION_DATABASE_ID`: 노션 데이터베이스 ID
   - `ALLOWED_ORIGIN`: `https://davidclimbing.github.io`
5. 배포 후 Worker URL 복사 (예: `https://notion-diary-proxy.yourname.workers.dev`)

### 4. 프론트엔드 설정

1. `.env` 파일 생성 (또는 `.env.local`):
   ```
   VITE_API_URL=https://notion-diary-proxy.yourname.workers.dev
   ```

2. GitHub Repository Settings > Secrets > Actions에 추가:
   - `VITE_API_URL`: Cloudflare Worker URL

### 5. GitHub Pages 활성화

1. Repository Settings > Pages
2. Source: **GitHub Actions** 선택
3. `main` 브랜치에 푸시하면 자동 배포

## 로컬 개발

```bash
npm install
npm run dev
```

## 사용법

1. 노션 데이터베이스에 새 페이지 생성
2. 제목, 날짜, 태그 입력
3. 내용 작성 (텍스트, 제목, 리스트, 인용, 코드, 이미지 지원)
4. GitHub Pages에서 자동으로 업데이트됨

## 지원하는 노션 블록

- 텍스트 (paragraph)
- 제목 (heading 1, 2, 3)
- 글머리 기호 목록 (bulleted list)
- 번호 매기기 목록 (numbered list)
- 인용 (quote)
- 코드 (code)
- 이미지 (image)
- 구분선 (divider)

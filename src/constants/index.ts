// API 설정
export const API_BASE = import.meta.env.DEV 
  ? '' 
  : (import.meta.env.VITE_API_URL || 'https://notion-diary-proxy.YOUR_SUBDOMAIN.workers.dev');

// 앱 정보
export const APP_NAME = 'David의 기록';

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 20;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  THEME: 'theme',
} as const;


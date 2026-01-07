import type { Entry, EntryDetail } from '../types/entry';

// Cloudflare Worker URL - 배포 후 실제 URL로 변경하세요
const API_BASE = import.meta.env.VITE_API_URL || 'https://notion-diary-proxy.YOUR_SUBDOMAIN.workers.dev';

export async function fetchEntries(): Promise<Entry[]> {
  const response = await fetch(`${API_BASE}/api/entries`);
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  const data = await response.json();
  return data.entries;
}

export async function fetchEntry(id: string): Promise<EntryDetail> {
  const response = await fetch(`${API_BASE}/api/entries/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch entry');
  }
  const data = await response.json();
  return data.entry;
}

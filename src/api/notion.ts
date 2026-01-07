import type { Entry, EntryDetail } from '../types/entry';
import { API_BASE } from '../constants';

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

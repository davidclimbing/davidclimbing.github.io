import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { EntryList } from '../components/EntryList';
import { EntryDetail } from '../components/EntryDetail';
import { fetchEntries, fetchEntry } from '../api/notion';
import { useTheme } from '../hooks/useTheme';
import type { Entry, EntryDetail as EntryDetailType } from '../types/entry';

export function EntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const { isDark, toggleTheme } = useTheme();
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EntryDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (entryId) {
      loadEntry(entryId);
    } else {
      setSelectedEntry(null);
    }
  }, [entryId]);

  async function loadEntries() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEntries();
      setEntries(data);
    } catch (err) {
      setError('기록을 불러오는데 실패했어요. Cloudflare Worker URL을 확인해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEntry(id: string) {
    setDetailLoading(true);
    try {
      const entry = await fetchEntry(id);
      setSelectedEntry(entry);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
    // 모바일에서 사이드바 닫기
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }

  return (
    <div className="vp-layout flex flex-col h-screen">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleDark={toggleTheme}
        isDark={isDark}
      />

      <div className="vp-main-layout flex flex-1 overflow-hidden">
        <aside className={`vp-sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-30 h-full transition-transform duration-200 flex flex-col border-r`}>
          <div className="vp-sidebar-header px-4 lg:px-6 py-4 border-b">
            <h2 className="text-xs lg:text-sm font-semibold uppercase tracking-wider">
              기록 목록
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-2 lg:px-3 py-2">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="vp-spinner animate-spin w-6 h-6 border-2 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-sm mb-2">{error}</p>
                <button onClick={loadEntries} className="vp-btn-link text-sm font-medium">
                  다시 시도
                </button>
              </div>
            ) : (
              <EntryList
                entries={entries}
                selectedId={entryId || null}
              />
            )}
          </div>

          <div className="vp-sidebar-footer px-4 lg:px-6 py-4 border-t">
            <button
              onClick={loadEntries}
              disabled={loading}
              className="vp-btn-primary w-full py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 border"
            >
              {loading ? '불러오는 중...' : '새로고침'}
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <EntryDetail entry={selectedEntry} loading={detailLoading} />
        </main>
      </div>
    </div>
  );
}


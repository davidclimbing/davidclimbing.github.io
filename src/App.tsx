import { useState, useEffect } from 'react';
import { EntryList } from './components/EntryList';
import { EntryDetail } from './components/EntryDetail';
import { fetchEntries, fetchEntry } from './api/notion';
import type { Entry, EntryDetail as EntryDetailType } from './types/entry';

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EntryDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

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

  async function handleSelectEntry(id: string) {
    setSelectedId(id);
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
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }

  return (
    <div className="h-screen flex bg-white">
      {/* 사이드바 */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 w-80 h-full bg-gray-50 border-r border-gray-200 transition-transform duration-200 flex flex-col`}
      >
        {/* 헤더 */}
        <header className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>📔</span> 나의 기록
          </h1>
        </header>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={loadEntries}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <EntryList
              entries={entries}
              selectedId={selectedId}
              onSelect={handleSelectEntry}
            />
          )}
        </div>

        {/* 새로고침 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={loadEntries}
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? '불러오는 중...' : '새로고침'}
          </button>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto">
        {/* 모바일 헤더 */}
        <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-semibold">나의 기록</h1>
        </div>

        <EntryDetail entry={selectedEntry} loading={detailLoading} />
      </main>
    </div>
  );
}

export default App;

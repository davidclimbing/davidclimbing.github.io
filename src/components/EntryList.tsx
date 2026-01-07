import type { Entry } from '../types/entry';

interface EntryListProps {
  entries: Entry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EntryList({ entries, selectedId, onSelect }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>아직 기록이 없어요</p>
        <p className="text-sm mt-2">노션에서 새 기록을 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onSelect(entry.id)}
          className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
            selectedId === entry.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{entry.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{entry.title}</h3>
              {entry.date && (
                <time className="text-sm text-gray-500">
                  {formatDate(entry.date)}
                </time>
              )}
              {entry.preview && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{entry.preview}</p>
              )}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

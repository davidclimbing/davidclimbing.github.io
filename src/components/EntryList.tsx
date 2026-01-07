import type { Entry } from '../types/entry';

interface EntryListProps {
  entries: Entry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EntryList({ entries, selectedId, onSelect }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="vp-empty p-8 text-center">
        <p>아직 기록이 없어요</p>
        <p className="text-sm mt-2">노션에서 새 기록을 추가해보세요</p>
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      {entries.map((entry) => {
        const isActive = selectedId === entry.id;
        return (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            className={`vp-entry-item ${isActive ? 'vp-entry-item-active' : ''} w-full block px-3 py-2 text-left rounded-md`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="vp-entry-title font-medium truncate text-sm leading-tight">
                  {entry.title}
                </h3>
                {entry.date && (
                  <time className="vp-entry-date text-xs mt-1 block">
                    {formatDate(entry.date)}
                  </time>
                )}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="vp-entry-tag px-1.5 py-0.5 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
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

import type { EntryDetail as EntryDetailType, Block } from '../types/entry';

interface EntryDetailProps {
  entry: EntryDetailType | null;
  loading: boolean;
}

export function EntryDetail({ entry, loading }: EntryDetailProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>기록을 선택해주세요</p>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto p-8">
      <header className="mb-8">
        <span className="text-5xl mb-4 block">{entry.emoji}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{entry.title}</h1>
        {entry.date && (
          <time className="text-gray-500">{formatDate(entry.date)}</time>
        )}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-gray max-w-none">
        {entry.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </article>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return block.text ? <p className="mb-4">{block.text}</p> : <br />;
    case 'h1':
      return <h1 className="text-2xl font-bold mt-8 mb-4">{block.text}</h1>;
    case 'h2':
      return <h2 className="text-xl font-bold mt-6 mb-3">{block.text}</h2>;
    case 'h3':
      return <h3 className="text-lg font-semibold mt-4 mb-2">{block.text}</h3>;
    case 'bullet':
      return (
        <li className="ml-4 list-disc mb-1">{block.text}</li>
      );
    case 'number':
      return (
        <li className="ml-4 list-decimal mb-1">{block.text}</li>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
          {block.text}
        </blockquote>
      );
    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code>{block.text}</code>
        </pre>
      );
    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.url}
            alt={block.caption || ''}
            className="w-full rounded-lg"
          />
          {block.caption && (
            <figcaption className="text-sm text-gray-500 text-center mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'divider':
      return <hr className="my-8 border-gray-200" />;
    default:
      return null;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

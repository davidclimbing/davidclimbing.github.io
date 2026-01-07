import type { EntryDetail as EntryDetailType, Block } from '../types/entry';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface EntryDetailProps {
  entry: EntryDetailType | null;
  loading: boolean;
}

export function EntryDetail({ entry, loading }: EntryDetailProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="vp-spinner animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="vp-empty-icon flex flex-col items-center justify-center h-full">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>기록을 선택해주세요</p>
      </div>
    );
  }

  return (
    <article className="vp-doc w-full">
      <div className="vp-article-container mx-auto px-8 py-12">
        <header className="mb-10">
          <span className="text-5xl mb-6 block">{entry.emoji}</span>
          <h1 className="vp-article-title font-bold mb-4">
            {entry.title}
          </h1>
          {entry.date && (
            <time className="vp-article-date text-sm block mb-4">
              {formatDate(entry.date)}
            </time>
          )}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="vp-article-tag px-3 py-1 text-xs rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="vp-content">
          {entry.blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      // 빈 텍스트는 줄바꿈으로 처리
      if (!block.text) return <br />;
      // Markdown 인라인 문법 지원 (볼드, 이탤릭, 링크 등)
      return (
        <div className="vp-block-paragraph mb-4">
          <MarkdownRenderer content={block.text} />
        </div>
      );
    
    case 'h1':
      return <h1 className="vp-block-text text-3xl font-bold mt-8 mb-4">{block.text}</h1>;
    
    case 'h2':
      return <h2 className="vp-block-text text-2xl font-bold mt-6 mb-3">{block.text}</h2>;
    
    case 'h3':
      return <h3 className="vp-block-text text-xl font-semibold mt-5 mb-2">{block.text}</h3>;
    
    case 'bullet':
      return (
        <li className="vp-block-text ml-6 list-disc mb-2">
          <MarkdownRenderer content={block.text} />
        </li>
      );
    
    case 'number':
      return (
        <li className="vp-block-text ml-6 list-decimal mb-2">
          <MarkdownRenderer content={block.text} />
        </li>
      );
    
    case 'quote':
      return (
        <blockquote className="vp-block-quote border-l-4 border-[var(--vp-c-brand)] pl-4 my-4 italic opacity-90">
          <MarkdownRenderer content={block.text} />
        </blockquote>
      );
    
    case 'code':
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={block.language || 'text'}
          PreTag="div"
          className="vp-code-block rounded-lg my-4 !bg-[#282c34]"
          showLineNumbers={block.text.split('\n').length > 3}
          customStyle={{
            margin: '1rem 0',
            padding: '1rem',
            fontSize: '0.875rem',
            borderRadius: '0.5rem',
          }}
        >
          {block.text}
        </SyntaxHighlighter>
      );
    
    case 'image':
      return (
        <figure className="my-8">
          <img
            src={block.url}
            alt={block.caption || ''}
            className="vp-block-image w-full rounded-lg"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="vp-block-caption text-sm text-center mt-3 opacity-70">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    
    case 'divider':
      return <hr className="vp-block-divider my-8 border-t border-[var(--vp-c-divider)]" />;
    
    case 'unsupported':
      // 지원하지 않는 블록 타입은 조용히 무시
      return null;
    
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

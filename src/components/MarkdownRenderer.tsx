import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const components: Components = {
    // 코드 블록 렌더링 (Prism.js 사용)
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
      // 인라인 코드가 아닌 경우 (코드 블록)
      if (match) {
        return (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="vp-code-block rounded-lg my-4 !bg-[#282c34]"
            showLineNumbers={codeString.split('\n').length > 3}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        );
      }

      // 인라인 코드
      return (
        <code
          className="vp-inline-code px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    // 링크 렌더링
    a({ href, children }) {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="vp-link text-[var(--vp-c-brand)] hover:underline"
        >
          {children}
        </a>
      );
    },

    // 헤딩 렌더링
    h1({ children }) {
      return <h1 className="vp-block-text text-3xl font-bold mt-8 mb-4">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="vp-block-text text-2xl font-bold mt-6 mb-3">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="vp-block-text text-xl font-semibold mt-5 mb-2">{children}</h3>;
    },
    h4({ children }) {
      return <h4 className="vp-block-text text-lg font-semibold mt-4 mb-2">{children}</h4>;
    },

    // 문단 렌더링
    p({ children }) {
      return <p className="vp-block-text mb-4 leading-relaxed">{children}</p>;
    },

    // 리스트 렌더링
    ul({ children }) {
      return <ul className="vp-list list-disc pl-6 mb-4 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="vp-list list-decimal pl-6 mb-4 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="vp-block-text">{children}</li>;
    },

    // 인용문 렌더링
    blockquote({ children }) {
      return (
        <blockquote className="vp-block-quote border-l-4 border-[var(--vp-c-brand)] pl-4 my-4 italic opacity-90">
          {children}
        </blockquote>
      );
    },

    // 수평선 렌더링
    hr() {
      return <hr className="vp-block-divider my-8 border-t border-[var(--vp-c-divider)]" />;
    },

    // 이미지 렌더링
    img({ src, alt }) {
      return (
        <figure className="my-6">
          <img
            src={src}
            alt={alt || ''}
            className="vp-block-image w-full rounded-lg"
            loading="lazy"
          />
          {alt && (
            <figcaption className="vp-block-caption text-sm text-center mt-2 opacity-70">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },

    // 테이블 렌더링
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="vp-table w-full border-collapse">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="vp-table-head bg-[var(--vp-c-bg-soft)]">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="vp-table-cell border border-[var(--vp-c-divider)] px-4 py-2 text-left font-semibold">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="vp-table-cell border border-[var(--vp-c-divider)] px-4 py-2">
          {children}
        </td>
      );
    },

    // 강조 텍스트
    strong({ children }) {
      return <strong className="font-bold">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic">{children}</em>;
    },
    del({ children }) {
      return <del className="line-through opacity-60">{children}</del>;
    },
  };

  return (
    <div className={`vp-markdown-content ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}


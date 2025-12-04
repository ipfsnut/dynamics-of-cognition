import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

/**
 * MarkdownViewer - Styled markdown renderer
 * Extracts common rendering logic for consistent styling across all docs
 */
export function MarkdownViewer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-display text-3xl sm:text-4xl text-glow font-light leading-tight mb-6 mt-12 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-display text-2xl sm:text-3xl text-text font-light leading-tight mb-4 mt-10">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-display text-xl sm:text-2xl text-text/90 mb-3 mt-8">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-display text-lg text-text/80 mb-2 mt-6">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-text/80 leading-relaxed mb-4">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="text-text font-medium">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="text-text/90">
            {children}
          </em>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-glow/30 pl-4 my-4 text-text/70 italic">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-text/80">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-text/80">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">
            {children}
          </li>
        ),
        hr: () => (
          <hr className="my-10 border-border" />
        ),
        a: ({ href, children }) => (
          <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-glow/80 hover:text-glow underline underline-offset-2"
          >
            {children}
          </a>
        ),
        code: ({ inline, children }) => {
          if (inline) {
            return (
              <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded text-glow/90">
                {children}
              </code>
            );
          }
          return (
            <code className="block font-mono text-sm bg-surface p-4 rounded-lg overflow-x-auto my-4">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-surface rounded-lg overflow-x-auto my-4">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-border">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border/50">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-surface/30 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-medium text-text/90 bg-surface/50">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-text/70">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

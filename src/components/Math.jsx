import katex from 'katex';
import { useMemo } from 'react';

/**
 * Math - Inline math expression
 */
export function Math({ children }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return `<span class="text-red-400">${children}</span>`;
    }
  }, [children]);

  return (
    <span 
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

/**
 * MathBlock - Display math (centered, larger)
 */
export function MathBlock({ children }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return `<span class="text-red-400">${children}</span>`;
    }
  }, [children]);

  return (
    <div 
      className="katex-display my-6"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

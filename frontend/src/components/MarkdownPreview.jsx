import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import 'github-markdown-css/github-markdown-dark.css'; // GitHub dark theme

// Component to render markdown content with GitHub-like style
const MarkdownPreview = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCodeToClipboard = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      const codeIndex = `${match?.[1] || 'text'}-${codeString.slice(0, 20)}`;
      
      return !inline && match ? (
        <div className="relative group">
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-700">
            <span className="text-slate-400 text-sm font-medium">
              {match[1]}
            </span>
            <button
              onClick={() => copyCodeToClipboard(codeString, codeIndex)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-slate-700 rounded-md flex items-center gap-1 text-slate-400 hover:text-white text-xs"
            >
              {copiedCode === codeIndex ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="!mt-0 !rounded-t-none"
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-slate-800/80 text-blue-200 rounded px-2 py-1 text-sm font-mono border border-slate-700/50" {...props}>
          {children}
        </code>
      );
    },
    
    // Enhanced blockquote styling
    blockquote({ children, ...props }) {
      return (
        <blockquote 
          className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-500/5 rounded-r-lg italic text-slate-300"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    
    // Enhanced table styling
    table({ children, ...props }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse border border-slate-700 rounded-lg overflow-hidden" {...props}>
            {children}
          </table>
        </div>
      );
    },
    
    th({ children, ...props }) {
      return (
        <th className="border border-slate-700 bg-slate-800 px-4 py-3 text-left font-semibold text-slate-200" {...props}>
          {children}
        </th>
      );
    },
    
    td({ children, ...props }) {
      return (
        <td className="border border-slate-700 px-4 py-3 text-slate-300" {...props}>
          {children}
        </td>
      );
    },
    
    // Enhanced link styling
    a({ children, href, ...props }) {
      return (
        <a 
          href={href} 
          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 underline-offset-2 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Enhanced heading styling
    h1({ children, ...props }) {
      return (
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 pb-3 border-b border-slate-700" {...props}>
          {children}
        </h1>
      );
    },
    
    h2({ children, ...props }) {
      return (
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8 pb-2 border-b border-slate-700" {...props}>
          {children}
        </h2>
      );
    },
    
    h3({ children, ...props }) {
      return (
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 mt-6" {...props}>
          {children}
        </h3>
      );
    },
    
    h4({ children, ...props }) {
      return (
        <h4 className="text-lg sm:text-xl font-bold text-white mb-3 mt-4" {...props}>
          {children}
        </h4>
      );
    },
    
    // Enhanced list styling
    ul({ children, ...props }) {
      return (
        <ul className="list-disc list-inside space-y-2 text-slate-300 my-4 pl-4" {...props}>
          {children}
        </ul>
      );
    },
    
    ol({ children, ...props }) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-slate-300 my-4 pl-4" {...props}>
          {children}
        </ol>
      );
    },
    
    li({ children, ...props }) {
      return (
        <li className="leading-relaxed" {...props}>
          {children}
        </li>
      );
    },
    
    // Enhanced paragraph styling
    p({ children, ...props }) {
      return (
        <p className="text-slate-300 leading-relaxed mb-4" {...props}>
          {children}
        </p>
      );
    },
    
    // Enhanced image styling
    img({ src, alt, ...props }) {
      return (
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full h-auto rounded-lg border border-slate-700 shadow-lg my-4 mx-auto block"
          {...props}
        />
      );
    },
    
    // Enhanced horizontal rule
    hr({ ...props }) {
      return (
        <hr className="border-slate-700 my-8" {...props} />
      );
    }
  };

  return (
    <div className="markdown-body bg-[#0d1117] text-[#c9d1d9] max-w-none overflow-y-auto h-full">
      <div className="prose prose-invert prose-slate max-w-none">
        <ReactMarkdown
          components={components}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPreview;
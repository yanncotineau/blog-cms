"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export default function CodeBlock({
  children,
  language = "typescript",
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden brutal-hover bg-[#1a1d24]">
      <div className="flex items-center justify-between border-b border-white/15 bg-[#1a1d24] px-4 py-2">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-xs text-slate-400 font-mono">{filename}</span>
          )}
          <span className="bg-white/10 px-2 py-0.5 text-xs text-slate-400">
            {language}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 border border-slate-400 transition-all duration-75 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#fff] hover:text-slate-200 active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber)
                ? "rgba(99, 102, 241, 0.15)"
                : undefined,
              display: "block",
              width: "100%",
            },
          })}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            borderRadius: 0,
            border: "none",
          }}
          codeTagProps={{
            style: {
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

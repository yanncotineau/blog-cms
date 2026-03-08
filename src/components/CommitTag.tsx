import { GitCommit } from "lucide-react";
import { shortHash } from "@/lib/format";

interface CommitTagProps {
  hash: string;
  url: string;
  insertions?: number;
  deletions?: number;
  /** Compact variant for grid cards */
  compact?: boolean;
}

export default function CommitTag({
  hash,
  url,
  insertions,
  deletions,
  compact = false,
}: CommitTagProps) {
  const iconSize = compact ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 font-mono
        bg-slate-900 text-slate-300
        brutal-hover-sm cursor-pointer
        ${compact ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs"}`}
    >
      <GitCommit className={`${iconSize} text-slate-400`} />
      <span>#{shortHash(hash)}</span>
      {insertions != null && insertions > 0 && (
        <span className="text-emerald-400">+{insertions}</span>
      )}
      {deletions != null && deletions > 0 && (
        <span className="text-red-400">-{deletions}</span>
      )}
    </a>
  );
}

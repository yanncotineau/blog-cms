import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

export default function Pagination({ basePath, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? `${basePath}/${page - 1}` : null;
  const next = page < totalPages ? `${basePath}/${page + 1}` : null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      {prev ? (
        <Link
          href={prev}
          className="flex items-center gap-1 brutal-hover-sm px-3 py-2 text-sm font-medium text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 border-2 border-white/20 px-3 py-2 text-sm font-medium text-slate-600 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </span>
      )}

      <div className="flex items-center gap-1">
        {getPageNumbers().map((n, i) => (
          typeof n === "number" ? (
            <Link
              key={i}
              href={`${basePath}/${n}`}
              className={`min-w-[2.5rem] px-3 py-2 text-center text-sm font-medium transition-colors ${
                n === page
                  ? "bg-emerald-600 text-white border-2 border-emerald-400"
                  : "text-slate-300 border-2 border-transparent hover:bg-white/5"
              }`}
            >
              {n}
            </Link>
          ) : (
            <span key={i} className="px-2 text-slate-600">
              {n}
            </span>
          )
        ))}
      </div>

      {next ? (
        <Link
          href={next}
          className="flex items-center gap-1 brutal-hover-sm px-3 py-2 text-sm font-medium text-slate-300"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 border-2 border-white/20 px-3 py-2 text-sm font-medium text-slate-600 cursor-not-allowed">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

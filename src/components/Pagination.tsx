import Link from "next/link";

export type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

export default function Pagination({ basePath, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? `${basePath}/${page - 1}` : null;
  const next = page < totalPages ? `${basePath}/${page + 1}` : null;

  // simple pager + page numbers (1..totalPages)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-6 flex items-center justify-between">
      <div>
        {prev ? (
          <Link className="rounded-md border border-white/10 px-3 py-1.5 hover:bg-white/10" href={prev}>
            ← Prev
          </Link>
        ) : <span className="opacity-50">← Prev</span>}
      </div>
      <ul className="flex items-center gap-2 text-sm">
        {pages.map(n => (
          <li key={n}>
            <Link
              href={`${basePath}/${n}`}
              className={`rounded-md px-2.5 py-1 ${
                n === page ? "bg-white/15 border border-white/20" : "hover:bg-white/10 border border-transparent"
              }`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        {next ? (
          <Link className="rounded-md border border-white/10 px-3 py-1.5 hover:bg-white/10" href={next}>
            Next →
          </Link>
        ) : <span className="opacity-50">Next →</span>}
      </div>
    </nav>
  );
}

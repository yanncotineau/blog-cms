import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export async function generateStaticParams() {
  // build a list of { tag, page } for every tag page
  const tagCounts = new Map<string, number>();
  for (const p of allPosts) {
    for (const t of p.tags ?? []) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  const params: { tag: string; page: string }[] = [];
  for (const [tag, count] of tagCounts) {
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
    for (let i = 1; i <= totalPages; i++) {
      params.push({ tag, page: String(i) });
    }
  }
  return params;
}

export default async function TagPage({
  params,
}: { params: Promise<{ tag: string; page: string }> }) {
  const { tag, page } = await params;
  const pageNum = Math.max(1, Number(page) || 1);

  const tagged = allPosts.filter((p) => p.tags?.includes(tag));
  if (tagged.length === 0) return notFound();

  const sorted = tagged.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  if (pageNum > totalPages) return notFound();

  const start = (pageNum - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h2 className="mb-2 text-2xl font-semibold">Posts tagged “{tag}”</h2>
        <ul className="divide-y divide-white/10">
          {items.map((p) => (
            <li key={p.slug} className="group">
              <Link href={`/blog/post/${p.slug}`} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium group-hover:underline">{p.title}</div>
                  <div className="text-xs text-[var(--muted)]">{p.date}</div>
                </div>
                <span className="text-xs text-[var(--muted)] group-hover:text-[var(--fg)]">Read →</span>
              </Link>
            </li>
          ))}
        </ul>
        <Pagination
          basePath={`/blog/tag/${encodeURIComponent(tag)}/page`}
          page={pageNum}
          totalPages={totalPages}
        />
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export async function generateStaticParams() {
  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export default async function BlogIndex({
  params,
}: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page) || 1);

  const sorted = [...allPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  if (pageNum > totalPages) return notFound();

  const start = (pageNum - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h2 className="mb-2 text-2xl font-semibold">Latest posts</h2>
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
        <Pagination basePath="/blog/page" page={pageNum} totalPages={totalPages} />
      </section>
    </main>
  );
}

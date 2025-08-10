import { allPosts } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // Return all unique tags
  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags || [])));
  return tags.map(tag => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  const posts = allPosts
    .filter(p => p.tags?.includes(tag))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (posts.length === 0) {
    return notFound();
  }

  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h2 className="mb-2 text-2xl font-semibold">Posts tagged with “{tag}”</h2>
        <ul className="divide-y divide-white/10">
          {posts.map((p) => (
            <li key={p.slug} className="group">
              <Link href={`/posts/${p.slug}`} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium group-hover:underline">{p.title}</div>
                  <div className="text-xs text-[var(--muted)]">{p.date}</div>
                </div>
                <span className="text-xs text-[var(--muted)] group-hover:text-[var(--fg)]">Read →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
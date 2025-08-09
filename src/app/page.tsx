import Link from "next/link";
import { allPosts } from "contentlayer/generated";

export default function Home() {
  const posts = [...allPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h2 className="mb-2 text-2xl font-semibold">Latest posts</h2>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Lightweight MDX blog with imports, custom components, and an API.
        </p>

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

      <section className="card p-6 text-sm text-[var(--muted)]">
        API: <code>/api/posts</code> &nbsp;•&nbsp; <code>/api/posts/&lt;slug&gt;</code>
      </section>
    </main>
  );
}

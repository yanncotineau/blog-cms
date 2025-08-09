import Link from "next/link";
import { allPosts } from "contentlayer/generated";

export default function Home() {
  const posts = [...allPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <main style={{ padding: 24 }}>
      <h1>Blog</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link> — {p.date}
          </li>
        ))}
      </ul>
    </main>
  );
}

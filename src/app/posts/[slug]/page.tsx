import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";
import Link from "next/link";

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <article className="card p-6">
      <h1 className="mb-1 text-3xl font-extrabold">{post.title}</h1>
      <div className="mb-6 text-xs text-[var(--muted)]">{post.date}</div>
      {post.tags && (
        <ul className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tag/${encodeURIComponent(tag)}`}
                className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/30"
              >
                #{tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="prose prose-invert max-w-none">
        <MDXRenderer code={post.body.code} />
      </div>
    </article>
  );
}

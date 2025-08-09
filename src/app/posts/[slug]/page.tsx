import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";

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
      <div className="prose prose-invert max-w-none">
        <MDXRenderer code={post.body.code} />
      </div>
    </article>
  );
}

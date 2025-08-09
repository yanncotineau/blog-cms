import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <article style={{ padding: 24 }}>
      <h1>{post.title}</h1>
      <MDXRenderer code={post.body.code} />
    </article>
  );
}
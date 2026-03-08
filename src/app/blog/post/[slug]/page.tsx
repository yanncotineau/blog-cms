import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import PostArticle from "@/components/PostArticle";

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
    <PostArticle
      post={post}
      backHref="/blog/page/1"
      tagBasePath="/blog/tag"
    />
  );
}

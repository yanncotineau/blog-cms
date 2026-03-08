import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import PostArticle from "@/components/PostArticle";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  return {
    title: post ? `${post.title} - Yann COTINEAU - Blog` : "Yann COTINEAU - Blog",
  };
}

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
      backHref="/"
      tagBasePath="/tag"
      showAuthor
    />
  );
}

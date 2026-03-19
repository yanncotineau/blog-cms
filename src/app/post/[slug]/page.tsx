import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import PostArticle from "@/components/PostArticle";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/seo";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return { title: SITE_NAME };

  const title = post.title;
  const description =
    post.description ?? `${post.title} — by ${AUTHOR.name}`;
  const url = `${SITE_URL}/post/${post.slug}`;
  const image = post.resolvedImage ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      ...(image && { images: [{ url: image }] }),
      publishedTime: post.date ?? undefined,
      modifiedTime: post.lastCommitDate ?? undefined,
      authors: [AUTHOR.name],
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      creator: AUTHOR.twitter,
      ...(image && { images: [image] }),
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description && { description: post.description }),
    ...(post.resolvedImage && { image: `${SITE_URL}${post.resolvedImage}` }),
    url: `${SITE_URL}/post/${post.slug}`,
    datePublished: post.date ?? undefined,
    dateModified: post.lastCommitDate ?? post.date ?? undefined,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    ...(post.tags &&
      post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/post/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostArticle
        post={post}
        backHref="/"
        tagBasePath="/tag"
        showAuthor
      />
    </>
  );
}

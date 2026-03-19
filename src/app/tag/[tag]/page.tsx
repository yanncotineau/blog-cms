import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { ArrowLeft } from "lucide-react";
import BlogList from "@/components/BlogList";
import { getSortedPosts } from "@/lib/posts";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params,
}: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const title = `Posts tagged "${decodedTag}"`;
  const description = `Browse all blog posts tagged with "${decodedTag}" on ${SITE_NAME}.`;
  const url = `${SITE_URL}/tag/${tag}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const tags = new Set<string>();
  for (const p of allPosts) {
    for (const t of p.tags ?? []) {
      tags.add(t);
    }
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export default async function TagPage({
  params,
}: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const sorted = getSortedPosts({ tag: decodedTag });
  if (sorted.length === 0) return notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all posts
      </Link>

      <div className="py-4">
        <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
          Posts tagged <span className="text-emerald-400">#{decodedTag}</span>
        </h1>
        <p className="text-slate-400 mt-1">
          {sorted.length} {sorted.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <BlogList posts={sorted} />
    </div>
  );
}

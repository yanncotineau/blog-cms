import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { ArrowLeft } from "lucide-react";
import BlogList from "@/components/BlogList";
import type { Metadata } from "next";

const isDev = process.env.NODE_ENV === "development";

export async function generateMetadata({
  params,
}: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged ${decodedTag} - Yann COTINEAU - Blog`,
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

  const posts = isDev ? allPosts : allPosts.filter((p) => !p.draft);
  const tagged = posts.filter((p) => p.tags?.includes(decodedTag));
  if (tagged.length === 0) return notFound();

  const sorted = tagged.sort((a, b) => +(new Date(b.date ?? 0)) - +(new Date(a.date ?? 0)));

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

      <BlogList posts={sorted} showDrafts={isDev} />
    </div>
  );
}

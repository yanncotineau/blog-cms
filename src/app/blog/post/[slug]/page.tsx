import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, GitCommit, Tag } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import RelativeTime from "@/components/RelativeTime";

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

function formatDate(input?: string) {
  if (!input) return null;
  try {
    return new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return input;
  }
}

function shortHash(hash?: string) {
  return hash ? hash.slice(0, 7) : "";
}

export default async function PostPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const published = formatDate(post.date as string);
  const lastCommitDate = post.lastCommitDate as string | undefined;
  const lastCommitHash = post.lastCommitHash as string | undefined;
  const lastCommitUrl = post.lastCommitDiffUrl as string | undefined;

  return (
    <div className="flex gap-8">
      {/* Left sidebar - Table of Contents */}
      <TableOfContents className="w-64 flex-shrink-0" />
      
      {/* Main article */}
      <article className="flex-1 min-w-0">
        {/* Back link */}
        <Link
          href="/blog/page/1"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        {/* Article header */}
        <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          {published && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {published}
            </span>
          )}
          
          {lastCommitDate && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated <RelativeTime date={lastCommitDate} />
              {lastCommitUrl && (
                <a
                  href={lastCommitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline text-xs bg-slate-800 px-1.5 py-0.5 border border-slate-600 rounded font-mono"
                >
                  #{shortHash(lastCommitHash)}
                  <GitCommit className="h-3 w-3" />
                </a>
              )}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Tag className="h-4 w-4 text-slate-400" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}/page/1`}
                className="bg-slate-900 px-3 py-1 text-sm font-medium text-emerald-300 brutal-hover-sm cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Divider */}
      <hr className="border-white/10 mb-8" />

      {/* Article content */}
      <div className="prose max-w-none">
        <MDXRenderer code={post.body.code} />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <Link
          href="/blog/page/1"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </footer>
      </article>
    </div>
  );
}

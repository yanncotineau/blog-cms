import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ExternalLink, Tag } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";

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

function relativeFromNow(input?: string) {
  if (!input) return null;
  const d = new Date(input).getTime();
  const diffMs = Date.now() - d;
  const abs = Math.abs(diffMs);

  const sec = 1000;
  const min = 60 * sec;
  const hour = 60 * min;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (abs >= year) { value = Math.round(diffMs / year); unit = "year"; }
  else if (abs >= month) { value = Math.round(diffMs / month); unit = "month"; }
  else if (abs >= week) { value = Math.round(diffMs / week); unit = "week"; }
  else if (abs >= day) { value = Math.round(diffMs / day); unit = "day"; }
  else if (abs >= hour) { value = Math.round(diffMs / hour); unit = "hour"; }
  else if (abs >= min) { value = Math.round(diffMs / min); unit = "minute"; }
  else { value = Math.round(diffMs / sec); unit = "second"; }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-value, unit);
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
  const updatedRel = relativeFromNow(post.lastCommitDate as string | undefined);
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
          
          {updatedRel && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {updatedRel}
              {lastCommitUrl && (
                <a
                  href={lastCommitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  #{shortHash(lastCommitHash)}
                  <ExternalLink className="h-3 w-3" />
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

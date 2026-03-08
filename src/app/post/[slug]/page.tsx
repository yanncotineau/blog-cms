import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, GitCommit } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
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
      <TableOfContents className="w-64 flex-shrink-0" />
      
      <article className="flex-1 min-w-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-serif">
            {post.title}
          </h1>

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
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline text-xs bg-slate-800 px-1.5 py-0.5 border border-slate-600 rounded font-mono"
                  >
                    #{shortHash(lastCommitHash)}
                    <GitCommit className="h-3 w-3" />
                  </a>
                )}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 text-xs font-medium
                    bg-slate-900 text-slate-300
                    brutal-hover-sm
                    cursor-pointer"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none">
          <MDXRenderer code={post.body.code} />
        </div>

        <footer className="mt-12 pt-8">
          <div className="flex gap-5 items-start mb-10">
            <div className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-white overflow-hidden">
              <Image
                src="/portrait.jpg"
                alt="Yann Cotineau"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-white tracking-wide">Yann COTINEAU</span>
              <span className="text-sm text-emerald-400 font-medium">Fullstack Software Engineer</span>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                I write about software engineering, AI, and things I learn along the way.
              </p>
            </div>
          </div>

          <Link
            href="/"
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

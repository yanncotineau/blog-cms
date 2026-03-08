"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Grid3X3, List, GitCommit } from "lucide-react";
import type { Post } from "contentlayer/generated";

interface BlogListProps {
  posts: Post[];
  showDrafts: boolean;
  intro?: {
    title: string;
    description: string;
    note: string;
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatFullDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

const tagButtonClass = `
  px-2 py-0.5 text-xs font-medium
  bg-slate-900 text-slate-300
  brutal-hover-sm
  cursor-pointer
`;

export default function BlogList({ posts, showDrafts, intro }: BlogListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredPosts = showDrafts
    ? posts
    : posts.filter((post) => !post.draft);

  const ViewToggle = () => (
    <div className="inline-flex">
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 cursor-pointer border-2 border-white transition-all duration-75 ${viewMode === "list" ? "bg-white text-slate-900" : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#fff]"}`}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 cursor-pointer border-2 border-white border-l-0 transition-all duration-75 ${viewMode === "grid" ? "bg-white text-slate-900" : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#fff]"}`}
        aria-label="Grid view"
      >
        <Grid3X3 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {intro && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2 font-serif">
              {intro.title}
            </h1>
            <p className="text-slate-400">
              {intro.description}
            </p>
            <p className="text-sm text-slate-500 mt-1 italic">
              {intro.note}
            </p>
          </div>
          <div className="self-start sm:self-center">
            <ViewToggle />
          </div>
        </div>
      )}

      {!intro && (
        <div className="flex justify-end">
          <ViewToggle />
        </div>
      )}

      {viewMode === "list" ? (
        <section className="space-y-4">
          {filteredPosts.map((post) => (
            <article key={post.slug} className={post.draft ? "opacity-60" : ""}>
              <div className="card p-6">
                <div className="flex gap-6">
                    {post.resolvedImage && (
                      <div className="hidden sm:block flex-shrink-0 w-44 h-28 overflow-hidden bg-slate-800 border-2 border-white">
                        <Image src={post.resolvedImage} alt="" width={176} height={112} className="w-full h-full object-cover" />
                      </div>
                    )}                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {post.draft && (
                      <span className="self-start bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                        Draft
                      </span>
                    )}
                    
                    <Link href={`/post/${post.slug}`} className="group">
                      <h2 className="text-xl font-semibold text-white font-serif group-hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      {post.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.date)}
                        </span>
                      )}
                      
                      {post.lastCommitDate && (
                        <span className="flex items-center gap-1.5" title={formatFullDateTime(post.lastCommitDate as string)}>
                          <GitCommit className="h-4 w-4" />
                          <span>changed {relativeFromNow(post.lastCommitDate as string)}</span>
                          {post.lastCommitDiffUrl && (
                            <a
                              href={post.lastCommitDiffUrl as string}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline font-mono"
                            >
                              #{shortHash(post.lastCommitHash as string)}
                            </a>
                          )}
                        </span>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className={tagButtonClass}>
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center flex-shrink-0">
                    <Link
                      href={`/post/${post.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2
                        bg-slate-900 text-white
                        brutal-hover-sm
                        text-sm font-medium cursor-pointer"
                    >
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <article key={post.slug} className={post.draft ? "opacity-60" : ""}>
              <div className="card p-0 overflow-hidden h-full flex flex-col">
                  {post.resolvedImage && (
                    <div className="w-full h-40 bg-slate-800">
                      <Image src={post.resolvedImage} alt="" width={400} height={160} className="w-full h-full object-cover" />
                    </div>
                  )}                <div className="p-5 flex flex-col gap-3 flex-1">
                  {post.draft && (
                    <span className="self-start bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                      Draft
                    </span>
                  )}
                  
                  <Link href={`/post/${post.slug}`} className="group">
                    <h2 className="text-lg font-semibold text-white line-clamp-2 font-serif group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  {post.date && (
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.date)}
                    </div>
                  )}
                  
                  {post.lastCommitDate && (
                    <div className="flex items-center gap-1 text-xs text-slate-500" title={formatFullDateTime(post.lastCommitDate as string)}>
                      <GitCommit className="h-3 w-3" />
                      <span>{relativeFromNow(post.lastCommitDate as string)}</span>
                      {post.lastCommitHash && (
                        <span className="font-mono">#{shortHash(post.lastCommitHash as string)}</span>
                      )}
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className={tagButtonClass}>
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <Link
                      href={`/post/${post.slug}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5
                        bg-slate-900 text-white
                        brutal-hover-sm
                        text-sm font-medium cursor-pointer"
                    >
                      Read
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {filteredPosts.length === 0 && (
        <p className="text-center text-slate-400 py-12">
          No articles yet.
        </p>
      )}
    </div>
  );
}

import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import MDXRenderer from "@/components/MDXRenderer";
import Link from "next/link";

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

function formatDateShort(input?: string) {
  if (!input) return null;
  try {
    return new Date(input).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
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

  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(-value, unit);
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

  const published = formatDateShort((post as any).date as string);
  const updatedRel = relativeFromNow((post as any).lastCommitDate as string | undefined);
  const lastCommitHash = (post as any).lastCommitHash as string | undefined;
  const lastCommitUrl = (post as any).lastCommitDiffUrl as string | undefined;

  return (
    <article className="card p-6">
      <h1 className="mb-2 text-3xl font-extrabold">{post.title}</h1>

      {/* single-line meta */}
      <div className="mb-4 text-sm text-[var(--muted)]">
        {published && <span>{published}</span>}
        {updatedRel && (
          <>
            <span> · last updated {updatedRel} on </span>
            <span className="ml-1">
              {lastCommitUrl ? (
                <a
                  href={lastCommitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                  aria-label="View last commit on GitHub"
                >
                  #{shortHash(lastCommitHash)}
                </a>
              ) : (
                <>#{shortHash(lastCommitHash)}</>
              )}
            </span>
          </>
        )}
      </div>

      {post.tags && post.tags.length > 0 && (
        <>
          <ul className="mb-4 mt-1 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/blog/tag/${encodeURIComponent(tag)}/page/1`}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/30"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>    
        </>
      )}

      <hr className="mb-2 border-white/10" />

      <div className="prose prose-invert max-w-none">
        <MDXRenderer code={post.body.code} />
      </div>
    </article>
  );
}

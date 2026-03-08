import { NextResponse } from "next/server";
import { allPosts } from "contentlayer/generated";
import { paginate, type Paginated } from "@/lib/pagination";

export type ApiPost = {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
  image?: string;
};
export type ApiPostsResponse = Paginated<ApiPost>;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const limit = searchParams.get("limit");
  const tag = searchParams.get("tag");
  const includeDrafts = searchParams.get("drafts") === "true";

  const sorted = [...allPosts]
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => +(new Date(b.date ?? 0)) - +(new Date(a.date ?? 0)));

  const filtered = tag
    ? sorted.filter((p) => p.tags?.includes(tag))
    : sorted;

  const mapped: ApiPost[] = filtered.map(({ slug, title, date, tags, resolvedImage }) => ({
    slug, title, date, tags,
    image: (resolvedImage as string) ?? undefined,
  }));

  if (limit) {
    const n = Math.max(1, Number(limit));
    return NextResponse.json<ApiPost[]>(mapped.slice(0, isFinite(n) ? n : 10));
  }

  const result = paginate<ApiPost>(mapped, isFinite(page) ? page : 1, isFinite(pageSize) ? pageSize : 10);
  return NextResponse.json<ApiPostsResponse>(result);
}

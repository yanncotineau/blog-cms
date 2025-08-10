import { NextResponse } from "next/server";
import { allPosts } from "contentlayer/generated";
import { paginate, type Paginated } from "@/lib/pagination";

export type ApiPost = { slug: string; title: string; date: string; tags?: string[] };
export type ApiPostsResponse = Paginated<ApiPost>;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const tag = searchParams.get("tag");

  const sorted = [...allPosts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  const filtered = tag
    ? sorted.filter((p) => p.tags?.includes(tag))
    : sorted;

  const mapped: ApiPost[] = filtered.map(({ slug, title, date, tags }) => ({
    slug, title, date, tags,
  }));

  const result = paginate<ApiPost>(mapped, isFinite(page) ? page : 1, isFinite(pageSize) ? pageSize : 10);

  return NextResponse.json<ApiPostsResponse>(result);
}

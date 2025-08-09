import { NextResponse } from "next/server";
import { allPosts } from "contentlayer/generated";

export async function GET() {
  const items = allPosts
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(({ slug, title, date }) => ({ slug, title, date }));
  return NextResponse.json({ posts: items });
}
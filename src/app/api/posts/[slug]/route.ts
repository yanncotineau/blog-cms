import { NextResponse } from "next/server";
import { allPosts } from "contentlayer/generated";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    slug: post.slug,
    title: post.title,
    date: post.date,
    mdx: {
      raw: post.body.raw,
      code: post.body.code
    }
  });
}
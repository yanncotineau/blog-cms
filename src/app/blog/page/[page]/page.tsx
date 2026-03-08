import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import BlogList from "@/components/BlogList";
import { getSortedPosts, PAGE_SIZE, BLOG_INTRO } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export default async function BlogIndex({
  params,
}: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page) || 1);

  const sorted = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  if (pageNum > totalPages) return notFound();

  const start = (pageNum - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-8">
      <BlogList posts={items} intro={BLOG_INTRO} />
      <Pagination basePath="/blog/page" page={pageNum} totalPages={totalPages} />
    </div>
  );
}

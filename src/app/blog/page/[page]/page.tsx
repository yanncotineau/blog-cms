import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Pagination from "@/components/Pagination";
import BlogList from "@/components/BlogList";

const PAGE_SIZE = 10;

// Show drafts in development
const isDev = process.env.NODE_ENV === "development";

export async function generateStaticParams() {
  const posts = isDev ? allPosts : allPosts.filter((p) => !p.draft);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export default async function BlogIndex({
  params,
}: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page) || 1);

  const sorted = [...allPosts].sort((a, b) => +(new Date(b.date ?? 0)) - +(new Date(a.date ?? 0)));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  if (pageNum > totalPages) return notFound();

  const start = (pageNum - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-8">
      {/* Posts with intro integrated */}
      <BlogList 
        posts={items} 
        showDrafts={isDev}
        intro={{
          title: "Welcome to my blog!",
          description: "I share things I learn, thoughts on everything software engineering.",
          note: "No generative AI is used in the articles content, it's all handcrafted."
        }}
      />

      {/* Pagination */}
      <Pagination basePath="/blog/page" page={pageNum} totalPages={totalPages} />
    </div>
  );
}

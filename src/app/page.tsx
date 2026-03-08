import BlogList from "@/components/BlogList";
import { getSortedPosts, BLOG_INTRO } from "@/lib/posts";

export default function Home() {
  const posts = getSortedPosts();

  return (
    <div className="space-y-8">
      <BlogList posts={posts} intro={BLOG_INTRO} />
    </div>
  );
}
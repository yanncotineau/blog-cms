import { allPosts } from "contentlayer/generated";
import BlogList from "@/components/BlogList";

const isDev = process.env.NODE_ENV === "development";

export default function Home() {
  const posts = isDev ? allPosts : allPosts.filter((p) => !p.draft);
  const sorted = [...posts].sort((a, b) => +(new Date(b.date ?? 0)) - +(new Date(a.date ?? 0)));

  return (
    <div className="space-y-8">
      <BlogList 
        posts={sorted} 
        showDrafts={isDev}
        intro={{
          title: "Welcome to my blog!",
          description: "I share things I learn or random thoughts on everything software engineering.",
          note: "No generative AI is used in the articles content, it's all handcrafted."
        }}
      />
    </div>
  );
}
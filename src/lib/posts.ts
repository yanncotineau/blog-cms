import { allPosts, type Post } from "contentlayer/generated";

/** True in development — used to decide whether to show draft posts. */
export const isDev = process.env.NODE_ENV === "development";

/** Number of posts per page. */
export const PAGE_SIZE = 10;

/** Intro block shown on the main blog listing. */
export const BLOG_INTRO = {
  title: "Welcome to my blog!",
  description:
    "I share things I learn, thoughts on everything software engineering.",
  note: "No generative AI is used in the articles content, it's all handcrafted.",
} as const;

/** Return all (or published-only) posts sorted by date descending. */
export function getSortedPosts(opts?: { tag?: string }): Post[] {
  let posts = isDev ? allPosts : allPosts.filter((p) => !p.draft);

  if (opts?.tag) {
    posts = posts.filter((p) => p.tags?.includes(opts.tag!));
  }

  return [...posts].sort(
    (a, b) => +(new Date(b.date ?? 0)) - +(new Date(a.date ?? 0)),
  );
}

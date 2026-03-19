import type { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { SITE_URL } from "@/lib/seo";
import { getSortedPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: post.lastCommitDate
      ? new Date(post.lastCommitDate)
      : post.date
        ? new Date(post.date)
        : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tags = new Set<string>();
  for (const p of allPosts) {
    for (const t of p.tags ?? []) {
      tags.add(t);
    }
  }

  const tagEntries: MetadataRoute.Sitemap = Array.from(tags).map((tag) => ({
    url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postEntries,
    ...tagEntries,
  ];
}

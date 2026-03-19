/** Centralised SEO constants used across the site. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yanncotineau.com";

export const SITE_NAME = "Yann COTINEAU - Blog";

export const SITE_DESCRIPTION =
  "Thoughts on software engineering, AI, music, and more — by Yann Cotineau.";

export const AUTHOR = {
  name: "Yann Cotineau",
  url: SITE_URL,
  twitter: "@yanncotineau",
  linkedIn: "https://www.linkedin.com/in/yanncotineau",
  github: "https://github.com/yanncotineau",
} as const;

"use client";
import { useMDXComponent } from "next-contentlayer2/hooks";

export default function MDXRenderer({ code }: { code: string }) {
  const MDX = useMDXComponent(code);
  return <MDX />;
}
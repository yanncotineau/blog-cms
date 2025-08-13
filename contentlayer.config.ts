import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import path from "path";
import fs from "fs";


const commitMapPath = path.join(process.cwd(), "content", "_commits.json");
const commitMap = fs.existsSync(commitMapPath)
  ? JSON.parse(fs.readFileSync(commitMapPath, "utf8"))
  : {};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, required: false }
  },
  computedFields: {
    lastCommitHash: {
      type: "string",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.hash ?? null,
    },
    lastCommitDate: {
      type: "string",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.date ?? null,
    },
    lastCommitUrl: {
      type: "string",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.commitUrl ?? null,
    },
    lastCommitDiffUrl: {
      type: "string",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.commitFileDiffUrl ?? null,
    },
    sourceAtCommitUrl: {
      type: "string",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.fileUrl ?? null,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    esbuildOptions: (options) => {
      options.loader = {
        ...(options.loader ?? {}),
        ".ts": "ts",
        ".tsx": "tsx",
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".jpeg": "dataurl",
        ".gif": "dataurl",
        ".svg": "dataurl",
        ".webp": "dataurl",
        ".avif": "dataurl",
      };

      options.resolveExtensions = [
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mdx",
        ".md",
        ".json",
      ];

      return options;
    },
  },
});

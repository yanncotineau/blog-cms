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
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    image: { type: "string", required: false },
    readingTime: { type: "number", required: false },
    draft: { type: "boolean", required: false, default: false },
  },
  computedFields: {
    resolvedImage: {
      type: "string",
      resolve: (doc) => {
        if (!doc.image) return null;
        const dir = path.dirname(doc._raw.sourceFilePath);
        return `/images/${dir}/${doc.image}`;
      },
    },
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
    lastCommitInsertions: {
      type: "number",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.insertions ?? null,
    },
    lastCommitDeletions: {
      type: "number",
      resolve: (doc) => commitMap[doc._raw.sourceFilePath]?.deletions ?? null,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  contentDirExclude: ["_commits.json"],
  disableImportAliasWarning: true,
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

#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoDir = path.join(process.cwd(), "content");
const repoUrl = "https://github.com/yanncotineau/blog";

function sh(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
}

const files = sh(`git -C "${repoDir}" ls-files -- '*.mdx'`).split("\n").filter(Boolean);

const map = {};
for (const f of files) {
  const hash = sh(`git -C "${repoDir}" log -n 1 --format=%H -- "${f}"`);
  const iso  = sh(`git -C "${repoDir}" log -n 1 --format=%cI -- "${f}"`);
  const fileUrl   = `${repoUrl}/blob/${hash}/${f}`;
  const commitUrl = `${repoUrl}/commit/${hash}`;
  const diffAnchor = crypto.createHash("sha256").update(f).digest("hex");
  const commitFileDiffUrl = `${commitUrl}#diff-${diffAnchor}`;
  map[f] = { hash, date: iso, fileUrl, commitUrl, commitFileDiffUrl };
}

fs.writeFileSync(path.join(repoDir, "_commits.json"), JSON.stringify(map, null, 2));
console.log(`Wrote commit map for ${files.length} MDX files.`);
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

  // Get insertions/deletions for this file in the last commit
  let insertions = 0;
  let deletions = 0;
  try {
    const numstat = sh(`git -C "${repoDir}" log -n 1 --numstat --format="" -- "${f}"`);
    for (const line of numstat.split("\n").filter(Boolean)) {
      const [ins, del] = line.split("\t");
      if (ins !== "-") insertions += parseInt(ins, 10) || 0;
      if (del !== "-") deletions += parseInt(del, 10) || 0;
    }
  } catch { /* binary or missing — leave at 0 */ }

  map[f] = { hash, date: iso, fileUrl, commitUrl, commitFileDiffUrl, insertions, deletions };
}

fs.writeFileSync(path.join(repoDir, "_commits.json"), JSON.stringify(map, null, 2));
console.log(`Wrote commit map for ${files.length} MDX files.`);
interface GithubCardProps {
  owner: string;
  repo: string;
  description?: string;
}

export default function GithubCard({
  owner,
  repo,
  description,
}: GithubCardProps) {
  const repoUrl = `https://github.com/${owner}/${repo}`;

  return (
    <div
      className="my-4 brutal-hover bg-slate-900/50 p-4 hover:bg-slate-900/80"
      role="group"
    >
      <div className={`flex ${description ? "items-start" : "items-center"} justify-between gap-4`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="truncate text-lg font-semibold leading-tight text-white">
              {repo}
            </span>
            <span className="shrink-0 text-sm text-slate-400">@{owner}</span>
          </div>

          {description && (
            <p className="!mb-0 line-clamp-2 mt-2 text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>

        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2
                     bg-slate-900 text-white text-sm font-medium
                     brutal-hover-sm
                     px-3 py-2 cursor-pointer"
          aria-label={`View ${owner}/${repo} on GitHub`}
        >
          <GitHubMark className="h-4 w-4" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}

function GitHubMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.73 0 8.33c0 3.68 2.29 6.8 5.47 7.9.4.08.55-.18.55-.39
           0-.19-.01-.82-.01-1.49-2.01.37-2.53-.51-2.69-.98-.09-.25-.48-.98-.82-1.18-.28-.15-.68-.52-.01-.53.63-.01
           1.08.6 1.23.85.72 1.21 1.87.87 2.33.66.07-.53.28-.87.51-1.07-1.78-.21-3.65-.92-3.65-4.08
           0-.9.31-1.64.82-2.22-.08-.21-.36-1.07.08-2.23 0 0 .67-.22 2.2.85a7.3 7.3 0 0 1 2-.28c.68 0 1.36.09 2 .28
           1.53-1.07 2.2-.85 2.2-.85.44 1.16.16 2.02.08 2.23.51.58.82 1.32.82 2.22 0 3.17-1.87 3.87-3.66 4.07.29.26.54.76.54 1.54
           0 1.11-.01 2-.01 2.27 0 .21.15.47.55.39C13.71 15.13 16 12.01 16 8.33 16 3.73 12.42 0 8 0Z"
      />
    </svg>
  );
}

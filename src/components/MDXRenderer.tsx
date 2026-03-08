"use client";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { Link as LinkIcon } from "lucide-react";
import CodeBlock from "./mdx/CodeBlock";
import FlowDiagram from "./mdx/FlowDiagram";
import MusicPlayer from "./mdx/MusicPlayer";
import Callout from "./mdx/Callout";
import GithubCard from "./mdx/GithubCard";
import InfoBox from "./mdx/InfoBox";
import Figure from "./mdx/Figure";
import Carousel from "./mdx/Carousel";

function HeadingLink({ as: Tag, children, id, ...props }: { as: "h2" | "h3" | "h4"; children?: React.ReactNode; id?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  const headingId = id || (typeof children === "string" ? children.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "");

  const handleClick = () => {
    const el = document.getElementById(headingId);
    if (el) {
      el.scrollIntoView({ behavior: "instant" });
      window.history.replaceState(null, "", `#${headingId}`);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Tag id={headingId} onClick={handleClick} {...props}>
      {children}
      <button
        onClick={handleCopyLink}
        className="heading-anchor inline-flex items-center cursor-pointer"
        aria-label="Copy link to section"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </Tag>
  );
}

const mdxComponents = {
  CodeBlock,
  FlowDiagram,
  MusicPlayer,
  Callout,
  GithubCard,
  InfoBox,
  Figure,
  Carousel,
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
    return (
      <a href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <HeadingLink as="h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <HeadingLink as="h3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <HeadingLink as="h4" {...props} />,
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) => {
    if (children && typeof children === "object" && "props" in children) {
      const codeProps = children.props as { className?: string; children?: string };
      const language = codeProps.className?.replace("language-", "") || "text";
      const code = codeProps.children || "";
      return <CodeBlock language={language}>{code}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
};

export default function MDXRenderer({ code }: { code: string }) {
  const MDX = useMDXComponent(code);
  return <MDX components={mdxComponents} />;
}
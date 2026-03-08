"use client";

import { useEffect, useRef, useState } from "react";
import { List, ChevronRight, ChevronDown } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCLevel3 {
  heading: TOCItem;
}

interface TOCLevel2 {
  heading: TOCItem;
  children: (TOCItem & { children?: TOCLevel3[] })[];
}

interface TOCSection {
  heading: TOCItem;
  children: TOCLevel2["children"];
}

interface TableOfContentsProps {
  className?: string;
}

const NAVBAR_OFFSET = 80;

export default function TableOfContents({ className = "" }: TableOfContentsProps) {
  const [sections, setSections] = useState<TOCSection[]>([]);
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const desktopNavRef = useRef<HTMLElement>(null);

  // Auto-scroll the TOC so the active item is always visible
  useEffect(() => {
    if (!activeId || !desktopNavRef.current) return;
    const activeEl = desktopNavRef.current.querySelector(`[data-toc-id="${activeId}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeId]);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3, h4");
    const items: TOCItem[] = [];

    elements.forEach((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      if (!el.id) el.id = id;
      (el as HTMLElement).style.scrollMarginTop = `${NAVBAR_OFFSET}px`;
      items.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName.charAt(1)),
      });
    });

    setHeadings(items);

    const sectionList: TOCSection[] = [];
    let currentH2: TOCSection | null = null;
    let currentH3: TOCLevel2["children"][number] | null = null;

    items.forEach((item) => {
      if (item.level === 2) {
        if (currentH2) sectionList.push(currentH2);
        currentH2 = { heading: item, children: [] };
        currentH3 = null;
      } else if (item.level === 3) {
        const h3Entry = { ...item, children: [] as TOCLevel3[] };
        if (currentH2) {
          currentH2.children.push(h3Entry);
        } else {
          sectionList.push({ heading: item, children: [] });
        }
        currentH3 = h3Entry;
      } else if (item.level === 4 && currentH3 && currentH3.children) {
        currentH3.children.push({ heading: item });
      }
    });

    if (currentH2) sectionList.push(currentH2);
    setSections(sectionList);

    const expanded = new Set<string>();
    sectionList.forEach((s) => { if (s.children.length > 0) expanded.add(s.heading.id); });
    sectionList.forEach((s) => {
      s.children.forEach((c) => {
        if (c.children && c.children.length > 0) expanded.add(c.id);
      });
    });
    setExpandedSections(expanded);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            const activeHeading = headings.find(h => h.id === entry.target.id);
            if (activeHeading) {
              if (activeHeading.level === 3) {
                const parentSection = sections.find(s =>
                  s.children.some(c => c.id === entry.target.id)
                );
                if (parentSection) {
                  setExpandedSections(prev => new Set([...prev, parentSection.heading.id]));
                }
              } else if (activeHeading.level === 4) {
                for (const section of sections) {
                  for (const child of section.children) {
                    if (child.children?.some(gc => gc.heading.id === entry.target.id)) {
                      setExpandedSections(prev => new Set([...prev, section.heading.id, child.id]));
                    }
                  }
                }
              }
            }
          }
        });
      },
      {
        rootMargin: `-${NAVBAR_OFFSET}px 0% -80% 0%`,
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
      window.scrollTo({ top: y, behavior: "instant" });
      window.history.replaceState(null, "", `#${id}`);
      setIsOpen(false);
    }
  };

  const toggleSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const hasSections = sections.length > 0;

  return (
    <>
      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors cursor-pointer"
          aria-label="Table of contents"
        >
          <List className="h-5 w-5" />
        </button>
        
        {isOpen && hasSections && (
          <div className="absolute bottom-14 right-0 w-72 max-h-80 overflow-y-auto bg-slate-900 border-2 border-white shadow-[4px_4px_0_0_#fff] p-4">
            <h3 className="font-semibold text-sm text-white mb-3">
              Table of Contents
            </h3>
            <nav>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <TOCNode
                    key={section.heading.id}
                    section={section}
                    activeId={activeId}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    scrollTo={scrollTo}
                    depth={0}
                    variant="mobile"
                  />
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block ${className}`}>
        <div className="fixed top-24 max-h-[calc(100vh-8rem)] w-64 flex flex-col">
          <h3 className="font-semibold text-sm text-white mb-3 shrink-0">
            Table of Contents
          </h3>
          {hasSections && (
            <nav ref={desktopNavRef} className="overflow-y-auto flex-1 min-h-0">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <TOCNode
                    key={section.heading.id}
                    section={section}
                    activeId={activeId}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    scrollTo={scrollTo}
                    depth={0}
                    variant="desktop"
                  />
                ))}
              </ul>
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}

function TOCNode({
  section,
  activeId,
  expandedSections,
  toggleSection,
  scrollTo,
  depth,
  variant,
}: {
  section: TOCSection;
  activeId: string;
  expandedSections: Set<string>;
  toggleSection: (id: string, e: React.MouseEvent) => void;
  scrollTo: (id: string) => void;
  depth: number;
  variant: "mobile" | "desktop";
}) {
  const hasChildren = section.children.length > 0;
  const isExpanded = expandedSections.has(section.heading.id);

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={(e) => toggleSection(section.heading.id, e)}
            className="w-5 flex items-center justify-center text-slate-400 hover:text-slate-300 cursor-pointer shrink-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <button
          data-toc-id={section.heading.id}
          onClick={() => scrollTo(section.heading.id)}
          className={`flex-1 text-left text-sm py-1 transition-colors cursor-pointer ${
            activeId === section.heading.id
              ? "text-emerald-400 font-medium"
              : `${depth === 0 ? "text-slate-300" : "text-slate-400"} hover:text-slate-200`
          }`}
        >
          {section.heading.text}
        </button>
      </div>

      {hasChildren && isExpanded && (
        <ul className={`ml-5 mt-0.5 space-y-0.5 ${variant === "mobile" ? "border-l border-slate-700 pl-1" : ""}`}>
          {section.children.map((child) => {
            const h4Children = child.children || [];
            const childAsSection: TOCSection = {
              heading: { id: child.id, text: child.text, level: child.level },
              children: h4Children.map((h4) => ({ ...h4.heading, children: [] })),
            };
            return (
              <TOCNode
                key={child.id}
                section={childAsSection}
                activeId={activeId}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                scrollTo={scrollTo}
                depth={depth + 1}
                variant={variant}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}

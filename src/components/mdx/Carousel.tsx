"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import {
  Layers,
  GitBranch,
  Brain,
  Search,
  Database,
  Cpu,
  FileText,
  Zap,
  Shield,
  Globe,
  Code,
  BookOpen,
} from "lucide-react";

interface CarouselItem {
  icon?: string;
  title: string;
  description: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  "git-branch": GitBranch,
  brain: Brain,
  search: Search,
  database: Database,
  cpu: Cpu,
  "file-text": FileText,
  zap: Zap,
  shield: Shield,
  globe: Globe,
  code: Code,
  "book-open": BookOpen,
};

function getIcon(name?: string): React.ComponentType<{ className?: string }> | null {
  if (!name) return null;
  return iconMap[name] || null;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="underline text-indigo-400 hover:text-white transition-colors">
          {linkMatch[1]}
        </a>
      );
    }
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code key={i} className="bg-white/10 text-indigo-300 px-1.5 py-0.5 text-xs rounded font-mono">
          {codeMatch[1]}
        </code>
      );
    }
    return part;
  });
}

export default function Carousel({ items }: CarouselProps) {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="not-prose my-8 carousel-brutal relative">
      <div className="brutal-hover bg-slate-900/80 py-8 px-2 sm:px-4">
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={items.length > 2}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          onSwiper={setSwiperRef}
          className="!items-stretch"
        >
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <SwiperSlide
                key={i}
                className="!w-[80%] sm:!w-[70%] max-w-md !h-auto"
              >
                {({ isActive }) => (
                  <div
                    className={`h-full flex flex-col items-center justify-center text-center px-6 py-6 border-2 border-white select-none transition-opacity duration-150 ${
                      isActive
                        ? "bg-slate-800/80"
                        : "bg-slate-900/50 opacity-50"
                    }`}
                  >
                    {Icon && (
                      <div className="inline-flex p-3 border border-white/20 text-emerald-400 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                    )}
                    <p className="text-lg font-semibold text-white mb-2 font-serif">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {renderInlineMarkdown(item.description)}
                    </p>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom nav buttons */}
        <button
          onClick={() => swiperRef?.slidePrev()}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-slate-950/95 border-2 border-white text-white cursor-pointer brutal-hover-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => swiperRef?.slideNext()}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-slate-950/95 border-2 border-white text-white cursor-pointer brutal-hover-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import Image from "next/image";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: "full" | "half" | "third";
  float?: "left" | "right";
  href?: string;
  bgWhite?: boolean;
  contain?: boolean;
  children?: React.ReactNode;
}

const widthClass: Record<string, string> = {
  full: "w-full",
  half: "w-full sm:w-1/2",
  third: "w-full sm:w-1/3",
};

export default function Figure({
  src,
  alt,
  caption,
  width = "full",
  float,
  href,
  bgWhite,
  contain,
  children,
}: FigureProps) {
  const isFloating = float && width !== "full";

  if (isFloating && children) {
    return (
      <div className="not-prose my-8 flex flex-col sm:flex-row gap-6 items-start">
        {float === "left" && (
          <>
            <FigureBlock src={src} alt={alt} caption={caption} href={href} bgWhite={bgWhite} contain={contain} className={widthClass[width]} />
            <div className="flex-1 prose prose-sm">{children}</div>
          </>
        )}
        {float === "right" && (
          <>
            <div className="flex-1 prose prose-sm">{children}</div>
            <FigureBlock src={src} alt={alt} caption={caption} href={href} bgWhite={bgWhite} contain={contain} className={widthClass[width]} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`not-prose my-8 ${isFloating ? (float === "left" ? "sm:float-left sm:mr-6 sm:mb-4" : "sm:float-right sm:ml-6 sm:mb-4") : ""}`}>
      <FigureBlock src={src} alt={alt} caption={caption} href={href} bgWhite={bgWhite} contain={contain} className={isFloating ? widthClass[width] : "w-full"} />
    </div>
  );
}

function FigureBlock({ src, alt, caption, href, bgWhite, contain, className }: { src: string; alt: string; caption?: string; href?: string; bgWhite?: boolean; contain?: boolean; className?: string }) {
  const imageContent = (
    <div className={`overflow-hidden brutal-hover leading-[0] ${bgWhite ? "bg-white" : ""} ${href ? "cursor-pointer" : ""} ${contain ? "h-full flex items-center justify-center p-4" : ""}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={contain ? "object-contain max-h-full w-auto max-w-full" : "w-full h-auto"}
        style={{ display: "block", margin: 0 }}
      />
    </div>
  );

  return (
    <figure className={className}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {imageContent}
        </a>
      ) : (
        imageContent
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

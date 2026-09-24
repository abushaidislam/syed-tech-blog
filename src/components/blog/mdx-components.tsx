import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lightbulb,
  Info,
  AlertTriangle,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { slugify } from "@/lib/utils";
import { CodeBlock, HeadingAnchor } from "./mdx-client-components";

function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    const allowed = [
      "assets.dub.co",
      "images.unsplash.com",
      "avatar.vercel.sh",
      "github.com",
      "avatars.githubusercontent.com",
    ];
    return allowed.includes(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Extract plain text from React children to generate heading IDs.
 */
function extractText(node: React.ReactNode): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (React.isValidElement(node) && node.props) {
    return extractText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

/**
 * Custom MDX Quote component matching dub.co's Rowan serif style 1:1.
 */
export function Quote({
  children,
  author,
  role,
  avatar,
}: {
  children: React.ReactNode;
  author?: string;
  role?: string;
  avatar?: string;
}) {
  return (
    <div className="not-prose my-6 flex flex-col gap-6 rounded-xl border border-neutral-300 bg-white py-8 pl-8 pr-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.08),0px_2px_8px_0px_rgba(0,0,0,0.06)]">
      <div className="font-rowan text-2xl font-light leading-[1.45] tracking-tight text-neutral-800 [text-indent:-0.45em] before:content-['“'] after:content-['”'] [&_a]:text-neutral-800 [&_a]:decoration-1 [&_a]:underline [&_a]:underline-offset-4 [&_p]:my-0 [&_p]:inline">
        {children}
      </div>
      {(author || avatar) && (
        <div className="flex items-center gap-3">
          {avatar && (
            <div className="relative size-6 shrink-0 rounded-full overflow-hidden">
              <Image
                src={avatar}
                alt={author || "Quote author"}
                width={24}
                height={24}
                sizes="24px"
                unoptimized={!isOptimizableImage(avatar)}
                className="size-6 rounded-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs tracking-[-0.02em]">
            {author && (
              <span className="font-semibold text-neutral-600">{author}</span>
            )}
            {role && (
              <span className="font-medium text-neutral-500">• {role}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom MDX Callout banner matching Dub's exact 4 color variations 1:1:
 * - tip: green-200 / green-50 with Lightbulb
 * - info / note: blue-200 / blue-50 with Info
 * - warning / caution: yellow-200 / yellow-50 with AlertTriangle
 * - help: pink-200 / pink-50 with HelpCircle
 */
export function Callout({
  children,
  type = "tip",
}: {
  children: React.ReactNode;
  type?: "tip" | "info" | "warning" | "help" | "note" | "caution";
}) {
  const normalizedType =
    type === "note" ? "info" : type === "caution" ? "warning" : type;

  const styles = {
    tip: {
      border: "border-green-200 bg-green-50",
      icon: <Lightbulb className="size-5 shrink-0 text-green-500" />,
    },
    info: {
      border: "border-blue-200 bg-blue-50",
      icon: <Info className="size-5 shrink-0 text-blue-500" />,
    },
    warning: {
      border: "border-yellow-200 bg-yellow-50",
      icon: <AlertTriangle className="size-5 shrink-0 text-yellow-500" />,
    },
    help: {
      border: "border-pink-200 bg-pink-50",
      icon: <HelpCircle className="size-5 shrink-0 text-pink-500" />,
    },
  }[normalizedType] || {
    border: "border-green-200 bg-green-50",
    icon: <Lightbulb className="size-5 shrink-0 text-green-500" />,
  };

  return (
    <div
      className={`not-prose my-6 flex items-start space-x-3 rounded-2xl border p-4 pr-8 text-[0.95rem] text-neutral-800 ${styles.border} [&>p]:my-0 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4`}
    >
      <div className="mt-1 shrink-0">{styles.icon}</div>
      <div className="leading-relaxed [&_p]:my-0">{children}</div>
    </div>
  );
}

/**
 * Custom MDX Video component matching Dub's video player wrapper with full controls and accessibility.
 */
export function Video({
  src,
  poster,
  caption,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = true,
  className,
  children,
  ...props
}: {
  src?: string;
  poster?: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.VideoHTMLAttributes<HTMLVideoElement>) {
  // Extract src from children <source> tags if not directly passed on props
  let resolvedSrc = src;
  if (!resolvedSrc && children) {
    if (React.isValidElement(children)) {
      const p = children.props as { src?: string };
      if (p.src) resolvedSrc = p.src;
    } else if (Array.isArray(children)) {
      for (const child of children) {
        if (React.isValidElement(child)) {
          const p = child.props as { src?: string };
          if (p.src) {
            resolvedSrc = p.src;
            break;
          }
        }
      }
    }
  }

  if (!resolvedSrc && !children) return null;

  return (
    <figure className="not-prose my-6 w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 shadow-sm">
        <video
          className="size-full object-cover"
          src={resolvedSrc}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload="metadata"
          {...props}
        >
          {children || (resolvedSrc ? <source src={resolvedSrc} type="video/mp4" /> : null)}
          Your browser does not support the video tag.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Complete MDX custom components mapping matching Dub design system 1:1.
 */
export const blogMdxComponents = {
  Quote,
  Callout,
  Video,
  video: Video,

  // Headings matching Dub's exact typography and hover link anchor button
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <HeadingAnchor id={id} as="h2">
        {children}
      </HeadingAnchor>
    );
  },

  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <HeadingAnchor id={id} as="h3">
        {children}
      </HeadingAnchor>
    );
  },

  // Interactive Code Blocks
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    if (React.isValidElement(children) && children.type === "code") {
      const codeProps = children.props as {
        className?: string;
        children?: React.ReactNode;
      };
      return (
        <CodeBlock className={codeProps.className}>
          {codeProps.children}
        </CodeBlock>
      );
    }
    return <CodeBlock>{children}</CodeBlock>;
  },

  code: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    if (!className) {
      return (
        <code
          className="rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.875em] font-normal text-neutral-800"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  table: ({
    children,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="not-prose my-6 max-w-full overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
      <table
        className="my-0 w-full border-separate border-spacing-0 text-left text-[0.95rem] [&_th]:border-b [&_th]:border-r [&_th]:border-neutral-200 [&_th]:bg-neutral-50 [&_th]:!px-4 [&_th]:py-3 [&_th]:align-top [&_th]:font-semibold [&_th]:text-neutral-900 [&_td]:border-b [&_td]:border-r [&_td]:border-neutral-200 [&_td]:!px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-neutral-600 [&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0 [&_tr:last-child_td]:border-b-0"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="not-prose group relative my-8 block w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
        <span className="block relative aspect-[16/9] w-full bg-neutral-100">
          <Image
            src={src}
            alt={alt || "Post illustration"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 750px, 800px"
            unoptimized={!isOptimizableImage(src)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </span>
        {alt && (
          <span className="block border-t border-neutral-100 bg-white px-4 py-2 text-center text-xs text-neutral-500">
            {alt}
          </span>
        )}
      </span>
    );
  },

  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (!href) return <span>{children}</span>;
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-neutral-800"
          {...props}
        >
          {children}
          <ArrowUpRight className="ml-0.5 inline-block size-3.5 align-baseline text-neutral-400" />
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-neutral-800"
        {...props}
      >
        {children}
      </Link>
    );
  },

  blockquote: ({
    children,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-neutral-800 pl-6 italic text-neutral-700"
      {...props}
    >
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-8 border-t border-neutral-200" />,
};

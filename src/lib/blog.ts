import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogPostMeta,
  BlogCategory,
  BlogPostHeading,
  BlogAuthor,
} from "@/types/blog";
import { BLOG_CATEGORIES } from "@/config/blog-categories";
import { slugify } from "./utils";
import type { Locale } from "@/config/i18n";

export { BLOG_CATEGORIES, slugify };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Performance Optimization: In-memory cache for parsed blog posts to prevent N+1 synchronous file reads and YAML frontmatter re-parsing.
const blogPostCache = new Map<string, BlogPostMdx>();

// Performance Optimization: In-memory cache for file existence checks to eliminate redundant fs.existsSync syscalls.
const fileExistsCache = new Map<string, boolean>();

// Performance Optimization: In-memory cache for deduplicated blog post slugs across directories.
let cachedSlugs: string[] | null = null;

function cachedExistsSync(filePath: string): boolean {
  if (fileExistsCache.has(filePath)) {
    return fileExistsCache.get(filePath)!;
  }
  const exists = fs.existsSync(filePath);
  fileExistsCache.set(filePath, exists);
  return exists;
}

export interface BlogPostFrontmatter {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  dateIso: string;
  dateFormatted: string;
  category: string;
  categoryName?: string;
  authors: BlogAuthor[];
  featured?: boolean;
  ogTitle?: string;
  ogSummary?: string;
  tags?: string[];
  keywords?: string[];
  updatedAt?: string;
}

export interface BlogPostMdx {
  frontmatter: BlogPostFrontmatter;
  content: string;
  headings: BlogPostHeading[];
  isFallback?: boolean;
  locale?: Locale;
}

export function extractHeadingsFromMdx(content: string): BlogPostHeading[] {
  const headings: BlogPostHeading[] = [];
  const headingRegex = /^##\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const rawTitle = match[1].trim();
    const cleanTitle = rawTitle
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    const id = slugify(cleanTitle);
    if (id && cleanTitle) {
      headings.push({ id, title: cleanTitle });
    }
  }
  return headings;
}

/**
 * Get all base blog post slugs from content/blog/en, content/blog/bn, or root (deduplicated across locales).
 */
export function getAllBlogPostSlugs(): string[] {
  if (cachedSlugs) return cachedSlugs;
  if (!cachedExistsSync(BLOG_DIR)) return [];
  const slugs = new Set<string>();

  const scanDir = (dir: string) => {
    if (!cachedExistsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        const baseSlug = entry.name
          .replace(/\.bn\.mdx$/, "")
          .replace(/\.en\.mdx$/, "")
          .replace(/\.mdx$/, "");
        slugs.add(baseSlug);
      }
    }
  };

  scanDir(path.join(BLOG_DIR, "en"));
  scanDir(path.join(BLOG_DIR, "bn"));
  scanDir(BLOG_DIR);

  cachedSlugs = Array.from(slugs);
  return cachedSlugs;
}

/**
 * Read and parse a single blog post MDX file by slug and locale with graceful fallback across en and bn folders.
 */
export function getBlogPostBySlug(
  slug: string,
  locale: Locale = "en",
): BlogPostMdx | null {
  const cacheKey = `${slug}:${locale}`;
  if (blogPostCache.has(cacheKey)) {
    return blogPostCache.get(cacheKey)!;
  }

  const bnCandidates = [
    path.join(BLOG_DIR, "bn", `${slug}.mdx`),
    path.join(BLOG_DIR, `${slug}.bn.mdx`),
  ];
  const enCandidates = [
    path.join(BLOG_DIR, "en", `${slug}.mdx`),
    path.join(BLOG_DIR, `${slug}.mdx`),
  ];

  let targetPath: string | null = null;
  let isFallback = false;
  let actualLocale: Locale = locale;

  if (locale === "bn") {
    targetPath = bnCandidates.find((p) => cachedExistsSync(p)) || null;
    if (targetPath) {
      actualLocale = "bn";
    } else {
      targetPath = enCandidates.find((p) => cachedExistsSync(p)) || null;
      if (targetPath) {
        isFallback = true;
        actualLocale = "en";
      }
    }
  } else {
    targetPath = enCandidates.find((p) => cachedExistsSync(p)) || null;
    if (targetPath) {
      actualLocale = "en";
    } else {
      targetPath = bnCandidates.find((p) => cachedExistsSync(p)) || null;
      if (targetPath) {
        isFallback = true;
        actualLocale = "bn";
      }
    }
  }

  if (!targetPath) return null;

  const raw = fs.readFileSync(targetPath, "utf-8");
  const { data, content } = matter(raw);

  // Performance Optimization: Lazy-evaluate heading extraction so callers like sitemap generation avoid expensive regex passes.
  let cachedHeadings: BlogPostHeading[] | undefined;
  const post: BlogPostMdx = {
    frontmatter: {
      ...(data as BlogPostFrontmatter),
      slug,
    },
    content,
    get headings() {
      if (!cachedHeadings) {
        cachedHeadings = extractHeadingsFromMdx(content);
      }
      return cachedHeadings;
    },
    isFallback,
    locale: actualLocale,
  };

  blogPostCache.set(cacheKey, post);
  return post;
}

/**
 * Convert frontmatter to BlogPostMeta for list views with localized category names.
 */
export function frontmatterToBlogPostMeta(
  fm: BlogPostFrontmatter,
  locale: Locale = "en",
): BlogPostMeta {
  const baseCategory = BLOG_CATEGORIES.find((c) => c.slug === fm.category) || {
    slug: fm.category,
    name: fm.categoryName || fm.category,
  };

  const bnCategoryNames: Record<string, string> = {
    company: "কোম্পানি",
    education: "শিক্ষা",
    engineering: "ইঞ্জিনিয়ারিং",
    customers: "গ্রাহকদের গল্প",
  };

  const categoryName =
    locale === "bn"
      ? bnCategoryNames[baseCategory.slug] || baseCategory.name
      : baseCategory.name;

  return {
    slug: fm.slug,
    title: fm.title,
    summary: fm.summary,
    image: fm.image,
    dateIso: fm.dateIso,
    dateFormatted: fm.dateFormatted,
    category: {
      ...baseCategory,
      name: categoryName,
    },
    authors: fm.authors || [],
    featured: Boolean(fm.featured),
    ogTitle: fm.ogTitle,
    ogSummary: fm.ogSummary,
    tags: fm.tags || [],
    keywords: fm.keywords || [],
    updatedAt: fm.updatedAt || fm.dateIso,
  };
}

/**
 * Get all blog posts metadata sorted by date descending (featured posts prioritized).
 */
export function getAllBlogPosts(locale: Locale = "en"): BlogPostMeta[] {
  const slugs = getAllBlogPostSlugs();
  const posts = slugs
    .map((slug) => {
      const mdx = getBlogPostBySlug(slug, locale);
      if (!mdx) return null;
      return {
        ...frontmatterToBlogPostMeta(mdx.frontmatter, locale),
        isFallback: mdx.isFallback,
        locale: mdx.locale,
      };
    })
    .filter(Boolean) as BlogPostMeta[];

  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime();
  });
}

/**
 * Get blog posts by category slug.
 */
export function getBlogPostsByCategory(
  categorySlug: string,
  locale: Locale = "en",
): BlogPostMeta[] {
  return getAllBlogPosts(locale).filter((p) => p.category.slug === categorySlug);
}

/**
 * Get category details by category slug.
 */
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Get related posts for an article (same category first, then recent).
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 4,
  locale: Locale = "en",
): BlogPostMeta[] {
  const all = getAllBlogPosts(locale);
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return all.slice(0, limit);

  const sameCategory = all.filter(
    (p) => p.category.slug === current.category.slug && p.slug !== currentSlug,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const others = all.filter(
    (p) => p.slug !== currentSlug && !sameCategory.some((sc) => sc.slug === p.slug),
  );

  return [...sameCategory, ...others].slice(0, limit);
}


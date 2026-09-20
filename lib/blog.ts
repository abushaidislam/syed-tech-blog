import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogPostMeta,
  BlogCategory,
  BlogPostHeading,
  BlogAuthor,
} from "@/ui/blog/blog-types";
import { BLOG_CATEGORIES } from "@/ui/blog/blog-categories";
import { slugify } from "./blog-utils";

export { BLOG_CATEGORIES, slugify };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostFrontmatter {
  slug: string;
  title: string;
  summary: string;
  image: string;
  dateIso: string;
  dateFormatted: string;
  category: string;
  categoryName?: string;
  authors: BlogAuthor[];
}

export interface BlogPostMdx {
  frontmatter: BlogPostFrontmatter;
  content: string;
  headings: BlogPostHeading[];
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
 * Get all blog post slugs from the content/blog directory.
 */
export function getAllBlogPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Read and parse a single blog post MDX file by slug.
 */
export function getBlogPostBySlug(slug: string): BlogPostMdx | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const headings = extractHeadingsFromMdx(content);

  return {
    frontmatter: data as BlogPostFrontmatter,
    content,
    headings,
  };
}

/**
 * Convert frontmatter to BlogPostMeta for list views.
 */
export function frontmatterToBlogPostMeta(
  fm: BlogPostFrontmatter,
): BlogPostMeta {
  const categoryObj = BLOG_CATEGORIES.find((c) => c.slug === fm.category) || {
    slug: fm.category,
    name: fm.categoryName || fm.category,
  };

  return {
    slug: fm.slug,
    title: fm.title,
    summary: fm.summary,
    image: fm.image,
    dateIso: fm.dateIso,
    dateFormatted: fm.dateFormatted,
    category: categoryObj,
    authors: fm.authors || [],
  };
}

/**
 * Get all blog posts metadata sorted by date descending.
 */
export function getAllBlogPosts(): BlogPostMeta[] {
  const slugs = getAllBlogPostSlugs();
  const posts = slugs
    .map((slug) => {
      const mdx = getBlogPostBySlug(slug);
      return mdx ? frontmatterToBlogPostMeta(mdx.frontmatter) : null;
    })
    .filter(Boolean) as BlogPostMeta[];

  return posts.sort(
    (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime(),
  );
}

/**
 * Get blog posts by category slug.
 */
export function getBlogPostsByCategory(categorySlug: string): BlogPostMeta[] {
  return getAllBlogPosts().filter((p) => p.category.slug === categorySlug);
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
): BlogPostMeta[] {
  const all = getAllBlogPosts();
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

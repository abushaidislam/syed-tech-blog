import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/ui/blog/blog-header";
import { BlogGrid } from "@/ui/blog/blog-grid";
import { BlogBottomCTA } from "@/ui/blog/blog-bottom-cta";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getBlogPostsByCategory,
} from "@/lib/blog";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Syed Blog",
    };
  }

  return {
    title: `${category.name} | Syed Blog`,
    description: category.description || `Articles in ${category.name} from Syed Blog.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getBlogPostsByCategory(categorySlug);

  return (
    <main className="min-h-screen bg-white">
      <BlogHeader
        title={category.name}
        description={category.description}
        activeCategory={category.slug}
      />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

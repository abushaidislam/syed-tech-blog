import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { siteConfig } from "@/config/site";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getBlogPostsByCategory,
} from "@/lib/blog";
import {
  LOCALES,
  type Locale,
  isSupportedLocale,
  DEFAULT_LOCALE,
} from "@/config/i18n";

export function generateStaticParams() {
  return BLOG_CATEGORIES.flatMap((cat) =>
    LOCALES.map((locale) => ({
      locale,
      category: cat.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, category: categorySlug } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const isBn = locale === "bn";
  const title = isBn
    ? `${category.name} ক্যাটাগরি | ${siteConfig.name}`
    : `${category.name} Category | ${siteConfig.name}`;
  const description =
    category.description ||
    `Articles and engineering insights in ${category.name} from Syed Blog.`;
  const canonicalUrl = `${siteConfig.url}/${locale}/blog/category/${category.slug}`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${siteConfig.url}/en/blog/category/${category.slug}`,
        "bn-BD": `${siteConfig.url}/bn/blog/category/${category.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: new URL(siteConfig.ogImage, siteConfig.url).toString(),
          width: 1200,
          height: 630,
          alt: `${category.name} - ${siteConfig.name}`,
        },
      ],
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL(siteConfig.ogImage, siteConfig.url).toString()],
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: rawLocale, category: categorySlug } = await params;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getBlogPostsByCategory(categorySlug, locale);
  const categoryUrl = `${siteConfig.url}/${locale}/blog/category/${category.slug}`;

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/${locale}` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/${locale}/blog` },
              { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl },
            ],
          }),
        }}
      />
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

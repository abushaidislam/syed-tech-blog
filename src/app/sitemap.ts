import type { MetadataRoute } from "next";
import { getAllBlogPostSlugs, getBlogPostBySlug } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/config/blog-categories";
import { siteConfig } from "@/config/site";
import { LOCALES } from "@/config/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllBlogPostSlugs();
  const latestDate = new Date();

  // Generate blog post routes with language alternate URLs (including x-default)
  const blogPostRoutes: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const localizedPosts = LOCALES.flatMap((locale) => {
      const post = getBlogPostBySlug(slug, locale);
      return post && !post.isFallback ? [{ locale, post }] : [];
    });
    const postEn = localizedPosts.find(({ locale }) => locale === "en")?.post;
    const lastMod = postEn
      ? new Date(postEn.frontmatter.updatedAt || postEn.frontmatter.dateIso)
      : latestDate;
    const availableLanguages = {
      ...Object.fromEntries(
        localizedPosts.map(({ locale }) => [locale, `${siteConfig.url}/${locale}/blog/${slug}`]),
      ),
      "x-default": `${siteConfig.url}/en/blog/${slug}`,
    };

    return localizedPosts.map(({ locale }) => ({
      url: `${siteConfig.url}/${locale}/blog/${slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: availableLanguages,
      },
    }));
  });

  // Generate category routes with standardized hreflang codes
  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.flatMap((cat) =>
    LOCALES.map((locale) => ({
      url: `${siteConfig.url}/${locale}/blog/category/${cat.slug}`,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en/blog/category/${cat.slug}`,
          bn: `${siteConfig.url}/bn/blog/category/${cat.slug}`,
          "x-default": `${siteConfig.url}/en/blog/category/${cat.slug}`,
        },
      },
    })),
  );

  // Exclude 307-redirecting root URL (/) so all sitemap entries return 200 OK directly
  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      lastModified: latestDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en`,
          bn: `${siteConfig.url}/bn`,
          "x-default": `${siteConfig.url}/en`,
        },
      },
    },
    {
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: latestDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en/blog`,
          bn: `${siteConfig.url}/bn/blog`,
          "x-default": `${siteConfig.url}/en/blog`,
        },
      },
    },
  ]);

  return [...staticRoutes, ...categoryRoutes, ...blogPostRoutes];
}

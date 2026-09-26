import type { MetadataRoute } from "next";
import { getAllBlogPostSlugs, getBlogPostBySlug } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/config/blog-categories";
import { siteConfig } from "@/config/site";
import { LOCALES } from "@/config/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllBlogPostSlugs();
  const latestDate = new Date();

  const blogPostRoutes: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const localizedPosts = LOCALES.flatMap((locale) => {
      const post = getBlogPostBySlug(slug, locale);
      return post && !post.isFallback ? [{ locale, post }] : [];
    });
    const postEn = localizedPosts.find(({ locale }) => locale === "en")?.post;
    const lastMod = postEn
      ? new Date(postEn.frontmatter.updatedAt || postEn.frontmatter.dateIso)
      : latestDate;
    const languageEntries = localizedPosts.map(({ locale }) => [locale, `${siteConfig.url}/${locale}/blog/${slug}`]);
    const availableLanguages = Object.fromEntries([
      ...languageEntries,
      ["x-default", `${siteConfig.url}/en/blog/${slug}`],
    ]);

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

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en`,
          bn: `${siteConfig.url}/bn`,
          "x-default": `${siteConfig.url}/en`,
        },
      },
    },
    ...LOCALES.flatMap((locale) => [
      {
        url: `${siteConfig.url}/${locale}`,
        lastModified: latestDate,
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${siteConfig.url}/${locale}/blog`,
        lastModified: latestDate,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ]),
  ];

  return [...staticRoutes, ...categoryRoutes, ...blogPostRoutes];
}

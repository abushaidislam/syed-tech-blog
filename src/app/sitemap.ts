import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/config/blog-categories";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const latestPostDate =
    posts.length > 0
      ? new Date(posts[0].updatedAt || posts[0].dateIso)
      : new Date();

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.dateIso),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((cat) => {
    const catPosts = posts.filter((p) => p.category.slug === cat.slug);
    const catLastMod =
      catPosts.length > 0
        ? new Date(catPosts[0].updatedAt || catPosts[0].dateIso)
        : latestPostDate;

    return {
      url: `${siteConfig.url}/blog/category/${cat.slug}`,
      lastModified: catLastMod,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...categoryRoutes, ...blogPostRoutes];
}

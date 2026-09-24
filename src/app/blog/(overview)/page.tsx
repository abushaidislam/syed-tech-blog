import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { getAllBlogPosts } from "@/lib/blog";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: "Syed Blog | Insights, Engineering & Technology",
  },
  description:
    "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.",
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: "Syed Blog | Insights, Engineering & Technology",
    description:
      "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: new URL(siteConfig.ogImage, siteConfig.url).toString(),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Blog | Insights, Engineering & Technology",
    description:
      "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.",
    images: [new URL(siteConfig.ogImage, siteConfig.url).toString()],
  },
};

export default function BlogOverviewPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-white">
      <BlogHeader
        title="Syed Blog"
        description="Latest news, architecture, and engineering updates from Syed Blog"
        activeCategory="overview"
      />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

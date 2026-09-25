import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { getAllBlogPosts } from "@/lib/blog";

import { siteConfig } from "@/config/site";

const absoluteOgImage = new URL(siteConfig.ogImage, siteConfig.url).toString();

export const metadata: Metadata = {
  title: {
    absolute: "Syed Blog | High-Scale Software Engineering & Architecture",
  },
  description: siteConfig.description,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    title: "Syed Blog | High-Scale Software Engineering & Architecture",
    description: siteConfig.description,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteOgImage,
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
    title: "Syed Blog | High-Scale Software Engineering & Architecture",
    description: siteConfig.description,
    images: [absoluteOgImage],
  },
};

export default function BlogOverviewPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
            ],
          }),
        }}
      />
      <BlogHeader
        title="Syed Blog"
        description="Explore expert software engineering insights, high-scale system architecture, and modern web development tutorials by Syed."
        activeCategory="overview"
      />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

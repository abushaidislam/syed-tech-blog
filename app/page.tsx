import type { Metadata } from "next";
import { BlogHeader } from "@/ui/blog/blog-header";
import { BlogGrid } from "@/ui/blog/blog-grid";
import { BlogBottomCTA } from "@/ui/blog/blog-bottom-cta";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Syed Blog | Insights, Engineering & Technology",
  description:
    "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.",
};

export default function HomePage() {
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

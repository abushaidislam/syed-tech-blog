import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAllBlogPostSlugs,
  getBlogPostBySlug,
  getRelatedPosts,
  frontmatterToBlogPostMeta,
} from "@/lib/blog";
import { PostLayout } from "@/components/blog/post-layout";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  return getAllBlogPostSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postMdx = getBlogPostBySlug(slug);

  if (!postMdx) {
    return {
      title: "Post Not Found | Syed Blog",
    };
  }

  const post = frontmatterToBlogPostMeta(postMdx.frontmatter);

  return {
    title: `${post.title} | Syed Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postMdx = getBlogPostBySlug(slug);

  if (!postMdx) {
    notFound();
  }

  const post = {
    ...frontmatterToBlogPostMeta(postMdx.frontmatter),
    headings: postMdx.headings,
  };

  const relatedPosts = getRelatedPosts(slug, 4);

  const { content: mdxContent } = await compileMDX({
    source: postMdx.content,
    components: blogMdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <PostLayout post={post} relatedPosts={relatedPosts} mdxContent={mdxContent} />
    </main>
  );
}

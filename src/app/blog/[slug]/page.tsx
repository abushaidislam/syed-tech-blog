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
import { siteConfig } from "@/config/site";
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
  const ogImageUrl = post.image || `/blog/${post.slug}/opengraph-image`;

  return {
    title: `${post.title} | Syed Blog`,
    description: post.summary,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
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
  const postUrl = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
  const imageUrl = post.image
    ? new URL(post.image, siteConfig.url).toString()
    : undefined;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.summary,
              url: postUrl,
              datePublished: post.dateIso,
              dateModified: post.dateIso,
              ...(imageUrl ? { image: [imageUrl] } : {}),
              author: post.authors.map((author) => ({
                "@type": "Person",
                name: author.name,
                ...(author.image
                  ? { image: new URL(author.image, siteConfig.url).toString() }
                  : {}),
              })),
              publisher: {
                "@type": "Person",
                name: siteConfig.author.name,
                url: siteConfig.url,
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": postUrl,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
              ],
            },
          ]),
        }}
      />
      <PostLayout
        post={post}
        relatedPosts={relatedPosts}
        mdxContent={mdxContent}
        postUrl={postUrl}
      />
    </main>
  );
}

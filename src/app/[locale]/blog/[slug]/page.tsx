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
import {
  LOCALES,
  type Locale,
  isSupportedLocale,
  DEFAULT_LOCALE,
} from "@/config/i18n";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function generateStaticParams() {
  const slugs = getAllBlogPostSlugs();
  return LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

function truncateDescription(text: string, maxLength = 155): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  const truncated = cleaned.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const postMdx = getBlogPostBySlug(slug, locale);

  if (!postMdx) {
    return {
      title: "Post Not Found",
    };
  }

  const post = frontmatterToBlogPostMeta(postMdx.frontmatter, locale);
  const relativeOgUrl = post.image || `/${locale}/blog/${post.slug}/opengraph-image`;
  const absoluteOgUrl = new URL(relativeOgUrl, siteConfig.url).toString();
  const canonicalUrl = `${siteConfig.url}/${locale}/blog/${post.slug}`;
  const truncatedSummary = truncateDescription(post.summary);
  const keywords = Array.from(
    new Set([post.category.name, ...(post.keywords || []), ...(post.tags || [])]),
  );

  return {
    title: post.title,
    description: truncatedSummary,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${siteConfig.url}/en/blog/${post.slug}`,
        "bn-BD": `${siteConfig.url}/bn/blog/${post.slug}`,
        "x-default": `${siteConfig.url}/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: truncatedSummary,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteOgUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: locale === "bn" ? "bn_BD" : "en_US",
      type: "article",
      publishedTime: post.dateIso,
      modifiedTime: post.updatedAt || post.dateIso,
      authors: post.authors.map((a) => a.name),
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: truncatedSummary,
      images: [absoluteOgUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const postMdx = getBlogPostBySlug(slug, locale);

  if (!postMdx) {
    notFound();
  }

  const post = {
    ...frontmatterToBlogPostMeta(postMdx.frontmatter, locale),
    headings: postMdx.headings,
    isFallback: postMdx.isFallback,
    locale: postMdx.locale,
  };

  const relatedPosts = getRelatedPosts(slug, 4, locale);
  const postUrl = new URL(`/${locale}/blog/${post.slug}`, siteConfig.url).toString();
  const relativeOgUrl = post.image || `/${locale}/blog/${post.slug}/opengraph-image`;
  const absoluteOgUrl = new URL(relativeOgUrl, siteConfig.url).toString();
  const imageUrl = post.image
    ? new URL(post.image, siteConfig.url).toString()
    : undefined;

  const wordCount = postMdx.content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const { content: mdxContent } = await compileMDX({
    source: postMdx.content,
    components: blogMdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
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
              "@type": "BlogPosting",
              "@id": `${postUrl}#article`,
              headline: post.title,
              description: post.summary,
              url: postUrl,
              inLanguage: locale === "bn" ? "bn-BD" : "en-US",
              articleSection: post.category.name,
              keywords: [post.category.name, ...(post.keywords || []), ...(post.tags || [])].join(", "),
              wordCount,
              timeRequired: `PT${readingTimeMinutes}M`,
              datePublished: post.dateIso,
              dateModified: post.updatedAt || post.dateIso,
              image: [imageUrl || absoluteOgUrl],
              author: post.authors.map((author) => ({
                "@type": "Person",
                name: author.name,
                ...(author.image
                  ? { image: new URL(author.image, siteConfig.url).toString() }
                  : {}),
              })),
              publisher: {
                "@type": "Organization",
                "@id": `${siteConfig.url}/#organization`,
                name: siteConfig.name,
                url: siteConfig.url,
                logo: {
                  "@type": "ImageObject",
                  url: new URL(siteConfig.author.image, siteConfig.url).toString(),
                },
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
                { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/${locale}` },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/${locale}/blog` },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.category.name,
                  item: `${siteConfig.url}/${locale}/blog/category/${post.category.slug}`,
                },
                { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import {
  LOCALES,
  type Locale,
  isSupportedLocale,
  DEFAULT_LOCALE,
} from "@/config/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const isBn = locale === "bn";
  const title = isBn
    ? "সকল প্রবন্ধ ও গাইড | সাঈদ ব্লগ"
    : "All Software Engineering Articles & Architecture Guides | Syed Blog";
  const description = isBn
    ? "সাঈদ ব্লগের সমস্ত টেকনিক্যাল নিবন্ধ, ক্লাউড আর্কিটেকচার গাইড, ওয়েব ডেভেলপমেন্ট ও সিস্টেম ডিজাইন টিউটোরিয়াল ব্রাউজ করুন।"
    : "Browse all technical articles, high-scale architecture guides, Next.js tutorials, and software engineering insights on Syed Blog.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        "en-US": `${siteConfig.url}/en/blog`,
        "bn-BD": `${siteConfig.url}/bn/blog`,
        "x-default": `${siteConfig.url}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/blog`,
      siteName: siteConfig.name,
      images: [
        {
          url: new URL(siteConfig.ogImage, siteConfig.url).toString(),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
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

export default async function BlogOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const posts = getAllBlogPosts(locale);

  const isBn = locale === "bn";
  const title = isBn
    ? "সকল প্রবন্ধ ও গাইড | সাঈদ ব্লগ"
    : "All Software Engineering Articles & Architecture Guides | Syed Blog";
  const description = isBn
    ? "সাঈদ ব্লগের সমস্ত টেকনিক্যাল নিবন্ধ, ক্লাউড আর্কিটেকচার গাইড, ওয়েব ডেভেলপমেন্ট ও সিস্টেম ডিজাইন টিউটোরিয়াল ব্রাউজ করুন।"
    : "Browse all technical articles, high-scale architecture guides, Next.js tutorials, and software engineering insights on Syed Blog.";

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/${locale}` },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/${locale}/blog` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "@id": `${siteConfig.url}/${locale}/blog#webpage`,
              url: `${siteConfig.url}/${locale}/blog`,
              name: title,
              description,
              inLanguage: isBn ? "bn-BD" : "en-US",
              isPartOf: {
                "@type": "WebSite",
                "@id": `${siteConfig.url}/#website`,
              },
            },
          ]),
        }}
      />
      <BlogHeader activeCategory="overview" />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

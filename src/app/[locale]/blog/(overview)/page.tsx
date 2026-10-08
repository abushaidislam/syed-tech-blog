import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { PageTransition } from "@/components/layout/page-transition";
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
    ? "সকল সফটওয়্যার ইঞ্জিনিয়ারিং ও টেক নিবন্ধ | সাঈদ ব্লগ"
    : "Software Engineering & Tech Articles | Syed Blog";
  const description = isBn
    ? "সাঈদ ব্লগের সকল সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড আর্কিটেকচার, ডিস্ট্রিবিউটেড সিস্টেম এবং প্রোগ্রামিং টিউটোরিয়াল ও গাইড একসাথে দেখুন।"
    : "Explore in-depth software engineering articles, system design guides, cloud architecture patterns, and Next.js developer tutorials on Syed Blog.";

  return {
    title: {
      absolute: title,
    },
    description,
    // ISO language alternates aligned with sitemap.xml definitions
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        en: `${siteConfig.url}/en/blog`,
        bn: `${siteConfig.url}/bn/blog`,
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

  return (
    <PageTransition>
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${siteConfig.url}/${locale}/blog#blog`,
                name: locale === "bn" ? "সাঈদ ব্লগ" : "Syed Blog",
                description: locale === "bn"
                  ? "সাঈদ ব্লগের সকল সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড আর্কিটেকচার, ডিস্ট্রিবিউটেড সিস্টেম এবং প্রোগ্রামিং টিউটোরিয়াল দেখুন।"
                  : "Browse all technical articles, engineering deep dives, system design guides, and developer tutorials on Syed Blog.",
                url: `${siteConfig.url}/${locale}/blog`,
                publisher: {
                  "@type": "Organization",
                  name: siteConfig.name,
                  url: siteConfig.url,
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: locale === "bn" ? "হোম" : "Home",
                    item: `${siteConfig.url}/${locale}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: locale === "bn" ? "ব্লগ" : "Blog",
                    item: `${siteConfig.url}/${locale}/blog`,
                  },
                ],
              },
            ]),
          }}
        />
        <BlogHeader activeCategory="overview" />
        <BlogGrid posts={posts} />
        <BlogBottomCTA />
      </main>
    </PageTransition>
  );
}

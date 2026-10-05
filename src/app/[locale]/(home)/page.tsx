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
    ? "সাঈদ ব্লগ — সফটওয়্যার আর্কিটেকচার ও টেক টিউটোরিয়াল"
    : "Syed Blog — Engineering Insights & System Architecture";
  const description = isBn
    ? "সাঈদ ব্লগে সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড আর্কিটেকচার, নেক্সট-জেএস এবং ওয়েব ডেভেলপমেন্ট নিয়ে সেরা টেক নিবন্ধ ও গাইড দেখুন।"
    : "Explore expert engineering insights, high-scale system architecture patterns, Next.js tutorials, and modern web development practices on Syed Blog.";

  return {
    title: {
      absolute: title,
    },
    description,
    // ISO language alternates aligned with sitemap.xml definitions
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        bn: `${siteConfig.url}/bn`,
        "x-default": `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}`,
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

export default async function HomePage({
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
        <BlogHeader activeCategory="overview" />
        <BlogGrid posts={posts} />
        <BlogBottomCTA />
      </main>
    </PageTransition>
  );
}

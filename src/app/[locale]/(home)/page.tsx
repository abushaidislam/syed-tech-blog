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
    ? "সাঈদ ব্লগ | প্রযুক্তি, সিস্টেম আর্কিটেকচার ও ইঞ্জিনিয়ারিং অন্তর্দৃষ্টি"
    : "Syed Blog | Insights, Engineering & Technology";
  const description = isBn
    ? "সাঈদ ব্লগের সাম্প্রতিক সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড আর্কিটেকচার এবং টেক আপডেটের সাথে যুক্ত থাকুন।"
    : "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        "en-US": `${siteConfig.url}/en`,
        "bn-BD": `${siteConfig.url}/bn`,
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

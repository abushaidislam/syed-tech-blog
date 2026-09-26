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
    ? "সকল প্রবন্ধ | সাঈদ ব্লগ"
    : "All Articles | Syed Blog";
  const description = isBn
    ? "সাঈদ ব্লগের সাম্প্রতিক সফটওয়্যার ইঞ্জিনিয়ারিং, ক্লাউড আর্কিটেকচার এবং টেক আপডেটের সমস্ত নিবন্ধ।"
    : "Stay informed with the latest updates, engineering insights, and tech articles from Syed Blog.";

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
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/${locale}` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/${locale}/blog` },
            ],
          }),
        }}
      />
      <BlogHeader activeCategory="overview" />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

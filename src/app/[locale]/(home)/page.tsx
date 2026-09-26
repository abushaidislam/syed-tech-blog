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
    ? "সাঈদ ব্লগ | সফটওয়্যার ইঞ্জিনিয়ারিং, সিস্টেম আর্কিটেকচার ও ক্লাউড টিউটোরিয়াল"
    : "Syed Blog | High-Scale Software Engineering & Architecture";
  const description = isBn
    ? "সাঈদ ব্লগের ইন-ডেপথ সফটওয়্যার ইঞ্জিনিয়ারিং গাইড, ক্লাউড আর্কিটেকচার বিশ্লেষণ এবং নেক্সট.জেএস টিউটোরিয়াল থেকে শিখুন।"
    : "Explore in-depth software engineering tutorials, high-scale system architecture insights, Next.js guides, and developer tools curated by Syed.";

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

  const isBn = locale === "bn";
  const title = isBn
    ? "সাঈদ ব্লগ | সফটওয়্যার ইঞ্জিনিয়ারিং, সিস্টেম আর্কিটেকচার ও ক্লাউড টিউটোরিয়াল"
    : "Syed Blog | High-Scale Software Engineering & Architecture";
  const description = isBn
    ? "সাঈদ ব্লগের ইন-ডেপথ সফটওয়্যার ইঞ্জিনিয়ারিং গাইড, ক্লাউড আর্কিটেকচার বিশ্লেষণ এবং নেক্সট.জেএস টিউটোরিয়াল থেকে শিখুন।"
    : "Explore in-depth software engineering tutorials, high-scale system architecture insights, Next.js guides, and developer tools curated by Syed.";

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/${locale}#webpage`,
            url: `${siteConfig.url}/${locale}`,
            name: title,
            description,
            inLanguage: isBn ? "bn-BD" : "en-US",
            isPartOf: {
              "@type": "WebSite",
              "@id": `${siteConfig.url}/#website`,
            },
          }),
        }}
      />
      <BlogHeader activeCategory="overview" />
      <BlogGrid posts={posts} />
      <BlogBottomCTA />
    </main>
  );
}

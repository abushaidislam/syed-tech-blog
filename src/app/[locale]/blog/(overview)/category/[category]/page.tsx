import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
import { PageTransition } from "@/components/layout/page-transition";
import { siteConfig } from "@/config/site";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getBlogPostsByCategory,
} from "@/lib/blog";
import {
  LOCALES,
  type Locale,
  isSupportedLocale,
  DEFAULT_LOCALE,
} from "@/config/i18n";

export function generateStaticParams() {
  return BLOG_CATEGORIES.flatMap((cat) =>
    LOCALES.map((locale) => ({
      locale,
      category: cat.slug,
    })),
  );
}

const CATEGORY_BN_NAMES: Record<string, string> = {
  company: "কোম্পানি",
  education: "শিক্ষা",
  engineering: "ইঞ্জিনিয়ারিং",
  customers: "গ্রাহকদের গল্প",
};

const CATEGORY_BN_DESCS: Record<string, string> = {
  company: "সাঈদ ব্লগ টিমের নতুন মাইলফলক, প্রোডাক্ট রিলিজ, অ্যানাউন্সমেন্ট এবং প্রাতিষ্ঠানিক আপডেট সংকলন।",
  education: "আপনার ডেভেলপমেন্ট দক্ষতা বৃদ্ধি করতে ইন-ডেপথ গাইড, নেক্সট-জেএস টিউটোরিয়াল এবং প্রযুক্তিগত জ্ঞান।",
  engineering: "হাই-স্কেল সফটওয়্যার আর্কিটেকচার, ডিস্ট্রিবিউটেড সিস্টেম, পারফরম্যান্স টিউনিং এবং ইঞ্জিনিয়ারিং পোস্ট।",
  customers: "কীভাবে বিভিন্ন স্টার্টআপ এবং এন্টারপ্রাইজ টিম সাঈদ ব্লগের আর্কিটেকচার দিয়ে সার্ভিস স্কেল করছে।",
};

const CATEGORY_EN_TITLES: Record<string, string> = {
  company: "Company News, Product Updates & Milestones | Syed Blog",
  education: "Software Engineering Guides & Tutorials | Syed Blog",
  engineering: "System Architecture & Software Engineering | Syed Blog",
  customers: "Customer Success Stories & Engineering Insights | Syed Blog",
};

const CATEGORY_BN_TITLES: Record<string, string> = {
  company: "কোম্পানির আপডেট, নিউজ ও মাইলফলক | সাঈদ ব্লগ",
  education: "সফটওয়্যার ইঞ্জিনিয়ারিং গাইড ও টিউটোরিয়াল | সাঈদ ব্লগ",
  engineering: "সিস্টেম আর্কিটেকচার ও ইঞ্জিনিয়ারিং গাইড | সাঈদ ব্লগ",
  customers: "গ্রাহকদের কেস স্টাডি ও কাস্টমার স্টোরিজ | সাঈদ ব্লগ",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, category: categorySlug } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const isBn = locale === "bn";
  const displayName = isBn ? (CATEGORY_BN_NAMES[categorySlug] || category.name) : category.name;
  const displayDesc = isBn
    ? (CATEGORY_BN_DESCS[categorySlug] || category.description)
    : (category.description && category.description.length >= 120
        ? category.description
        : `Explore comprehensive software engineering tutorials, system design guides, and developer insights in the ${category.name} category on Syed Blog.`);

  const title = isBn
    ? (CATEGORY_BN_TITLES[categorySlug] || `${displayName} ক্যাটাগরি | সাঈদ ব্লগ`)
    : (CATEGORY_EN_TITLES[categorySlug] || `${category.name} Category | ${siteConfig.name}`);
  const canonicalUrl = `${siteConfig.url}/${locale}/blog/category/${category.slug}`;

  return {
    title: title,
    description: displayDesc,
    // ISO language alternates aligned with sitemap.xml definitions
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en/blog/category/${category.slug}`,
        bn: `${siteConfig.url}/bn/blog/category/${category.slug}`,
        "x-default": `${siteConfig.url}/en/blog/category/${category.slug}`,
      },
    },
    openGraph: {
      title,
      description: displayDesc,
      url: canonicalUrl,
      siteName: isBn ? "সাঈদ ব্লগ" : siteConfig.name,
      images: [
        {
          url: new URL(siteConfig.ogImage, siteConfig.url).toString(),
          width: 1200,
          height: 630,
          alt: `${displayName} - ${isBn ? "সাঈদ ব্লগ" : siteConfig.name}`,
        },
      ],
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: displayDesc,
      images: [new URL(siteConfig.ogImage, siteConfig.url).toString()],
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: rawLocale, category: categorySlug } = await params;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const isBn = locale === "bn";
  const displayName = isBn ? (CATEGORY_BN_NAMES[categorySlug] || category.name) : category.name;
  const displayDesc = isBn ? (CATEGORY_BN_DESCS[categorySlug] || category.description) : category.description;

  const posts = getBlogPostsByCategory(categorySlug, locale);
  const categoryUrl = `${siteConfig.url}/${locale}/blog/category/${category.slug}`;

  return (
    <PageTransition>
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `${categoryUrl}#category`,
                name: displayName,
                description: displayDesc,
                url: categoryUrl,
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
                  { "@type": "ListItem", position: 3, name: displayName, item: categoryUrl },
                ],
              },
            ]),
          }}
        />
        <BlogHeader
          title={displayName}
          description={displayDesc}
          activeCategory={category.slug}
        />
        <BlogGrid posts={posts} />
        <BlogBottomCTA />
      </main>
    </PageTransition>
  );
}

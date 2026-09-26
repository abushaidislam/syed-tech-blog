import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogBottomCTA } from "@/components/blog/blog-bottom-cta";
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
  company: "সাঈদ ব্লগ টিমের মাইলফলক, প্রোডাক্ট রিলিজ এবং আপডেট।",
  education: "আপনার ডিজিটাল দক্ষতা বৃদ্ধির জন্য গাইড, টিউটোরিয়াল এবং প্রযুক্তিগত অন্তর্দৃষ্টি।",
  engineering: "হাই-স্কেল সফটওয়্যার সিস্টেম, সিস্টেম আর্কিটেকচার এবং ডেভেলপার টুলস নিয়ে বিশ্লেষণ।",
  customers: "কীভাবে বিভিন্ন স্টার্টআপ এবং এন্টারপ্রাইজ সাঈদ ব্লগের সাথে তৈরি ও স্কেল করছে।",
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
    : (category.description || `Articles and engineering insights in ${category.name} from Syed Blog.`);

  const title = isBn
    ? `${displayName} ক্যাটাগরি | সাঈদ ব্লগ`
    : `${category.name} Category | ${siteConfig.name}`;
  const canonicalUrl = `${siteConfig.url}/${locale}/blog/category/${category.slug}`;

  return {
    title: displayName,
    description: displayDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${siteConfig.url}/en/blog/category/${category.slug}`,
        "bn-BD": `${siteConfig.url}/bn/blog/category/${category.slug}`,
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
              { "@type": "ListItem", position: 3, name: displayName, item: categoryUrl },
            ],
          }),
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
  );
}

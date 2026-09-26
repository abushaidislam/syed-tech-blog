import type { BlogAuthor } from "@/types/blog";
import { type Locale, DEFAULT_LOCALE } from "@/config/i18n";
import { getDictionary } from "@/lib/dictionary";

export interface AuthorProfile extends BlogAuthor {
  quote: string;
  company?: string;
  storyUrl?: string;
  bio?: string;
}

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  syed: {
    name: "Syed Farhan",
    image: "/images/author-avatar.png",
    title: "Lead Architect & Founder",
    company: "Syed Blog",
    quote:
      "Great work rarely happens by accident. When teams have the right environment, modern tools, and **architectural freedom**, they build **resilient systems** that empower human potential.",
    storyUrl: "/blog",
  },
  "syed farhan": {
    name: "Syed Farhan",
    image: "/images/author-avatar.png",
    title: "Lead Architect & Founder",
    company: "Syed Blog",
    quote:
      "Great work rarely happens by accident. When teams have the right environment, modern tools, and **architectural freedom**, they build **resilient systems** that empower human potential.",
    storyUrl: "/blog",
  },
  "steven tey": {
    name: "Steven Tey",
    image: "https://assets.dub.co/author/steventey.jpg",
    title: "Founder & CEO, Dub",
    company: "Dub",
    quote:
      "Dub is the **ultimate partner infrastructure** for every startup. If you're looking to 10x your community / product-led growth – I cannot recommend building a **partner program** with Dub enough.",
    storyUrl: "https://dub.co",
    twitter: "https://twitter.com/steventey",
  },
  "anzhelika tey": {
    name: "Anzhelika Tey",
    image: "https://assets.dub.co/about/team/anzhelika.jpg",
    title: "Head of Infrastructure, RenderX",
    company: "RenderX",
    quote:
      "Resilient edge architecture isn't just about raw speed — it's about **predictable consistency**, fault tolerance, and **zero-downtime reliability** at global scale.",
    storyUrl: "/blog/category/engineering",
  },
  "koen bok": {
    name: "Koen Bok",
    image: "https://assets.dub.co/about/team/koen.jpg",
    title: "CEO, Framer",
    company: "Framer",
    quote:
      "Dub is the **ultimate partner infrastructure** for every startup. If you're looking to 10x your community / product-led growth – I cannot recommend building a **partner program** with Dub enough.",
    storyUrl: "https://framer.com",
  },
};

/**
 * Resolves full author details by merging frontmatter author data
 * with predefined profiles or graceful dynamic fallbacks and localized content.
 */
export function resolveAuthorDetails(
  author?: BlogAuthor,
  locale: Locale = DEFAULT_LOCALE,
): AuthorProfile {
  const normalizedName = (author?.name || "syed").trim().toLowerCase();
  const matched =
    AUTHOR_PROFILES[normalizedName] ||
    Object.entries(AUTHOR_PROFILES).find(([key]) =>
      normalizedName.includes(key) || key.includes(normalizedName),
    )?.[1] ||
    AUTHOR_PROFILES.syed;

  const dict = getDictionary(locale);
  const authorDict = dict.author;
  const profiles = (authorDict?.profiles || {}) as Record<
    string,
    { name?: string; title?: string; quote?: string }
  >;
  const localizedMatched =
    profiles[normalizedName] ||
    Object.entries(profiles).find(([key]) =>
      normalizedName.includes(key) || key.includes(normalizedName),
    )?.[1];

  const localizedQuote = localizedMatched?.quote || matched?.quote || authorDict?.defaultQuote;

  const defaultQuote =
    (locale === "bn" ? localizedQuote : author?.quote) ||
    author?.quote ||
    localizedQuote ||
    `Empowering modern engineering teams with high-scale architecture, thoughtful systems design, and actionable technical deep dives.`;

  const localizedName =
    (locale === "bn" ? localizedMatched?.name : author?.name) ||
    author?.name ||
    localizedMatched?.name ||
    matched?.name ||
    "Syed Farhan";

  const localizedTitle =
    (locale === "bn" ? localizedMatched?.title : author?.title) ||
    author?.title ||
    localizedMatched?.title ||
    matched?.title ||
    authorDict?.defaultTitle ||
    "Engineering & Architecture";

  return {
    name: localizedName,
    image: author?.image || matched?.image || "/images/author-avatar.png",
    title: localizedTitle,
    company: author?.company || matched?.company || "Syed Blog",
    quote: defaultQuote,
    storyUrl: author?.storyUrl || matched?.storyUrl || "/blog",
    bio: author?.bio || matched?.bio,
    twitter: author?.twitter || matched?.twitter,
    github: author?.github || matched?.github,
    linkedin: author?.linkedin || matched?.linkedin,
  };
}

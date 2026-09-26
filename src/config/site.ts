export const siteConfig = {
  name: "Syed Blog",
  defaultTitle: "Syed Blog | High-Scale Engineering & Architecture Insights",
  description:
    "Explore in-depth software engineering tutorials, high-scale system architecture insights, Next.js guides, and developer tools curated by Syed.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.flinkeo.online",
  ogImage: "/images/blog/default-cover.jpg",
  author: {
    name: "Syed",
    image: "/images/author-avatar.png",
    title: "Engineering & Architecture",
  },
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
};

export type SiteConfig = typeof siteConfig;

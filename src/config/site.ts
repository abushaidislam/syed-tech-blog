export const siteConfig = {
  name: "Syed Blog",
  // Meta description optimized for SERP snippet length (140-155 characters) and organic CTR
  description:
    "Discover expert software engineering insights, high-scale system architecture patterns, Next.js tutorials, and modern web development guides on Syed Blog.",
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

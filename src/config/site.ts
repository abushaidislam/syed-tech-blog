export const siteConfig = {
  name: "Syed Blog",
  description:
    "Explore expert software engineering insights, high-scale system architecture, and modern web development tutorials by Syed. Read scalable tech guides today.",
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

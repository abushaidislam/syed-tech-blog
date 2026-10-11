import type { BlogCategory } from "@/types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "company",
    name: "Company News",
    description:
      "Explore the latest company news, major product releases, team milestones, and engineering platform updates on Syed Blog.",
  },
  {
    slug: "education",
    name: "Education",
    description:
      "Discover practical web development guides, Next.js tutorials, software design patterns, and technical education on Syed Blog.",
  },
  {
    slug: "engineering",
    name: "Engineering",
    description:
      "Explore in-depth software engineering analyses, distributed system architecture, performance optimization, and modern developer tools.",
  },
  {
    slug: "customers",
    name: "Customer Stories",
    description:
      "Read real-world case studies and customer stories showing how engineering teams build and scale high-performance systems.",
  },
];

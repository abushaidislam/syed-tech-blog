import type { BlogCategory } from "@/types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "company",
    name: "Company News",
    description:
      "Official company news, product releases, engineering milestones, and platform updates from the Syed Blog team.",
  },
  {
    slug: "education",
    name: "Education",
    description:
      "Comprehensive software development guides, Next.js tutorials, and engineering best practices to scale your digital applications.",
  },
  {
    slug: "engineering",
    name: "Engineering",
    description:
      "Technical deep dives into high-scale distributed systems, web architecture, cloud infrastructure, and modern developer tooling.",
  },
  {
    slug: "customers",
    name: "Customer Stories",
    description:
      "Real-world case studies demonstrating how innovative tech startups and enterprises scale high-traffic platforms with Syed Blog.",
  },
];

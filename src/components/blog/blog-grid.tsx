"use client";

import { motion, type Variants } from "motion/react";
import type { BlogPostMeta } from "@/types/blog";
import { BlogCard } from "./blog-card";

interface BlogGridProps {
  posts: BlogPostMeta[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="grid-section relative overflow-clip border-y border-grid-border px-4 py-20 text-center">
        <p className="text-neutral-500">No articles found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid-section relative overflow-clip border-y border-grid-border px-4 [.grid-section_~_&]:border-t-0">
      <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border">
        <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t [&>*]:border-grid-border max-md:[&>*]:border-t">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="flex h-full flex-col"
            >
              <BlogCard post={post} priority={index < 3} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

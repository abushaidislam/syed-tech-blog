import Image from "next/image";
import Link from "next/link";
import type { BlogPost, BlogPostMeta } from "@/types/blog";
import { SyedBlogLogo } from "@/components/layout/brand";
import { PostTOC } from "./post-toc";
import { PostSidebarCTA } from "./post-cta";
import { BlogBottomCTA } from "./blog-bottom-cta";
import { SkyAnimation } from "./sky-animation";
import { AuthorSpotlight } from "./author-spotlight";

interface PostLayoutProps {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
  mdxContent?: React.ReactNode;
}

function decodeEntities(text: string) {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

export function PostLayout({ post, relatedPosts, mdxContent }: PostLayoutProps) {
  const primaryAuthor = post.authors[0] || {
    name: "Syed",
    image: "/images/author-avatar.png",
    title: "Engineering & Architecture",
  };

  return (
    <div>
      {/* Top Hero Section */}
      <div className="grid-section relative overflow-clip border-b border-grid-border px-4">
        <div className="relative z-0 mx-auto flex max-w-grid-width flex-col justify-between gap-8 border-x border-grid-border px-4 pb-12 pt-16 sm:px-12 lg:flex-row lg:items-center">
          {/* Subtle grid lines & mask */}
          <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />

          <div className="relative z-10 max-w-screen-sm">
            <div className="flex items-center space-x-4">
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition-all hover:border-neutral-300 hover:bg-white/80"
              >
                {post.category.name}
              </Link>
              <span className="text-sm text-neutral-500">
                Last updated •{" "}
                <time dateTime={post.dateIso}>{post.dateFormatted}</time>
              </span>
            </div>

            <h1 className="mt-5 text-left font-display text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl sm:leading-[1.25]">
              {decodeEntities(post.title)}
            </h1>

            <p className="mt-4 text-left text-base text-neutral-500 sm:text-lg">
              {decodeEntities(post.summary)}
            </p>
          </div>

          {/* Right Side Sky Animation (as marked in reference) */}
          <div className="relative z-0 flex items-center justify-center lg:w-[460px] xl:w-[520px] shrink-0">
            <SkyAnimation />
          </div>
        </div>
      </div>

      {/* Main Content: Article + Right Sidebar */}
      <div className="grid-section relative overflow-clip border-y border-grid-border px-4 [.grid-section_~_&]:border-t-0">
        <div className="relative mx-auto max-w-grid-width border-x border-grid-border">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left 2 columns: Article body */}
            <div className="relative col-span-1 border-grid-border md:col-span-2">
              <div className="bg-white">
                <div className="relative aspect-[1200/630] w-full overflow-hidden bg-neutral-100">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1200}
                      height={630}
                      priority
                      className="aspect-[1200/630] size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200/60 p-12 text-center select-none">
                      <div className="flex size-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white/90 shadow-sm backdrop-blur">
                        <SyedBlogLogo className="size-8 text-neutral-900" />
                      </div>
                      <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        {post.category?.name || "Article"}
                      </span>
                    </div>
                  )}
                </div>

                <article className="prose prose-neutral max-w-none px-5 pt-10 pb-6 transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-display prose-a:font-medium prose-a:text-neutral-600 prose-a:underline-offset-4 hover:prose-a:text-black sm:px-12">
                  {mdxContent ? (
                    mdxContent
                  ) : post.articleHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: post.articleHtml }} />
                  ) : null}
                </article>

                {/* Author Note & Spotlight Component */}
                <AuthorSpotlight author={primaryAuthor} />
              </div>

              {/* Related Posts "Read more" */}
              {relatedPosts.length > 0 && (
                <div className="border-t border-grid-border bg-neutral-50/50 p-6 sm:p-10">
                  <p className="py-2 font-display text-xl font-medium text-neutral-900">
                    Read more
                  </p>
                  <ul className="mt-4 flex flex-col gap-y-6">
                    {relatedPosts.map((related) => (
                      <li key={related.slug}>
                        <Link
                          href={`/blog/${related.slug}`}
                          className="group flex flex-col items-start gap-4 sm:flex-row"
                        >
                          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:w-[200px]">
                            {related.image ? (
                              <Image
                                src={related.image}
                                alt={related.title}
                                width={200}
                                height={112}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                                <SyedBlogLogo className="size-5 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <p className="line-clamp-1 font-display font-medium text-neutral-800 underline-offset-4 group-hover:underline">
                              {related.title}
                            </p>
                            <p className="line-clamp-2 text-sm text-neutral-500">
                              {related.summary}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {related.dateFormatted}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right 1 column: Sidebar */}
            <div className="hidden border-l border-grid-border bg-neutral-50 p-8 sm:block md:p-10">
              {/* Author Profile */}
              <div className="flex flex-col gap-y-3 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Written by
                </p>
                <div className="flex items-center space-x-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-neutral-200">
                    <Image
                      src={primaryAuthor.image}
                      alt={primaryAuthor.name}
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-neutral-800">
                      {primaryAuthor.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {primaryAuthor.title || "Author, Syed Blog"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Sidebar Container (TOC + CTA Card) */}
              <div className="sticky top-20 space-y-6 pt-4">
                {post.headings && post.headings.length > 0 && (
                  <PostTOC headings={post.headings} />
                )}
                <PostSidebarCTA />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Signature Dub Curved Dark Glow Banner */}
      <BlogBottomCTA />
    </div>
  );
}

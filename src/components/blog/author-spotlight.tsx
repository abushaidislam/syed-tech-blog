import Image from "next/image";
import type { BlogAuthor } from "@/types/blog";
import { resolveAuthorDetails } from "@/config/authors";
import { type Locale, DEFAULT_LOCALE } from "@/config/i18n";
import { getDictionary } from "@/lib/dictionary";

interface AuthorSpotlightProps {
  author?: BlogAuthor;
  className?: string;
  locale?: Locale;
}

/**
 * Formats quote text with support for bold emphasis `**text**`
 */
function FormattedQuote({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span>
      &ldquo;
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-neutral-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
      &rdquo;
    </span>
  );
}

/**
 * Author Note & Spotlight Component
 * Direct matching background, no outer box/card/shadows, no company logo or read story button.
 * Sits naturally at the end of every blog post with author's note, prominent avatar, name, and role.
 */
export function AuthorSpotlight({
  author,
  className = "",
  locale = DEFAULT_LOCALE,
}: AuthorSpotlightProps) {
  const profile = resolveAuthorDetails(author, locale);
  const dict = getDictionary(locale);

  return (
    <div
      aria-label={dict.author?.ariaLabel || "Author Note"}
      className={`px-5 pt-6 pb-14 sm:px-12 text-center ${className}`}
    >
      <div className="mx-auto max-w-2xl flex flex-col items-center">
        {/* Large Prominent Author Avatar Image */}
        <div className="relative size-16 sm:size-20 overflow-hidden rounded-full border border-neutral-200/80 shadow-xs bg-neutral-100">
          <Image
            src={profile.image}
            alt={profile.name}
            width={80}
            height={80}
            sizes="(max-width: 640px) 64px, 80px"
            className="size-full object-cover"
          />
        </div>

        {/* Author Name */}
        <h3 className="mt-3.5 font-display text-base sm:text-lg font-semibold text-neutral-900">
          {profile.name}
        </h3>

        {/* Author Title / Role */}
        <p className="mt-0.5 text-xs sm:text-sm text-neutral-500 font-normal">
          {profile.title}
        </p>

        {/* Prominent Author Quote / Note */}
        <blockquote className="mt-6 font-display text-xl sm:text-2xl md:text-[26px] font-normal sm:font-medium leading-relaxed sm:leading-[1.4] tracking-tight text-neutral-800">
          <FormattedQuote text={profile.quote} />
        </blockquote>
      </div>
    </div>
  );
}

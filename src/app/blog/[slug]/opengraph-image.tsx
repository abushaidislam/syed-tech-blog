import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { getBlogPostBySlug, frontmatterToBlogPostMeta } from "@/lib/blog";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = "Article OpenGraph Image";

function decodeHtmlEntities(text: string) {
  if (!text) return "";
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

function getFileBase64(relPath: string): string {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const cleanPath = relPath.replace(/^\//, "");
    const fullPath = path.join(publicDir, cleanPath);

    // Security: Ensure the path stays strictly within the public directory
    if (!fullPath.startsWith(publicDir + path.sep)) return "";

    if (fs.existsSync(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const mime =
        ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".svg"
          ? "image/svg+xml"
          : "image/png";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }
  } catch {
    // fallback
  }
  return "";
}

// Pre-load background data URI
function getBackgroundUri(): string {
  const pngUri = getFileBase64("images/og-background.png");
  if (pngUri) return pngUri;

  const svgPath = path.join(process.cwd(), "public/renderx_background_VECTOR_DOTS_AND_LINES.svg");
  if (fs.existsSync(svgPath)) {
    const content = fs.readFileSync(svgPath, "utf8");
    const tag = "data:image/png;base64,";
    const start = content.indexOf(tag);
    if (start !== -1) {
      let end = content.indexOf('"', start);
      if (end === -1) end = content.indexOf("'", start);
      return content.slice(start, end);
    }
  }
  return "";
}

const bgDataUri = getBackgroundUri();

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postMdx = getBlogPostBySlug(slug);

  const rawPost = postMdx
    ? frontmatterToBlogPostMeta(postMdx.frontmatter)
    : {
        slug,
        title: "Engineering & Architecture Insights",
        summary:
          "Modern software design, system architecture, and technical articles by Syed.",
        category: { slug: "engineering", name: "Engineering" },
        dateFormatted: "Recent",
        authors: [{ name: "Syed Farhan", image: "/images/author-avatar.png" }],
        ogTitle: undefined as string | undefined,
        ogSummary: undefined as string | undefined,
      };

  const title = decodeHtmlEntities(rawPost.ogTitle || rawPost.title);
  const summary = decodeHtmlEntities(rawPost.ogSummary || rawPost.summary);
  const categoryName = rawPost.category?.name || "Article";
  const author = rawPost.authors?.[0] || {
    name: "Syed Farhan",
    image: "/images/author-avatar.png",
  };
  const authorName = author.name || "Syed Farhan";
  const authorImageUri = getFileBase64(author.image || "images/author-avatar.png");
  const dateFormatted = rawPost.dateFormatted || "Recent";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "60px 76px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* 1. Full-bleed background image */}
        {bgDataUri ? (
          <img
            src={bgDataUri}
            alt="Background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* 2. Top Header (Brand + Category) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Brand logo + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg
              viewBox="0 0 36 36"
              style={{ width: 44, height: 44 }}
            >
              <rect width="36" height="36" rx="9" fill="#09090b" />
              <path
                d="M24 12.5C24 10.567 22.433 9 20.5 9H14C12.3431 9 11 10.3431 11 12C11 13.6569 12.3431 15 14 15H21.5C23.433 15 25 16.567 25 18.5C25 20.433 23.433 22 21.5 22H13.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M12 23.5C12 25.433 13.567 27 15.5 27H22C23.6569 27 25 25.6569 25 24"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 25,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#09090b",
                }}
              >
                Syed
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#52525b",
                  backgroundColor: "rgba(0,0,0,0.06)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                Blog
              </span>
            </div>
          </div>

          {/* Category Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#18181b",
              }}
            >
              {categoryName}
            </span>
          </div>
        </div>

        {/* 3. Middle Section: Title + Summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 1060,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#09090b",
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </div>

          {summary ? (
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.45,
                color: "#4b5563",
                fontWeight: 500,
                maxHeight: 70,
                overflow: "hidden",
              }}
            >
              {summary}
            </div>
          ) : null}
        </div>

        {/* 4. Footer Section: Author Photo + Author Info + Domain Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            paddingTop: 24,
          }}
        >
          {/* Author details with actual picture */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {authorImageUri ? (
              <img
                src={authorImageUri}
                alt={authorName}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#09090b",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {authorName.charAt(0) || "S"}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#09090b",
                  letterSpacing: "-0.01em",
                }}
              >
                {authorName}
              </span>
              <span style={{ fontSize: 14, color: "#71717a", fontWeight: 500 }}>
                {`Published • ${dateFormatted}`}
              </span>
            </div>
          </div>

          {/* Domain Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              fontSize: 16,
              color: "#3f3f46",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            blog.flinkeo.online
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

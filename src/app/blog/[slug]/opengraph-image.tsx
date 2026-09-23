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
        title: "Engineering & Architecture Insights",
        summary:
          "Modern software design, system architecture, and tech articles by Syed.",
        category: { name: "Engineering" },
        dateFormatted: "Recent",
        authors: [{ name: "Syed" }],
      };

  const post = {
    ...rawPost,
    title: decodeHtmlEntities(rawPost.title),
    summary: decodeHtmlEntities(rawPost.summary),
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 24px 24px, #27272a 3%, transparent 3%)",
          backgroundSize: "48px 48px",
          padding: "64px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#fafafa",
          position: "relative",
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Top Header: Logo + Category Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#09090b",
                fontSize: 26,
                fontWeight: 900,
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              S
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#f4f4f5",
                }}
              >
                Syed Tech Blog
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: 9999,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#e4e4e7",
              fontSize: 18,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {post.category.name}
          </div>
        </div>

        {/* Middle Section: Article Title & Summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            zIndex: 10,
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              lineHeight: 1.18,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {post.title}
          </div>

          {post.summary && (
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.45,
                color: "#a1a1aa",
                maxHeight: 70,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.summary}
            </div>
          )}
        </div>

        {/* Bottom Bar: Author info & Site URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: 28,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#27272a",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f4f4f5",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {post.authors[0]?.name ? post.authors[0].name.charAt(0) : "S"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#f4f4f5",
                }}
              >
                {post.authors[0]?.name || "Syed"}
              </span>
              <span style={{ fontSize: 15, color: "#71717a" }}>
                Published • {post.dateFormatted}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18,
              color: "#a1a1aa",
              fontWeight: 500,
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

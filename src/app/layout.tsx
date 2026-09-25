import { geistMono, inter, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { BackToTop } from "@/components/layout/back-to-top";
import { AutoScrollReader } from "@/components/layout/auto-scroll-reader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Software Engineering",
    "System Architecture",
    "Web Development",
    "Next.js",
    "Programming Tutorials",
    "High Scale Architecture",
    "Syed Blog",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: "googleb16df7cb15127c88",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        satoshi.variable,
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="font-default text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white min-h-screen flex flex-col justify-between bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteConfig.url}/#website`,
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              publisher: {
                "@type": "Person",
                name: siteConfig.author.name,
                url: siteConfig.url,
                image: new URL(siteConfig.author.image, siteConfig.url).toString(),
              },
            }),
          }}
        />
        <SmoothScrollProvider>
          <Nav />
          <div className="grow">{children}</div>
          <Footer />
          <BackToTop />
          <AutoScrollReader />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

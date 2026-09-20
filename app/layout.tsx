import { geistMono, inter, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nav } from "@/ui/nav";
import { Footer } from "@/ui/footer";

export const metadata: Metadata = {
  title: "Syed Blog | High-Performance Tech & Software Insights",
  description:
    "Stay informed with the latest updates, engineering insights, and tech tutorials from Syed Blog.",
  openGraph: {
    title: "Syed Blog | High-Performance Tech & Software Insights",
    description:
      "Stay informed with the latest updates, engineering insights, and tech tutorials from Syed Blog.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Blog | High-Performance Tech & Software Insights",
    description:
      "Stay informed with the latest updates, engineering insights, and tech tutorials from Syed Blog.",
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
        "scroll-smooth",
      )}
    >
      <body className="font-default text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white min-h-screen flex flex-col justify-between bg-white">
        <Nav />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

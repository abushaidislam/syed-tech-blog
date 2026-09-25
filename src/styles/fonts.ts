import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { Hind_Siliguri } from "next/font/google";

export const satoshi = localFont({
  src: "./Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
});

export const inter = localFont({
  src: "./Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  style: "normal",
});

export const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const geistMono = GeistMono;


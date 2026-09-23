import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

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

export const geistMono = GeistMono;

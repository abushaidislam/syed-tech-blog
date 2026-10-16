import React from "react";

export { slugify } from "./utils";

/**
 * Recursively extracts plain text string from React children/nodes.
 */
export function extractNodeText(node: React.ReactNode): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join("");
  if (React.isValidElement(node) && node.props) {
    return extractNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

# Sentinel Security Journal

## 2025-05-18 - MDX Custom Link Components Protocol Sanitization
**Vulnerability:** MDX interactive components (like `LinkCard`) that accept `href` props bypass default Markdown link sanitization if `href` is not explicitly validated against dangerous schemes (`javascript:`, `data:`, `vbscript:`).
**Learning:** Custom MDX components rendering `<a href>` or `<Link href>` must sanitize `href` directly within the component implementation to prevent XSS payloads in MDX content.
**Prevention:** Always validate and sanitize `href` props in custom React link components with regex `/^(javascript|data|vbscript):/i` before passing to DOM or router links.

## 2025-05-18 - MDX File Lookup Path Traversal Prevention
**Vulnerability:** Dynamic route parameter `slug` passed directly into `path.join(BLOG_DIR, ...)` allowed relative path traversal sequences (`..`, `/`, `\`) to target files outside `content/blog/`.
**Learning:** `path.join` does not restrict path resolution to the base directory when inputs contain relative navigation components.
**Prevention:** Reject dangerous slug characters (`..`, `/`, `\`, `\0`) and verify resolved target paths with `path.resolve(targetPath).startsWith(path.resolve(BLOG_DIR) + path.sep)`.

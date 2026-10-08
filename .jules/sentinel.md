# Sentinel Security Journal

## 2025-05-18 - MDX Custom Link Components Protocol Sanitization
**Vulnerability:** MDX interactive components (like `LinkCard`) that accept `href` props bypass default Markdown link sanitization if `href` is not explicitly validated against dangerous schemes (`javascript:`, `data:`, `vbscript:`).
**Learning:** Custom MDX components rendering `<a href>` or `<Link href>` must sanitize `href` directly within the component implementation to prevent XSS payloads in MDX content.
**Prevention:** Always validate and sanitize `href` props in custom React link components with regex `/^(javascript|data|vbscript):/i` before passing to DOM or router links.

## 2025-05-19 - File Utility Path Traversal Sanitization
**Vulnerability:** Server-side blog file lookup function (`getBlogPostBySlug`) constructed file paths using `path.join` with input `slug` parameters without checking for directory traversal sequences (`..`, `/`, `\`) or verifying path resolution boundaries.
**Learning:** Dynamic file resolution functions must validate input slugs against traversal sequences and verify that `path.resolve(targetPath)` resides strictly inside the target content directory before reading files from disk.
**Prevention:** Always validate input strings against path traversal characters and enforce `path.resolve(target).startsWith(resolvedBaseDir + path.sep)` before executing `fs` operations.

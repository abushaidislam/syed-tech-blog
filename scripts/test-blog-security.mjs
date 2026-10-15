import assert from "assert";
import { getBlogPostBySlug, getAllBlogPostSlugs } from "../src/lib/blog.ts";

console.log("🔒 Running Blog Security Path Traversal Tests...");

// Test 1: Path traversal payloads must return null
const dangerousPayloads = [
  "../package.json",
  "../../etc/passwd",
  "../secret.mdx",
  "sub/dir",
  "folder\\slug",
  "slug\0null",
  "",
  null,
  undefined,
];

for (const payload of dangerousPayloads) {
  const result = getBlogPostBySlug(payload);
  assert.strictEqual(
    result,
    null,
    `Expected getBlogPostBySlug("${payload}") to return null for security safety!`
  );
  console.log(`  ✓ Blocked path traversal attempt: "${payload}"`);
}

// Test 2: Valid slug should return non-null blog post
const validSlugs = getAllBlogPostSlugs();
assert.ok(validSlugs.length > 0, "Expected at least one valid blog post slug in content/blog");

const firstSlug = validSlugs[0];
const post = getBlogPostBySlug(firstSlug);
assert.ok(post !== null, `Expected valid post for slug "${firstSlug}"`);
assert.strictEqual(post.frontmatter.slug, firstSlug, "Slug in frontmatter should match requested slug");
console.log(`  ✓ Successfully loaded valid blog post for slug: "${firstSlug}"`);

console.log("✅ All path traversal security tests passed successfully!");

import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// ============================================================================
// Environment Configuration
// ============================================================================
const envLocalPath = path.join(process.cwd(), ".env.local");
const envPath = path.join(process.cwd(), ".env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile(envLocalPath);
loadEnvFile(envPath);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_EN_DIR = path.join(BLOG_DIR, "en");
const BLOG_BN_DIR = path.join(BLOG_DIR, "bn");
const CACHE_FILE = path.join(BLOG_DIR, ".translate-cache.json");

if (!fs.existsSync(BLOG_EN_DIR)) fs.mkdirSync(BLOG_EN_DIR, { recursive: true });
if (!fs.existsSync(BLOG_BN_DIR)) fs.mkdirSync(BLOG_BN_DIR, { recursive: true });

// ============================================================================
// CLI Argument Parsing
// ============================================================================
const rawArgs = process.argv.slice(2);
const options = {
  dryRun: rawArgs.includes("--dry-run"),
  force: rawArgs.includes("--force"),
  sync: rawArgs.includes("--sync"),
  help: rawArgs.includes("--help") || rawArgs.includes("-h"),
  file: null,
  model: null,
  direction: "all", // "all", "en-to-bn", "bn-to-en"
};

for (const arg of rawArgs) {
  if (arg.startsWith("--file=")) {
    options.file = arg.slice("--file=".length).trim();
  } else if (arg.startsWith("--model=")) {
    options.model = arg.slice("--model=".length).trim();
  } else if (arg.startsWith("--direction=")) {
    options.direction = arg.slice("--direction=".length).trim().toLowerCase();
  }
}

function printHelp() {
  console.log(`
🌐 Production-Grade Blog Auto-Translator
==============================================================================
Usage:
  node scripts/auto-translate.mjs [options]

Options:
  --dry-run                 Simulate translation and run all MDX validations without writing to disk
  --force                   Force re-translation of targets even if already existing or unchanged
  --sync                    Check existing translations and re-translate if source content hash changed
  --file=<name|path>        Translate only a specific file (e.g. --file=company.mdx)
  --model=<name>            Override Gemini model name (e.g. --model=gemini-2.5-flash)
  --direction=<dir>         Translation direction: 'en-to-bn', 'bn-to-en', or 'all' (default: all)
  --help, -h                Show this help menu

Environment Variables:
  GEMINI_API_KEY            Google Gemini API key
  GEMINI_MODEL              Single model override
  GEMINI_MODELS             Comma-separated fallback models chain
  TRANSLATE_DELAY_MS        Delay between article translations (default: 3000ms)
  MAX_RETRIES               Maximum retry attempts per model on 429/503 (default: 5)
==============================================================================
`);
}

if (options.help) {
  printHelp();
  process.exit(0);
}

// ============================================================================
// Models & Rate Limiting Configuration
// ============================================================================
const DEFAULT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
];

function getModelChain(cliModel) {
  if (cliModel) return [cliModel];
  if (process.env.GEMINI_MODEL) return [process.env.GEMINI_MODEL];
  if (process.env.GEMINI_MODELS) {
    return process.env.GEMINI_MODELS.split(",").map((m) => m.trim()).filter(Boolean);
  }
  return DEFAULT_MODELS;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function computeHash(content) {
  return crypto
    .createHash("sha256")
    .update(content.replace(/\r\n/g, "\n").trim())
    .digest("hex");
}

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    return { version: 1, entries: {} };
  }
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[auto-translate] ⚠️  Failed to parse cache file, starting with a new cache:", err.message);
    return { version: 1, entries: {} };
  }
}

function saveCache(cache) {
  if (options.dryRun) return;
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn("[auto-translate] ⚠️  Failed to persist cache file:", err.message);
  }
}

// ============================================================================
// Gemini API Call with Exponential Backoff & Truncation Check
// ============================================================================
async function callGemini(prompt, content, cliModel) {
  const models = getModelChain(cliModel);
  const maxRetries = parseInt(process.env.MAX_RETRIES || "5", 10);
  let lastError = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    let attempts = 0;

    while (attempts < maxRetries) {
      attempts++;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\nHere is the raw MDX content:\n\n${content}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
          }),
        });

        // Handle Rate Limits (429) & Transient Downtimes (503, 502, 504)
        if ([429, 503, 502, 504].includes(response.status)) {
          if (attempts < maxRetries) {
            const retryHeader = response.headers.get("retry-after");
            let waitTime;
            if (retryHeader && !isNaN(parseInt(retryHeader, 10))) {
              waitTime = parseInt(retryHeader, 10) * 1000;
            } else {
              const baseWait = response.status === 429 ? 12000 : 4000;
              const jitter = Math.floor(Math.random() * 2000);
              waitTime = Math.min(60000, Math.floor(baseWait * Math.pow(1.6, attempts - 1) + jitter));
            }
            console.warn(
              `[auto-translate] Model ${model} returned ${response.status} (rate/quota limit). Exponential backoff: waiting ${(waitTime / 1000).toFixed(1)}s (attempt ${attempts}/${maxRetries})...`
            );
            await delay(waitTime);
            continue;
          }
        }

        if (!response.ok) {
          const errText = await response.text();
          let errMessage = `${response.status} ${response.statusText}`;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.error?.message) errMessage = errJson.error.message;
          } catch (_) {}
          console.warn(`[auto-translate] Model ${model} responded with ${response.status}: ${errMessage.slice(0, 160)}...`);
          lastError = new Error(`Model ${model} failed: ${errMessage}`);
          break; // Switch to next model in fallback list
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];

        if (!candidate) {
          console.warn(`[auto-translate] Model ${model} returned no candidates.`);
          break;
        }

        // Validate Finish Reason to prevent corrupted or truncated posts
        const finishReason = candidate.finishReason;
        if (finishReason === "MAX_TOKENS") {
          throw new Error(`Model ${model} truncated output: exceeded maximum token limit (finishReason: MAX_TOKENS).`);
        }
        if (finishReason === "SAFETY") {
          throw new Error(`Model ${model} blocked output due to safety filters (finishReason: SAFETY).`);
        }
        if (finishReason && finishReason !== "STOP") {
          console.warn(`[auto-translate] Model ${model} returned finishReason: ${finishReason}`);
        }

        let translated = candidate.content?.parts?.[0]?.text;
        if (!translated) {
          console.warn(`[auto-translate] Model ${model} candidate contained no text parts.`);
          break;
        }

        // Strip any wrapping markdown code fences if LLM accidentally wrapped the whole file
        translated = translated.trim();
        if (/^```(?:mdx|markdown)?\r?\n/.test(translated) && translated.endsWith("```")) {
          translated = translated.replace(/^```(?:mdx|markdown)?\r?\n/, "").replace(/\r?\n```$/, "").trim();
        }

        // Normalize CRLF to LF
        translated = translated.replace(/\r\n/g, "\n");

        return translated;
      } catch (err) {
        lastError = err;
        console.warn(`[auto-translate] Model ${model} error:`, err.message);
        break; // Switch to next model
      }
    }
  }

  throw lastError || new Error("All Gemini models in fallback chain failed. Please verify API key, network, and quota.");
}

// ============================================================================
// Specialized Prompts
// ============================================================================
async function translateEnglishToBengali(fileContent, cliModel) {
  const prompt = `You are a world-class senior technical translator and technical writer specializing in software engineering, cloud systems, and modern web architectures.
Translate this MDX blog post from English to natural, fluent, elegant, and professional Bengali (Bangla).

CRITICAL STRICT RULES:
1. FRONTMATTER:
   - Delimited strictly by '---' at the top.
   - Translate ONLY 'title' and 'summary' to high-quality Bengali.
   - Translate 'dateFormatted' to natural Bengali numerals and Bengali month names (e.g., "March 8, 2024" -> "৮ মার্চ, ২০২৪").
   - PRESERVE 'slug', 'image', 'dateIso', 'category', 'categoryName', 'authors', 'featured', 'tags', 'keywords', 'updatedAt' EXACTLY AS IS. Do not modify or translate their values.
2. CODE & TECHNICAL IDENTIFIERS:
   - Keep ALL code blocks (\`\`\`...\`\`\`) and inline code (\`...\`) 100% UNCHANGED in English.
   - Keep ALL API endpoints, function names, variable names, CLI commands, package names, environment variables, and URLs EXACTLY AS IS.
3. JSX & MDX COMPONENTS:
   - Keep ALL JSX/MDX components (<Callout>, <Steps>, <Step>, <CodeTabs>, <Tab>, <FileTree>, <Folder>, <File>, <MetricsGrid>, <StatCard>, <Accordion>, etc.) intact.
   - Do NOT translate component tag names (e.g. NEVER translate <Callout> to <কলআউট> or <Steps> to <ধাপ>).
   - Component attribute keys (e.g. type="tip", title="...", href="...") must remain in English.
4. MATH & SYNTAX:
   - Keep all LaTeX math ($...$, $$...$$) EXACTLY AS IS.
   - NEVER insert Bengali words, Bengali numerals, or Unicode phrases inside LaTeX math delimiters ($...$, $$...$$). Keep math formulas strictly in standard LaTeX math notation.
   - Ensure all markdown formatting, lists, tables, and blockquotes remain properly balanced.
5. OUTPUT:
   - Output ONLY the raw MDX file content. Do NOT include any preamble, commentary, greetings, or outer code fences.`;

  return callGemini(prompt, fileContent, cliModel);
}

async function translateBengaliToEnglish(fileContent, cliModel) {
  const prompt = `You are a world-class senior technical translator and technical writer specializing in software engineering, cloud systems, and modern web architectures.
Translate this MDX blog post from Bengali (Bangla) to natural, fluent, idiomatically sound, and professional English.

CRITICAL STRICT RULES:
1. FRONTMATTER:
   - Delimited strictly by '---' at the top.
   - Translate 'title' and 'summary' to natural English.
   - Format 'dateFormatted' in standard English (e.g., "March 8, 2024").
   - PRESERVE 'slug', 'image', 'dateIso', 'category', 'categoryName', 'authors', 'featured', 'tags', 'keywords', 'updatedAt' EXACTLY AS IS. Do not modify or translate their values.
2. CODE & TECHNICAL IDENTIFIERS:
   - Keep ALL code blocks (\`\`\`...\`\`\`) and inline code (\`...\`) 100% UNCHANGED.
   - Keep ALL API endpoints, function names, variable names, CLI commands, package names, environment variables, and URLs EXACTLY AS IS.
3. JSX & MDX COMPONENTS:
   - Keep ALL JSX/MDX components (<Callout>, <Steps>, <Step>, <CodeTabs>, <Tab>, <FileTree>, <Folder>, <File>, <MetricsGrid>, <StatCard>, <Accordion>, etc.) intact.
   - Do NOT translate component tag names.
   - Component attribute keys must remain intact.
4. MATH & SYNTAX:
   - Keep all LaTeX math ($...$, $$...$$) EXACTLY AS IS.
   - Ensure all markdown formatting, lists, tables, and blockquotes remain properly balanced.
5. OUTPUT:
   - Output ONLY the raw MDX file content. Do NOT include any preamble, commentary, greetings, or outer code fences.`;

  return callGemini(prompt, fileContent, cliModel);
}

// ============================================================================
// Multi-Layer MDX Validation & In-Engine Compilation
// ============================================================================
async function validateAndCompileMdx(sourceContent, translatedContent, filename) {
  if (!translatedContent || !translatedContent.trim()) {
    throw new Error("Translation resulted in empty content.");
  }

  // 1. Frontmatter Validation
  let source;
  let translated;
  try {
    source = matter(sourceContent);
  } catch (err) {
    throw new Error(`Failed to parse source frontmatter: ${err.message}`);
  }

  try {
    translated = matter(translatedContent);
  } catch (err) {
    throw new Error(`Translation corrupted frontmatter YAML structure: ${err.message}`);
  }

  const requiredFields = ["slug", "title", "summary", "dateFormatted"];
  for (const field of requiredFields) {
    if (typeof translated.data[field] !== "string" || !translated.data[field].trim()) {
      throw new Error(`Translation is missing required frontmatter field: '${field}'`);
    }
  }

  const protectedFields = [
    "slug",
    "image",
    "dateIso",
    "category",
    "categoryName",
    "authors",
    "featured",
    "tags",
    "keywords",
  ];

  for (const field of protectedFields) {
    if (field in source.data) {
      if (JSON.stringify(source.data[field]) !== JSON.stringify(translated.data[field])) {
        throw new Error(
          `Translation modified protected frontmatter field '${field}': expected ${JSON.stringify(
            source.data[field]
          )} but received ${JSON.stringify(translated.data[field])}`
        );
      }
    }
  }

  // Ensure slug matches expected slug from filename
  const expectedSlug = filename.replace(/\.mdx$/, "");
  if (translated.data.slug !== expectedSlug) {
    throw new Error(`Frontmatter slug mismatch: expected '${expectedSlug}', got '${translated.data.slug}'`);
  }

  // 2. Structural Markdown Balance Checks
  const codeFenceMatches = (translated.content.match(/^```/gm) || []).length;
  if (codeFenceMatches % 2 !== 0) {
    throw new Error(
      `Unclosed markdown code fence detected: found ${codeFenceMatches} code fences (must be an even number).`
    );
  }

  const mathBlockMatches = (translated.content.match(/\$\$/g) || []).length;
  if (mathBlockMatches % 2 !== 0) {
    throw new Error(
      `Unclosed LaTeX display math block detected: found ${mathBlockMatches} '$$' delimiters (must be an even number).`
    );
  }

  // 3. Real MDX In-Engine Compilation Test
  // Checks JSX validity, unclosed tags, and syntax errors exactly as Next.js does
  try {
    await compileMDX({
      source: translated.content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    });
  } catch (err) {
    throw new Error(`MDX compilation failed on translated content: ${err.message}`);
  }

  return translatedContent.trim() + "\n";
}

// ============================================================================
// Core Execution Pipeline
// ============================================================================
async function main() {
  const startTime = Date.now();
  console.log("==============================================================================");
  console.log("🌐 Production-Grade Syed / Sayeed Blog Auto-Translator");
  console.log("==============================================================================");

  if (options.dryRun) {
    console.log("🔍 [DRY-RUN MODE]: Validations will run, but no files or cache will be written.");
  }
  if (options.force) {
    console.log("⚡ [FORCE MODE]: Overriding cache and existing file checks.");
  }
  if (options.sync) {
    console.log("🔄 [SYNC MODE]: Checking for updated source files to re-translate.");
  }

  if (!GEMINI_API_KEY) {
    console.error("\n❌ No GEMINI_API_KEY or GOOGLE_API_KEY found.");
    console.error("   Please provide it via .env.local, .env, or GitHub Secrets (GEMINI_API_KEY).");
    process.exit(1);
  }

  const cache = loadCache();
  const baseDelay = parseInt(process.env.TRANSLATE_DELAY_MS || "3000", 10);

  // Read files from directories
  let enFiles = fs.readdirSync(BLOG_EN_DIR).filter((f) => f.endsWith(".mdx"));
  let bnFiles = fs.readdirSync(BLOG_BN_DIR).filter((f) => f.endsWith(".mdx"));

  if (options.file) {
    const targetBase = path.basename(options.file).replace(/\.mdx$/, "") + ".mdx";
    enFiles = enFiles.filter((f) => f === targetBase);
    bnFiles = bnFiles.filter((f) => f === targetBase);

    if (enFiles.length === 0 && bnFiles.length === 0) {
      console.error(`\n❌ Target file '${options.file}' not found in either content/blog/en/ or content/blog/bn/.`);
      process.exit(1);
    }
  }

  // Build work items list
  const queue = [];

  // 1. Evaluate EN -> BN
  if (options.direction === "all" || options.direction === "en-to-bn") {
    for (const file of enFiles) {
      const srcPath = path.join(BLOG_EN_DIR, file);
      const destPath = path.join(BLOG_BN_DIR, file);
      const srcContent = fs.readFileSync(srcPath, "utf-8");
      const enHash = computeHash(srcContent);
      const slug = file.replace(/\.mdx$/, "");

      const destExists = fs.existsSync(destPath);
      const cached = cache.entries?.[slug];

      let needsTranslation = false;
      let reason = "";

      if (!destExists) {
        needsTranslation = true;
        reason = "Missing target file in content/blog/bn/";
      } else if (options.force) {
        needsTranslation = true;
        reason = "Forced re-translation (--force)";
      } else if (options.sync && cached?.enHash && cached.enHash !== enHash) {
        needsTranslation = true;
        reason = "English source content was updated (hash mismatch with cache)";
      } else if (destExists && (!cached || !cached.enHash)) {
        // Seed cache for already synchronized file
        if (!cache.entries) cache.entries = {};
        const destContent = fs.readFileSync(destPath, "utf-8");
        cache.entries[slug] = {
          enHash,
          bnHash: computeHash(destContent),
          lastTranslatedAt: new Date().toISOString(),
        };
      }

      if (needsTranslation) {
        queue.push({
          type: "EN -> BN",
          file,
          srcPath,
          destPath,
          srcContent,
          srcHash: enHash,
          slug,
          reason,
          translator: translateEnglishToBengali,
        });
      }
    }
  }

  // 2. Evaluate BN -> EN
  if (options.direction === "all" || options.direction === "bn-to-en") {
    for (const file of bnFiles) {
      const srcPath = path.join(BLOG_BN_DIR, file);
      const destPath = path.join(BLOG_EN_DIR, file);
      const srcContent = fs.readFileSync(srcPath, "utf-8");
      const bnHash = computeHash(srcContent);
      const slug = file.replace(/\.mdx$/, "");

      const destExists = fs.existsSync(destPath);
      const cached = cache.entries?.[slug];

      let needsTranslation = false;
      let reason = "";

      if (!destExists) {
        needsTranslation = true;
        reason = "Missing target file in content/blog/en/";
      } else if (options.force) {
        needsTranslation = true;
        reason = "Forced re-translation (--force)";
      } else if (options.sync && cached?.bnHash && cached.bnHash !== bnHash) {
        needsTranslation = true;
        reason = "Bengali source content was updated (hash mismatch with cache)";
      } else if (destExists && (!cached || !cached.bnHash)) {
        // Seed cache for already synchronized file
        if (!cache.entries) cache.entries = {};
        const destContent = fs.readFileSync(destPath, "utf-8");
        cache.entries[slug] = {
          enHash: computeHash(destContent),
          bnHash,
          lastTranslatedAt: new Date().toISOString(),
        };
      }

      if (needsTranslation) {
        queue.push({
          type: "BN -> EN",
          file,
          srcPath,
          destPath,
          srcContent,
          srcHash: bnHash,
          slug,
          reason,
          translator: translateBengaliToEnglish,
        });
      }
    }
  }

  saveCache(cache);

  console.log(`\n📋 Queue evaluation complete: ${queue.length} article(s) scheduled for processing.`);

  if (queue.length === 0) {
    console.log("✨ All blog posts are fully translated and synchronized. Nothing to do!");
    process.exit(0);
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    console.log(`\n[${i + 1}/${queue.length}] 🚀 ${item.type}: ${item.file}`);
    console.log(`       Reason: ${item.reason}`);

    try {
      const rawTranslated = await item.translator(item.srcContent, options.model);
      console.log(`       Validating frontmatter, Markdown structures & compiling MDX...`);

      const validatedContent = await validateAndCompileMdx(item.srcContent, rawTranslated, item.file);

      if (!options.dryRun) {
        fs.writeFileSync(item.destPath, validatedContent, "utf-8");

        // Update cache entry
        if (!cache.entries) cache.entries = {};
        const targetHash = computeHash(validatedContent);
        if (item.type.startsWith("EN")) {
          cache.entries[item.slug] = {
            enHash: item.srcHash,
            bnHash: targetHash,
            lastTranslatedAt: new Date().toISOString(),
          };
        } else {
          cache.entries[item.slug] = {
            enHash: targetHash,
            bnHash: item.srcHash,
            lastTranslatedAt: new Date().toISOString(),
          };
        }
        saveCache(cache);
        console.log(`       ✨ Successfully written & verified: ${path.relative(process.cwd(), item.destPath)}`);
      } else {
        console.log(`       ✨ [DRY-RUN] MDX validated and compiled successfully! (Skipped write)`);
      }

      successCount++;
    } catch (err) {
      failureCount++;
      console.error(`       ❌ Failed to process ${item.file}:`, err.message);
    }

    // Rate-limit throttle between items (unless dry-run or last item)
    if (i < queue.length - 1 && !options.dryRun) {
      await delay(baseDelay);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n==============================================================================");
  console.log("📊 Summary Report");
  console.log("==============================================================================");
  console.log(`⏱️  Total Duration:     ${durationSec}s`);
  console.log(`✅ Successful:         ${successCount}`);
  console.log(`❌ Failed:             ${failureCount}`);
  console.log("==============================================================================");

  if (failureCount > 0) {
    console.error(`\n💥 Translation pipeline finished with ${failureCount} failure(s).`);
    process.exit(1);
  } else {
    console.log("\n🎉 Auto-translation completed with zero errors!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("\n💥 Uncaught Fatal Error in auto-translate pipeline:", err);
  process.exit(1);
});

import fs from "fs";
import path from "path";

// Load .env.local or .env if running locally
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

const BLOG_EN_DIR = path.join(process.cwd(), "content", "blog", "en");
const BLOG_BN_DIR = path.join(process.cwd(), "content", "blog", "bn");

// Ensure directories exist
if (!fs.existsSync(BLOG_EN_DIR)) fs.mkdirSync(BLOG_EN_DIR, { recursive: true });
if (!fs.existsSync(BLOG_BN_DIR)) fs.mkdirSync(BLOG_BN_DIR, { recursive: true });

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function callGemini(prompt, content) {
  // Try supported Gemini model names in order of recommendation and speed
  const models = [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-pro-latest",
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
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
              temperature: 0.2,
            },
          }),
        });

        if (response.status === 503 || response.status === 429) {
          if (attempts < maxAttempts) {
            const waitTime = response.status === 429 ? 10000 : 3000;
            console.warn(`[auto-translate] Model ${model} returned ${response.status} (rate/quota limit). Waiting ${waitTime / 1000}s... (attempt ${attempts}/${maxAttempts})`);
            await delay(waitTime);
            continue;
          }
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[auto-translate] Model ${model} returned ${response.status}: ${errText.slice(0, 150)}...`);
          break; // Move to next model if 404 or other unrecoverable error
        }

        const data = await response.json();
        let translated = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!translated) break;

        // Clean any accidental triple backtick wrapper around the whole file
        translated = translated.trim();
        if (translated.startsWith("```mdx")) {
          translated = translated.replace(/^```mdx\r?\n/, "").replace(/\r?\n```$/, "");
        } else if (translated.startsWith("```markdown")) {
          translated = translated.replace(/^```markdown\r?\n/, "").replace(/\r?\n```$/, "");
        } else if (translated.startsWith("```")) {
          translated = translated.replace(/^```[a-z]*\r?\n/, "").replace(/\r?\n```$/, "");
        }

        return translated;
      } catch (err) {
        console.warn(`[auto-translate] Failed with model ${model}:`, err.message);
        break;
      }
    }
  }

  throw new Error("All Gemini models failed. Please check your GEMINI_API_KEY and network.");
}

async function translateEnglishToBengali(fileContent) {
  const prompt = `You are an expert technical translator for modern software engineering blogs.
Translate this MDX blog post from English to natural, professional, high-standard Bengali (Bangla).

CRITICAL RULES:
1. Maintain the exact YAML frontmatter structure delimited by '---' at the top.
2. In frontmatter:
   - Translate 'title' and 'summary' to Bengali.
   - Keep 'slug', 'image', 'dateIso', 'category', 'categoryName', 'authors', 'tags', 'keywords' exactly intact.
   - Translate 'dateFormatted' to natural Bengali numerals and months (e.g. "March 8, 2024" -> "৮ মার্চ, ২০২৪").
3. In the markdown body:
   - Translate the explanatory prose into clean, fluent, technical Bengali.
   - Keep all code blocks (\`\`\`...\`\`\`), inline code (\`...\`), variable names, API endpoints, function names, and technical identifiers EXACTLY AS IS in English.
   - Keep all JSX/React components, import statements, links, image URLs, and LaTeX math ($...$, $$...$$) EXACTLY AS IS.
4. Output ONLY the raw MDX file content. Do NOT add any preamble, explanation, or wrap the whole output in code fences.`;

  return callGemini(prompt, fileContent);
}

async function translateBengaliToEnglish(fileContent) {
  const prompt = `You are an expert technical translator for modern software engineering blogs.
Translate this MDX blog post from Bengali (Bangla) to natural, fluent, professional English.

CRITICAL RULES:
1. Maintain the exact YAML frontmatter structure delimited by '---' at the top.
2. In frontmatter:
   - Translate 'title' and 'summary' to English.
   - Keep 'slug', 'image', 'dateIso', 'category', 'categoryName', 'authors', 'tags', 'keywords' exactly intact.
   - Format 'dateFormatted' in English (e.g. "March 8, 2024").
3. In the markdown body:
   - Translate the Bengali prose into clear, idiomatic English.
   - Keep all code blocks (\`\`\`...\`\`\`), inline code (\`...\`), variable names, API endpoints, function names, and technical identifiers EXACTLY AS IS.
   - Keep all JSX/React components, import statements, links, image URLs, and LaTeX math ($...$, $$...$$) EXACTLY AS IS.
4. Output ONLY the raw MDX file content. Do NOT add any preamble, explanation, or wrap the whole output in code fences.`;

  return callGemini(prompt, fileContent);
}

async function main() {
  console.log("==========================================");
  console.log("🌐 Syed / Sayeed Blog Auto-Translator");
  console.log("==========================================");

  if (!GEMINI_API_KEY) {
    console.log("[auto-translate] ⚠️  No GEMINI_API_KEY found.");
    console.log("[auto-translate] To enable automatic translation, set GEMINI_API_KEY in your GitHub Secrets or in .env.local.");
    console.log("[auto-translate] Skipping translation for now.");
    process.exit(0);
  }

  const enFiles = fs.readdirSync(BLOG_EN_DIR).filter((f) => f.endsWith(".mdx"));
  const bnFiles = fs.readdirSync(BLOG_BN_DIR).filter((f) => f.endsWith(".mdx"));

  const missingInBn = enFiles.filter((f) => !bnFiles.includes(f));
  const missingInEn = bnFiles.filter((f) => !enFiles.includes(f));

  if (missingInBn.length === 0 && missingInEn.length === 0) {
    console.log("✅ All articles already translated in both en/ and bn/!");
    console.log("   No new files to translate. Exiting.");
    process.exit(0);
  }

  // 1. Translate EN -> BN
  if (missingInBn.length > 0) {
    console.log(`\n📝 Found ${missingInBn.length} article(s) in 'en/' missing in 'bn/':`);
    for (const filename of missingInBn) {
      console.log(`   -> Translating (EN -> BN): ${filename}...`);
      try {
        const srcPath = path.join(BLOG_EN_DIR, filename);
        const destPath = path.join(BLOG_BN_DIR, filename);
        const content = fs.readFileSync(srcPath, "utf-8");

        const translated = await translateEnglishToBengali(content);
        fs.writeFileSync(destPath, translated, "utf-8");
        console.log(`   ✨ Saved: content/blog/bn/${filename}`);
      } catch (err) {
        console.error(`   ❌ Failed to translate ${filename}:`, err.message);
      }
      await delay(3000); // Respect Gemini API free-tier 15 RPM rate limit
    }
  }

  // 2. Translate BN -> EN
  if (missingInEn.length > 0) {
    console.log(`\n📝 Found ${missingInEn.length} article(s) in 'bn/' missing in 'en/':`);
    for (const filename of missingInEn) {
      console.log(`   -> Translating (BN -> EN): ${filename}...`);
      try {
        const srcPath = path.join(BLOG_BN_DIR, filename);
        const destPath = path.join(BLOG_EN_DIR, filename);
        const content = fs.readFileSync(srcPath, "utf-8");

        const translated = await translateBengaliToEnglish(content);
        fs.writeFileSync(destPath, translated, "utf-8");
        console.log(`   ✨ Saved: content/blog/en/${filename}`);
      } catch (err) {
        console.error(`   ❌ Failed to translate ${filename}:`, err.message);
      }
    }
  }

  console.log("\n🎉 Auto-translation completed successfully!");
}

main().catch((err) => {
  console.error("Fatal error in auto-translate:", err);
  process.exit(1);
});

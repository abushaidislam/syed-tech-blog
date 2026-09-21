import fs from "fs";
import path from "path";
import sharp from "sharp";

const TARGET_DIR = path.resolve(process.cwd(), "public/images/blog");

async function optimizeImages() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.log("Directory not found:", TARGET_DIR);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  let totalOriginal = 0;
  let totalOptimized = 0;

  console.log(`Starting image optimization in ${TARGET_DIR}...\n`);

  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const originalSize = stat.size;
    totalOriginal += originalSize;

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const image = sharp(fileBuffer);
      const metadata = await image.metadata();

      let pipeline = sharp(fileBuffer).resize({
        width: 1600,
        withoutEnlargement: true,
      });

      let buffer;
      if (ext === ".jpg" || ext === ".jpeg") {
        buffer = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      } else if (ext === ".png") {
        buffer = await pipeline.png({ quality: 85, compressionLevel: 9 }).toBuffer();
      }

      if (buffer && buffer.length < originalSize) {
        fs.writeFileSync(filePath, buffer);
        totalOptimized += buffer.length;
        const savedPercent = (((originalSize - buffer.length) / originalSize) * 100).toFixed(1);
        console.log(
          `✓ ${file} (${metadata.width}x${metadata.height}) -> ${(originalSize / 1024).toFixed(0)}KB to ${(buffer.length / 1024).toFixed(0)}KB (-${savedPercent}%)`
        );
      } else {
        totalOptimized += originalSize;
        console.log(`- ${file} is already optimal`);
      }
    } catch (err) {
      console.error(`✕ Error optimizing ${file}:`, err.message);
      totalOptimized += originalSize;
    }
  }

  const savedMb = ((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(2);
  const totalSavedPercent = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1);

  console.log(`\n========================================`);
  console.log(`Total original: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total optimized: ${(totalOptimized / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Saved: ${savedMb} MB (${totalSavedPercent}% reduction)`);
  console.log(`========================================\n`);
}

optimizeImages();

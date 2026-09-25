import fs from "fs";
import path from "path";

const sourcePath = "C:/Users/ASUS/Downloads/renderx_background_VECTOR_DOTS_AND_LINES.svg";
if (!fs.existsSync(sourcePath)) {
  console.error("Source file not found at", sourcePath);
  process.exit(1);
}

const svgContent = fs.readFileSync(sourcePath, "utf8");
const startTag = "data:image/png;base64,";
const startIndex = svgContent.indexOf(startTag);

if (startIndex !== -1) {
  let endIndex = svgContent.indexOf('"', startIndex);
  if (endIndex === -1) {
    endIndex = svgContent.indexOf("'", startIndex);
  }
  const dataUri = svgContent.slice(startIndex, endIndex);
  const base64 = dataUri.replace(startTag, "");
  
  fs.mkdirSync(path.join(process.cwd(), "public/images"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), "public/images/og-background.png"), Buffer.from(base64, "base64"));
  fs.writeFileSync(path.join(process.cwd(), "public/images/og-background.svg"), svgContent);
  
  console.log("Extracted PNG size:", fs.statSync(path.join(process.cwd(), "public/images/og-background.png")).size);
  console.log("Copied SVG size:", fs.statSync(path.join(process.cwd(), "public/images/og-background.svg")).size);
} else {
  console.error("Could not find data:image/png;base64, in SVG");
}

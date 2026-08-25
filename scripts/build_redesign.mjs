import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const templatePath = path.join(project, "site.template.html");
const outputPath = path.join(project, "acyuta-gopi-tour.html");

const dataUri = (relativePath) => {
  const extension = path.extname(relativePath).slice(1).toLowerCase();
  const mime = extension === "jpg" || extension === "jpeg" ? "image/jpeg" : extension === "svg" ? "image/svg+xml" : `image/${extension}`;
  const data = fs.readFileSync(path.join(project, relativePath)).toString("base64");
  return `data:${mime};base64,${data}`;
};

const replacements = {
  HERO_IMAGE: dataUri("assets/generated/hero-kirtan.jpg"),
  ABOUT_IMAGE: dataUri("assets/generated/about-harmonium.jpg"),
  LINEUP_IMAGE: dataUri("assets/generated/lineup-stage.jpg"),
  COMMUNITY_IMAGE: dataUri("assets/generated/community-kirtan.jpg"),
  PILLAR_MUSIC: dataUri("assets/generated/pillar-music-v2.jpg"),
  PILLAR_STORY: dataUri("assets/generated/pillar-story-v2.jpg"),
  PILLAR_BELONGING: dataUri("assets/generated/pillar-belonging-v2.jpg"),
  PILLAR_DESIGN: dataUri("assets/generated/pillar-design-v2.jpg"),
  CITY_BANGALORE: dataUri("assets/cities/bangalore.jpg"),
  CITY_DELHI: dataUri("assets/cities/delhi.jpg"),
  CITY_AHMEDABAD: dataUri("assets/cities/ahmedabad.jpg"),
  CITY_MUMBAI: dataUri("assets/cities/mumbai.jpg"),
  CITY_HYDERABAD: dataUri("assets/cities/hyderabad.jpg"),
  TIMES_LOGO: dataUri("assets/brand/times-internet-logo.png"),
};

let html = fs.readFileSync(templatePath, "utf8");
for (const [token, value] of Object.entries(replacements)) {
  const marker = `{{${token}}}`;
  if (!html.includes(marker)) throw new Error(`Template marker not found: ${marker}`);
  html = html.split(marker).join(value);
}

const unresolved = html.match(/{{[A-Z_]+}}/g);
if (unresolved) throw new Error(`Unresolved template markers: ${unresolved.join(", ")}`);

fs.writeFileSync(outputPath, html);
console.log(`Built ${outputPath} (${Buffer.byteLength(html).toLocaleString()} bytes)`);

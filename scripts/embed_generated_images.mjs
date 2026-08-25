import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.dirname(scriptDirectory);
const htmlPath = path.join(projectDirectory, "acyuta-gopi-tour.html");

function imageDataUri(fileName) {
  const filePath = path.join(projectDirectory, "assets", "generated", fileName);
  return `data:image/jpeg;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

const images = {
  hero: imageDataUri("hero-kirtan.jpg"),
  about: imageDataUri("about-harmonium.jpg"),
  lineup: imageDataUri("lineup-stage.jpg"),
  community: imageDataUri("community-kirtan.jpg"),
};

let html = fs.readFileSync(htmlPath, "utf8");

function replaceOnce(label, pattern, replacement) {
  const matches = html.match(new RegExp(pattern.source, `${pattern.flags.includes("s") ? "s" : ""}g`));
  if (!matches || matches.length !== 1) {
    throw new Error(`${label}: expected exactly one match, found ${matches?.length ?? 0}`);
  }
  html = html.replace(pattern, replacement);
}

replaceOnce(
  "desktop hero",
  /(\.hero-img\{position:absolute;[^}]*background:url\(")data:image\/[^\"]+("\))/s,
  `$1${images.hero}$2`,
);
replaceOnce(
  "mobile hero",
  /(\.hero-img\{position:relative;[^}]*background-image:url\(")data:image\/[^\"]+("\))/s,
  `$1${images.hero}$2`,
);
replaceOnce(
  "about image",
  /(<img src=")data:image\/[^\"]+(" alt=")Acyuta Gopi leading kirtan("[^>]*>)/s,
  `$1${images.about}$2Hands playing a harmonium beside jasmine, marigolds and a brass lamp$3`,
);
replaceOnce(
  "lineup image",
  /(<img src=")data:image\/[^\"]+(" alt=")Acyuta Gopi performing live on stage("[^>]*>)/s,
  `$1${images.lineup}$2Devotional music artist performing at a harmonium on a warm-lit stage$3`,
);
replaceOnce(
  "community image",
  /(\.band-img\{position:absolute;[^}]*background:url\(")data:image\/[^\"]+("\))/s,
  `$1${images.community}$2`,
);

fs.writeFileSync(htmlPath, html);
console.log(`Embedded four generated JPEGs into ${htmlPath}`);

// Makes light copies of the pictures for phones: code/images/x.png -> code/images/web/x.jpg (about 10x smaller).
// The originals are never touched. A copy is rebuilt only when its original is newer. Uses `sips` (macOS);
// without it nothing is made and the game simply loads the originals.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DIR = path.join(__dirname, "..", "code", "images");
const OUT = path.join(DIR, "web");
let made = 0;
try {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(DIR)) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const src = path.join(DIR, f), dst = path.join(OUT, f.replace(/\.[^.]+$/, ".jpg"));
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", src]).toString().match(/\d+/g).map(Number);
    const big = Math.max(...dims.slice(-2)) > 1400;   // never enlarge a small picture
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "72", ...(big ? ["-Z", "1400"] : []), src, "--out", dst], { stdio: "ignore" });
    made++;
  }
  if (made) console.log(`Pictures: ${made} light copy(ies) made in code/images/web`);
} catch (e) {
  console.log("Pictures: no light copies made (sips not available): the originals will be used.");
}

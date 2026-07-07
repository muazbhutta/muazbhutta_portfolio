const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const DIST = "dist";
const SKIP = new Set(["node_modules", "dist", "ci", ".git"]);
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
function copyDir(src, dest) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else if (/\.(html|css|js|json|png|jpe?g|svg|webp|ico|txt|pdf|woff2?)$/i.test(e.name)) {
      if (["package.json", "package-lock.json", "eslint.config.mjs", "setup-pipeline.sh"].includes(e.name)) continue;
      fs.copyFileSync(s, d);
    }
  }
}
copyDir(".", DIST);
const pkg = JSON.parse(fs.readFileSync("package.json"));
let sha = "local";
try { sha = execSync("git rev-parse --short HEAD").toString().trim(); } catch (e) {}
const version = pkg.version + "+" + sha;
fs.writeFileSync(path.join(DIST, "build-info.json"), JSON.stringify({ version, builtAt: new Date().toISOString() }, null, 2));
console.log("BUILD OK -> dist/  version=" + version);

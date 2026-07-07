const fs = require("fs");
const assert = require("assert");
assert(fs.existsSync("dist/index.html"), "dist/index.html missing");
const html = fs.readFileSync("dist/index.html", "utf8");
assert(/<title>[\s\S]*<\/title>/.test(html), "Missing <title>");
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
for (const s of scripts) {
  if (s.startsWith("http")) continue;
  assert(fs.existsSync("dist/" + s), "Missing script in dist: " + s);
}
const styles = [...html.matchAll(/<link[^>]*href="([^"]+\.css)"/g)].map(m => m[1]);
for (const c of styles) {
  if (c.startsWith("http")) continue;
  assert(fs.existsSync("dist/" + c), "Missing stylesheet in dist: " + c);
}
const info = JSON.parse(fs.readFileSync("dist/build-info.json"));
assert(info.version, "build-info missing version");
console.log("SMOKE TEST PASSED: " + scripts.length + " scripts, " + styles.length + " stylesheets, version " + info.version);

// ci/generate-report.js
// Runs HTML/CSS/JS syntax checks, collects results, generates reports/quality-report.pdf
// Usage: node ci/generate-report.js
const { execSync } = require("child_process");
const fs = require("fs");

fs.mkdirSync("reports", { recursive: true });

// Har check chalao, output + pass/fail capture karo (fail par script NAHI rukti —
// pehle poori report banti hai, aakhir mein exit code decide hota hai)
function run(name, cmd) {
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { name, cmd, passed: true, output: out.trim() || "No issues found." };
  } catch (e) {
    const output = ((e.stdout || "") + "\n" + (e.stderr || "")).trim();
    return { name, cmd, passed: false, output };
  }
}

const checks = [
  run("HTML Syntax (htmlhint)", "npx htmlhint index.html"),
  run("HTML Spec (html-validate)", "npx html-validate index.html"),
  run("CSS Syntax (stylelint)", "npx stylelint \"*.css\""),
  run("JavaScript (eslint)", "npx eslint ."),
];

// Git/build context for the report header
function safe(cmd, fallback) {
  try { return execSync(cmd, { encoding: "utf8" }).trim(); } catch (e) { return fallback; }
}
const meta = {
  project: "muazbhutta_portfolio",
  branch: process.env.BRANCH_NAME || safe("git rev-parse --abbrev-ref HEAD", "unknown"),
  commit: safe("git rev-parse --short HEAD", "unknown"),
  build: process.env.BUILD_NUMBER || "local",
  date: new Date().toUTCString(),
};

const total = checks.length;
const passed = checks.filter(c => c.passed).length;
const allPassed = passed === total;

// HTML escape (report ke andar code output safe dikhane ke liye)
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Code Quality Report</title>
<style>
  body { font-family: 'DejaVu Sans', Arial, sans-serif; margin: 40px; color: #1a202c; }
  h1 { border-bottom: 3px solid ${allPassed ? "#38a169" : "#e53e3e"}; padding-bottom: 10px; }
  .meta { background: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; }
  .meta td { padding: 3px 15px 3px 0; }
  .summary { font-size: 20px; margin: 20px 0; padding: 15px;
             background: ${allPassed ? "#f0fff4" : "#fff5f5"};
             border-left: 6px solid ${allPassed ? "#38a169" : "#e53e3e"}; }
  .check { margin: 18px 0; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
  .check-header { padding: 10px 15px; font-weight: bold; }
  .pass .check-header { background: #f0fff4; color: #22543d; }
  .fail .check-header { background: #fff5f5; color: #742a2a; }
  pre { background: #1a202c; color: #e2e8f0; padding: 12px; margin: 0;
        font-size: 11px; white-space: pre-wrap; word-wrap: break-word; }
  .cmd { color: #718096; font-size: 12px; font-weight: normal; }
</style>
</head>
<body>
  <h1>${allPassed ? "✔" : "✘"} Code Quality Report</h1>
  <div class="meta"><table>
    <tr><td><b>Project</b></td><td>${meta.project}</td></tr>
    <tr><td><b>Branch</b></td><td>${meta.branch}</td></tr>
    <tr><td><b>Commit</b></td><td>${meta.commit}</td></tr>
    <tr><td><b>Jenkins Build</b></td><td>#${meta.build}</td></tr>
    <tr><td><b>Generated</b></td><td>${meta.date}</td></tr>
  </table></div>
  <div class="summary"><b>${passed}/${total} checks passed</b> — ${allPassed ? "READY TO MERGE" : "FIX REQUIRED before merge"}</div>
  ${checks.map(c => `
  <div class="check ${c.passed ? "pass" : "fail"}">
    <div class="check-header">${c.passed ? "✔ PASS" : "✘ FAIL"} — ${c.name}
      <div class="cmd">$ ${esc(c.cmd)}</div>
    </div>
    <pre>${esc(c.output).slice(0, 8000)}</pre>
  </div>`).join("")}
</body>
</html>`;

fs.writeFileSync("reports/quality-report.html", html);
console.log("HTML report written: reports/quality-report.html");

// HTML -> PDF: try wkhtmltopdf first, fall back to weasyprint
const converters = [
  "wkhtmltopdf --quiet reports/quality-report.html reports/quality-report.pdf",
  "weasyprint reports/quality-report.html reports/quality-report.pdf",
];
let pdfDone = false;
for (const cmd of converters) {
  try {
    execSync(cmd, { stdio: "pipe" });
    console.log("PDF report written: reports/quality-report.pdf (via " + cmd.split(" ")[0] + ")");
    pdfDone = true;
    break;
  } catch (e) { /* try next converter */ }
}
if (!pdfDone) console.error("PDF conversion failed: neither wkhtmltopdf nor weasyprint is available. HTML report is still archived.");

console.log(`\nRESULT: ${passed}/${total} checks passed`);
process.exit(allPassed ? 0 : 1);   // fail -> non-zero -> Jenkins stage red -> merge nahi hoga

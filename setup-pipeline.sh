#!/bin/bash
set -e
mkdir -p ci

cat > .gitlab-ci.yml << 'EOF'
stages:
  - validate
  - security
  - lint
  - test
  - build
  - smoke
  - package
  - deploy-staging
  - verify-staging
  - deploy-prod
  - verify-prod
  - rollback

variables:
  STAGING_DIR: /var/www/portfolio-staging
  PROD_DIR: /var/www/portfolio
  STAGING_URL: "https://staging.muazbhutta.online"
  PROD_URL: "https://muazbhutta.online"

default:
  before_script:
    - set -o pipefail
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]

validate:repo:
  stage: validate
  script:
    - node --version
    - test -f index.html
    - node -e "JSON.parse(require('fs').readFileSync('package.json'))"
    - echo "Repo OK"

security:secret-scan:
  stage: security
  needs: []
  script:
    - mkdir -p reports
    - bash ci/secret-scan.sh | tee reports/secret-scan.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

lint:html:
  stage: lint
  needs: ["validate:repo"]
  script:
    - npm ci --prefer-offline || npm install
    - mkdir -p reports
    - npm run lint:html 2>&1 | tee reports/lint-html.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

lint:css:
  stage: lint
  needs: ["validate:repo"]
  script:
    - npm ci --prefer-offline || npm install
    - mkdir -p reports
    - npm run lint:css 2>&1 | tee reports/lint-css.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

lint:js:
  stage: lint
  needs: ["validate:repo"]
  script:
    - npm ci --prefer-offline || npm install
    - mkdir -p reports
    - npm run lint:js 2>&1 | tee reports/lint-js.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

test:html-validate:
  stage: test
  needs: ["lint:html", "lint:css", "lint:js"]
  script:
    - npm ci --prefer-offline || npm install
    - mkdir -p reports
    - npm run validate:html 2>&1 | tee reports/html-validate.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

build:site:
  stage: build
  needs: ["test:html-validate", "security:secret-scan"]
  script:
    - npm ci --prefer-offline || npm install
    - npm run build
    - cat dist/build-info.json
  artifacts:
    paths: [dist/]
    expire_in: 1 week

smoke:dist:
  stage: smoke
  needs: ["build:site"]
  script:
    - npm ci --prefer-offline || npm install
    - mkdir -p reports
    - npm run test:smoke | tee reports/smoke.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week

package:release:
  stage: package
  needs: ["smoke:dist"]
  script:
    - VERSION=$(node -p "require('./dist/build-info.json').version")
    - tar -czf "portfolio-${VERSION}.tar.gz" -C dist .
    - ls -lh portfolio-*.tar.gz
  artifacts:
    paths: ["portfolio-*.tar.gz", dist/]
    expire_in: 4 weeks

deploy:staging:
  stage: deploy-staging
  needs: ["package:release"]
  environment:
    name: staging
    url: $STAGING_URL
  script:
    - mkdir -p "$STAGING_DIR"
    - rsync -a --delete dist/ "$STAGING_DIR"/
    - echo "Deployed to staging"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

verify:staging:
  stage: verify-staging
  needs: ["deploy:staging"]
  script:
    - mkdir -p reports
    - curl -fsS "$STAGING_URL" -o /dev/null && echo "Staging OK"
    - curl -fsS "$STAGING_URL/build-info.json" | tee reports/staging-verify.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy:production:
  stage: deploy-prod
  needs: ["verify:staging"]
  environment:
    name: production
    url: $PROD_URL
  when: manual
  script:
    - mkdir -p "$PROD_DIR"
    - rsync -a --delete "$PROD_DIR"/ "${PROD_DIR}.previous"/ || true
    - rsync -a --delete dist/ "$PROD_DIR"/
    - echo "Deployed to production"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

verify:production:
  stage: verify-prod
  needs: ["deploy:production"]
  script:
    - mkdir -p reports
    - curl -fsS "$PROD_URL" -o /dev/null && echo "Production OK"
    - curl -fsS "$PROD_URL/build-info.json" | tee reports/prod-verify.txt
  artifacts:
    when: always
    paths: [reports/]
    expire_in: 1 week
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

rollback:production:
  stage: rollback
  needs: ["deploy:production"]
  when: manual
  script:
    - test -d "${PROD_DIR}.previous" || (echo "No previous release" && exit 1)
    - rsync -a --delete "${PROD_DIR}.previous"/ "$PROD_DIR"/
    - echo "ROLLED BACK"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
EOF

cat > package.json << 'EOF'
{
  "name": "muazbhutta-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "lint:html": "htmlhint index.html",
    "lint:css": "stylelint \"*.css\"",
    "lint:js": "eslint .",
    "validate:html": "html-validate index.html",
    "test:smoke": "node ci/smoke-test.js",
    "build": "node ci/build.js"
  },
  "devDependencies": {
    "eslint": "^10.6.0",
    "html-validate": "^11.5.5",
    "htmlhint": "^1.9.2",
    "stylelint": "^17.14.0",
    "stylelint-config-standard": "^40.0.0"
  }
}
EOF

cat > eslint.config.mjs << 'EOF'
export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "ci/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        document: "readonly", window: "readonly", console: "readonly",
        localStorage: "readonly", fetch: "readonly", setTimeout: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  }
];
EOF

cat > .htmlhintrc << 'EOF'
{
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "doctype-first": true,
  "id-unique": true,
  "src-not-empty": true,
  "title-require": true
}
EOF

cat > .stylelintrc.json << 'EOF'
{ "extends": "stylelint-config-standard" }
EOF

cat > ci/secret-scan.sh << 'EOF'
#!/usr/bin/env bash
set -u
PATTERNS=(
  "AKIA[0-9A-Z]{16}"
  "-----BEGIN( RSA| EC| OPENSSH)? PRIVATE KEY-----"
  "ghp_[A-Za-z0-9]{36}"
  "glpat-[A-Za-z0-9_-]{20,}"
)
FOUND=0
for p in "${PATTERNS[@]}"; do
  hits=$(grep -rInE --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="secret-scan.sh" -e "$p" . || true)
  if [ -n "$hits" ]; then
    echo "POTENTIAL SECRET FOUND (pattern: $p):"
    echo "$hits"
    FOUND=1
  fi
done
if [ "$FOUND" -eq 1 ]; then
  echo "SECRET SCAN FAILED"
  exit 1
fi
echo "SECRET SCAN PASSED - no credentials detected"
EOF
chmod +x ci/secret-scan.sh

cat > ci/build.js << 'EOF'
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
EOF

cat > ci/smoke-test.js << 'EOF'
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
EOF

echo ""
echo "=== FILES CREATED ==="
ls -la .gitlab-ci.yml package.json eslint.config.mjs .htmlhintrc .stylelintrc.json ci/

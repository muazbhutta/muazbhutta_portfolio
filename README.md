<div align="center">

# 🌐 Muaz Bhutta — Portfolio

**A blazing-fast, zero-dependency static portfolio with automated CI/CD deployment**

[![Live Site](https://img.shields.io/badge/Live-muazbhutta.online-2ea44f?style=for-the-badge&logo=googlechrome&logoColor=white)](https://muazbhutta.online)
[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](#-cicd--auto-deploy-on-every-push)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Caddy](https://img.shields.io/badge/Caddy-1F88C0?style=flat-square&logo=caddy&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![rsync](https://img.shields.io/badge/rsync-CC0000?style=flat-square&logo=gnubash&logoColor=white)

*No build step. No framework. No node_modules black hole. Just clean HTML/CSS/JS — deployed automatically to a self-hosted VPS on every push.*

[Live Demo](https://muazbhutta.online) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📁 File Structure](#-file-structure)
- [✏️ Updating Content](#️-updating-content-the-important-part)
- [🚀 Getting Started](#-getting-started)
  - [Run Locally](#step-1--run-it-locally)
  - [Push to GitHub](#step-2--push-to-github)
  - [Manual Deploy](#step-3--manual-deploy-to-the-vps)
  - [CI/CD Setup](#step-4--cicd--auto-deploy-on-every-push)
- [🔁 Deployment Flow](#-deployment-flow)
- [🛠️ Tech Stack](#️-tech-stack)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Fully Static** | Zero dependencies beyond Google Fonts — loads instantly |
| 🌗 **Light / Dark / Auto Theme** | Auto mode follows the visitor's system setting and updates **live** if it changes |
| 📜 **Scroll-Reveal Timeline** | Animated career timeline, fully responsive down to mobile |
| 🗂️ **Single-File Content** | All content lives in `data.js` — edit one file, never touch markup |
| 🤖 **Auto-Deploy CI/CD** | Every push to `main` deploys to the VPS via GitHub Actions + rsync |
| 🔒 **Self-Hosted** | Served by Caddy with automatic HTTPS on a personal VPS |

---

## 🏗️ Architecture

```
┌─────────────┐     git push      ┌──────────────────┐
│  Developer  │ ────────────────▶ │  GitHub (main)   │
└─────────────┘                   └────────┬─────────┘
                                           │ triggers
                                           ▼
                                  ┌──────────────────┐
                                  │  GitHub Actions  │
                                  │  (deploy.yml)    │
                                  └────────┬─────────┘
                                           │ rsync over SSH
                                           ▼
┌─────────────┐    HTTPS (443)   ┌──────────────────┐
│   Visitor   │ ◀──────────────── │   VPS + Caddy    │
└─────────────┘   auto-SSL 🔒     │ /var/www/portfolio│
                                  └──────────────────┘
```

---

## 📁 File Structure

```
portfolio/
├── index.html                     → page structure
├── style.css                      → design & theme tokens
├── script.js                      → renders data.js into the page (no need to edit)
├── data.js                        → ⭐ EDIT THIS FILE to add content
├── .gitignore                     → keeps secrets & system files out of git
└── .github/
    └── workflows/
        └── deploy.yml             → auto-deploy pipeline
```

---

## ✏️ Updating Content (the important part)

To add a new project, open **`data.js`** and add an object to the `PROJECTS` array:

```js
{
  id: "unique-id",
  title: "Project Name",
  summary: "1–2 line description.",
  stack: ["Tech1", "Tech2"],
  link: "https://...",   // or "#" if there's no link
  status: "production",  // "production" or "lab"
},
```

> 💡 **Skills, credentials, About paragraphs, and the career timeline all work the same way** — add or edit an object in the matching array. Nothing in `index.html`, `style.css`, or `script.js` ever needs to change.

---

## 🚀 Getting Started

### Step 1 — Run it locally

These are static files, so "running" it just means opening it in a browser:

**Option A (simplest):**
```
double-click index.html
```

**Option B (recommended — mirrors production behavior):**
```bash
python3 -m http.server 8000
```
Then open **http://localhost:8000**. This matches how Caddy serves the files on the VPS, so local behavior = production behavior.

---

### Step 2 — Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

Why this matters:
1. 📌 Your code becomes **version-controlled** — every change is tracked
2. 🤖 It becomes the **trigger source** for the CI/CD pipeline — every push to `main` auto-deploys

---

### Step 3 — Manual Deploy to the VPS

*(first time, or without CI/CD)*

The VPS already runs Caddy serving `muazbhutta.online` — just copy files into the directory Caddy points at:

```bash
# from your local machine
rsync -avz --delete ./portfolio/ user@your-server-ip:/var/www/portfolio/
```

Confirm the Caddyfile block:

```caddy
muazbhutta.online {
    root * /var/www/portfolio
    file_server
}
```

Then reload:

```bash
sudo systemctl reload caddy
```

✅ **`https://muazbhutta.online` is now live** — Caddy handles SSL automatically.

> 🔀 **Want a subdomain instead?** (e.g. `portfolio.muazbhutta.online`) — add a new Caddyfile block with the same directives, using the subdomain as the site address.

---

### Step 4 — CI/CD: Auto-Deploy on Every Push

`.github/workflows/deploy.yml` uses **GitHub Actions** to rsync files to the VPS over SSH on every push to `main`.

#### 🔑 Required Repository Secrets

Go to: **Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | Your VPS IP address |
| `DEPLOY_USER` | SSH username on the VPS |
| `DEPLOY_PORT` | `22` (or your custom SSH port) |
| `DEPLOY_PATH` | `/var/www/portfolio/` |
| `DEPLOY_SSH_KEY` | Private SSH deploy key *(see below)* |

#### 🗝️ Generating a Dedicated Deploy Key *(best practice)*

```bash
# on your local machine
ssh-keygen -t ed25519 -C "github-deploy" -f ./deploy_key -N ""
```

This creates `deploy_key` (private) + `deploy_key.pub` (public).

Authorize the **public** key on the VPS:

```bash
ssh-copy-id -i deploy_key.pub user@your-server-ip
```

*(or manually append `deploy_key.pub` contents to `~/.ssh/authorized_keys` on the VPS)*

Then paste the **full contents of `deploy_key`** (the private key) into the `DEPLOY_SSH_KEY` secret on GitHub.

> ⚠️ **Never commit the private key to the repo.** It lives only in GitHub Secrets. The included `.gitignore` blocks `*.key` and `.ssh/` as a safety net.

#### 🧪 Testing the Pipeline

```bash
# make a small change, e.g. add a project in data.js
git add .
git commit -m "Add new project"
git push
```

Watch the **Actions** tab → pipeline runs → within **30–60 seconds** the change is live. No manual rsync. No SSH. ✨

---

## 🔁 Deployment Flow

```
Edit data.js (add a project / skill / timeline entry)
        │
        ▼
git add . && git commit -m "update" && git push
        │
        ▼
GitHub Actions triggers automatically
        │
        ▼
rsync copies files to VPS over SSH
        │
        ▼
Caddy is already serving → change is LIVE 🎉
```

**From now on: edit `data.js`, push, done.** Everything else is automatic.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Vanilla HTML5 / CSS3 / JS | Zero build step, instant loads, easy maintenance |
| **Theming** | CSS custom properties + `prefers-color-scheme` | Native Light/Dark/Auto with live OS sync |
| **Web Server** | [Caddy](https://caddyserver.com/) | Automatic HTTPS, dead-simple config |
| **CI/CD** | GitHub Actions | Free, integrated, zero-maintenance pipeline |
| **Transport** | rsync over SSH | Fast delta transfers — only changed files move |
| **Hosting** | Self-hosted VPS | Full control, part of a larger self-hosted infra lab |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Muaz Bhutta** — Junior Network / Cloud & DevOps Engineer

[![Website](https://img.shields.io/badge/Website-muazbhutta.online-2ea44f?style=flat-square&logo=googlechrome&logoColor=white)](https://muazbhutta.online)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)

<div align="center">

⭐ **If this repo helped you build your own portfolio pipeline, consider giving it a star!** ⭐

*Built with ❤️ and zero frameworks*

</div>

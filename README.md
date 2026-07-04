<div align="center">

# 🌐 Muaz Bhutta — Portfolio

**A simple, zero-dependency personal portfolio built with plain HTML, CSS & JavaScript**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

_No build step. No framework. No CI/CD. No node_modules. Just clean HTML/CSS/JS you can open in a browser._

</div>

---

## ✨ What's inside

- 🌗 **Great themes** — Light, Dark, and Auto modes. Auto follows your system setting and switches **live** if you change it.
- ⚡ **Fully static** — zero dependencies beyond Google Fonts, so it loads instantly.
- 📜 **Scroll-reveal timeline** — an animated, fully responsive career timeline.
- 🗂️ **Single-file content** — everything lives in `data.js`. Edit one file, never touch the markup.
- 📱 **Responsive** — looks good from desktop down to mobile.

---

## 📁 File Structure

```
portfolio/
├── index.html    → page structure
├── style.css     → design & theme tokens
├── script.js     → renders data.js into the page (no need to edit)
└── data.js       → ⭐ EDIT THIS FILE to add your content
```

---

## ✏️ Making it yours

All your content lives in **`data.js`** — name, about text, skills, projects, and credentials are just objects in arrays. To add a new project, add an object to the `PROJECTS` array:

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

> 💡 Skills, credentials, About paragraphs, and the timeline all work the same way — add or edit an object in the matching array. Nothing in `index.html`, `style.css`, or `script.js` needs to change.

---

## 🚀 Running it

These are static files, so "running" it just means opening it in a browser.

**Option A (simplest):** double-click `index.html`

**Option B (recommended):**

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000**.

That's it — no build, no dependencies, no pipeline.

---

## 🙌 Want to use it?

Go for it! Feel free to clone or download this project and use it as a starting point for your own portfolio. Just swap out the content in `data.js` for your own and you're done.

---

## 📬 Contact

**Muaz Bhutta** — Cloud & Network Infrastructure Engineer

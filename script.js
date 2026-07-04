// ============================================================
// RENDER LOGIC — you shouldn't need to touch this file.
// To add or change content, edit data.js instead.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  renderHero();
  renderAbout();
  renderCareerPath();
  renderSkills();
  renderProjects();
  renderCredentials();
  renderContact();
  renderFooter();
});

// ----------------------------------------------------------------
// THEME — three modes: light, dark, auto (follows system setting)
// ----------------------------------------------------------------
function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-mode-label");
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const modes = ["light", "dark", "auto"];

  function resolve(mode) {
    if (mode === "auto") return media.matches ? "light" : "dark";
    return mode;
  }

  function apply(mode) {
    root.setAttribute("data-theme-mode", mode);
    root.setAttribute("data-theme", resolve(mode));
    if (label) label.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    localStorage.setItem("themeMode", mode);
  }

  let currentMode = localStorage.getItem("themeMode") || "auto";
  apply(currentMode);

  toggle.addEventListener("click", () => {
    const next = modes[(modes.indexOf(currentMode) + 1) % modes.length];
    currentMode = next;
    apply(currentMode);
  });

  media.addEventListener("change", () => {
    if (currentMode === "auto") apply("auto");
  });
}

// ----------------------------------------------------------------
// HERO
// ----------------------------------------------------------------
function renderHero() {
  document.getElementById("hero-title").innerHTML =
    `Hi, I'm ${SITE.name}.<br><span class="accent">${SITE.role}</span>`;
  document.getElementById("hero-tagline").textContent = SITE.tagline;

  const cta = document.getElementById("hero-cta");
  cta.appendChild(makeLink("View Projects", "#projects", "btn btn-primary"));
  cta.appendChild(makeLink("Get in Touch", "#contact", "btn btn-ghost"));
  if (SITE.resumeLink && SITE.resumeLink !== "#") {
    cta.appendChild(makeLink("Download Resume", SITE.resumeLink, "btn btn-ghost", true));
  }

  document.getElementById("id-avatar").textContent = SITE.initials;
  document.getElementById("id-name").textContent = SITE.name;
  document.getElementById("id-role").textContent = SITE.role;
  document.getElementById("id-location").textContent = SITE.location;
  document.getElementById("id-status").textContent = SITE.status;
}

function makeLink(text, href, className, external) {
  const a = document.createElement("a");
  a.href = href;
  a.className = className;
  a.textContent = text;
  if (external) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  return a;
}

// ----------------------------------------------------------------
// ABOUT
// ----------------------------------------------------------------
function renderAbout() {
  const container = document.getElementById("about-body");
  const mid = Math.ceil(ABOUT.length / 2);
  const columns = [ABOUT.slice(0, mid), ABOUT.slice(mid)];

  columns.forEach((paragraphs) => {
    const col = document.createElement("div");
    col.className = "about-col";
    paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      col.appendChild(p);
    });
    container.appendChild(col);
  });
}

// ----------------------------------------------------------------
// CAREER PATH (timeline)
// ----------------------------------------------------------------
function renderCareerPath() {
  const track = document.getElementById("path-track");
  CAREER_PATH.forEach((step) => {
    const div = document.createElement("div");
    div.className = "path-step";
    div.innerHTML = `
      <div class="step-label">${step.label}</div>
      <div class="step-detail">${step.detail}</div>
    `;
    track.appendChild(div);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".path-step").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".path-step").forEach((el) => el.classList.add("in-view"));
  }
}

// ----------------------------------------------------------------
// SKILLS
// ----------------------------------------------------------------
function renderSkills() {
  const grid = document.getElementById("skills-grid");
  SKILLS.forEach((group) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="group-title">${group.group}</div>
      ${group.items.map((item) => `<div class="skill-item">${item}</div>`).join("")}
    `;
    grid.appendChild(card);
  });
}

// ----------------------------------------------------------------
// PROJECTS
// ----------------------------------------------------------------
function renderProjects() {
  const list = document.getElementById("proj-list");
  PROJECTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "proj-card";
    card.innerHTML = `
      <div class="proj-top">
        <h3 class="heading-md">${p.title}</h3>
        <span class="status-tag" data-status="${p.status}">${p.status}</span>
      </div>
      <p>${p.summary}</p>
      <div class="stack-row">
        ${p.stack.map((s) => `<span class="stack-tag">${s}</span>`).join("")}
      </div>
      ${p.link && p.link !== "#" ? `<a class="proj-link" href="${p.link}" target="_blank" rel="noopener">View project →</a>` : ""}
    `;
    list.appendChild(card);
  });
}

// ----------------------------------------------------------------
// CREDENTIALS
// ----------------------------------------------------------------
function renderCredentials() {
  const list = document.getElementById("cred-list");
  CREDENTIALS.forEach((c) => {
    const row = document.createElement("div");
    row.className = "cred-row";
    row.innerHTML = `
      <div>
        <div class="title">${c.title}</div>
        <div class="org">${c.org}</div>
      </div>
      <div class="year">${c.year}</div>
    `;
    list.appendChild(row);
  });
}

// ----------------------------------------------------------------
// CONTACT
// ----------------------------------------------------------------
function renderContact() {
  document.getElementById("contact-text").textContent =
    "Open to job opportunities, collaborations, or just talking networking and cloud — reach out any time.";

  const links = document.getElementById("contact-links");
  const items = [
    { label: "Email", href: `mailto:${SITE.email}` },
    { label: "GitHub", href: SITE.github },
    { label: "LinkedIn", href: SITE.linkedin },
  ];
  items.forEach((item, i) => {
    const a = document.createElement("a");
    a.className = i === 0 ? "btn btn-primary" : "btn btn-ghost";
    a.href = item.href;
    a.target = item.href.startsWith("mailto") ? "_self" : "_blank";
    a.rel = "noopener";
    a.textContent = item.label;
    links.appendChild(a);
  });
}

// ----------------------------------------------------------------
// FOOTER
// ----------------------------------------------------------------
function renderFooter() {
  document.getElementById("footer-text").textContent =
    `© ${new Date().getFullYear()} ${SITE.name} — built & deployed from scratch.`;
}

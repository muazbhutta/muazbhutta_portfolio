/*
  ============================================================
  DATA FILE — this is the only file you should need to touch.
  To add a new project, skill, or credential, add a new object
  to the relevant array below. The layout/design does not need
  to change — everything renders automatically from here.
  ============================================================
*/

const SITE = {
  name: "Muaz Bhutta",
  initials: "MB",
  role: "Cloud & Network Infrastructure Engineer",
  tagline:
    "I build infrastructure that runs — and I understand exactly why it runs. From routing tables to container orchestration, from VPNs to observability stacks.",
  location: "Jeddah / Riyadh, Saudi Arabia",
  status: "Open to work",
  email: "you@muazbhutta.online", // put your real email here
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  resumeLink: "#", // link to your resume PDF, e.g. /assets/resume.pdf
};

// About section — short paragraphs, rendered as two columns.
const ABOUT = [
  "I'm a Cloud & Network Infrastructure Engineer based between Jeddah and Riyadh, with a background in Computer Science and hands-on experience across routing, virtualization, and cloud platforms.",
  "My foundation is networking — CCNA-level routing and switching, VLAN design, and VPN architecture. I extended that into the cloud with AWS and self-managed Linux infrastructure, treating every VPS like a production environment.",
  "I learn by building and breaking things on my own servers: VPN dashboards, monitoring stacks, and internal APIs that I design, deploy, and keep running end to end.",
  "I'm currently looking for a junior network or cloud engineering role in Saudi Arabia, where I can bring that same hands-on discipline to a team solving real infrastructure problems.",
];

// Career path — used for the timeline under the About section.
const CAREER_PATH = [
  { step: 1, label: "Multan, Pakistan", detail: "BS in Computer Science" },
  { step: 2, label: "CCNA", detail: "Routing & switching foundations" },
  { step: 3, label: "AWS + Linux", detail: "Cloud platforms & systems administration" },
  { step: 4, label: "Self-hosted labs", detail: "VPNs, monitoring, and APIs — running live on a VPS" },
  { step: 5, label: "Jeddah / Riyadh", detail: "Target: Junior Network / Cloud Engineer" },
];

// Skills, grouped by category.
const SKILLS = [
  { group: "Networking", items: ["CCNA (R&S)", "VLANs & Subnetting", "OpenVPN", "WireGuard"] },
  { group: "Cloud", items: ["AWS (EC2, S3, IAM)", "VPS Administration", "Caddy / Nginx", "DNS & Domain Management"] },
  { group: "DevOps", items: ["Docker & Compose", "Prometheus + Grafana", "CI/CD (GitHub Actions)", "Bash Scripting"] },
  { group: "Development", items: ["Linux (Ubuntu/Debian)", "Python + Flask", "REST APIs", "Git / GitHub"] },
];

// Projects. Add a new object here to add a new project card.
// status: "production" or "lab"
const PROJECTS = [
  {
    id: "vpn-dashboard",
    title: "OpenVPN Management Dashboard",
    summary:
      "A full VPN control panel built and deployed on my own VPS — live client monitoring, connection status, and real-time updates via Server-Sent Events.",
    stack: ["Flask", "OpenVPN", "Easy-RSA", "SSE", "Linux"],
    link: "#",
    status: "production",
  },
  {
    id: "monitoring-stack",
    title: "Prometheus + Grafana Monitoring",
    summary:
      "A monitoring stack deployed with Docker Compose — Node Exporter collects system metrics, visualized on Grafana dashboards in real time.",
    stack: ["Docker Compose", "Prometheus", "Grafana", "Node Exporter"],
    link: "#",
    status: "production",
  },
  {
    id: "system-api",
    title: "Real-Time System Status API",
    summary:
      "A Flask API that streams live CPU, RAM, and disk metrics via psutil over Server-Sent Events, paired with a dark-themed live dashboard.",
    stack: ["Python", "Flask", "psutil", "SSE"],
    link: "#",
    status: "production",
  },
  {
    id: "wireguard-lab",
    title: "WireGuard VPN Lab",
    summary:
      "A WireGuard setup with WGDashboard integration, including troubleshooting mobile connectivity issues caused by carrier-level UDP blocking.",
    stack: ["WireGuard", "WGDashboard", "Networking"],
    link: "#",
    status: "lab",
  },
  {
    id: "this-site",
    title: "This Portfolio",
    summary:
      "A static site that deploys itself to my own VPS through GitHub Actions — the CI/CD pipeline is itself part of this project.",
    stack: ["HTML/CSS/JS", "GitHub Actions", "Caddy", "VPS"],
    link: "https://github.com/yourusername/portfolio",
    status: "production",
  },
];

// Certifications / education.
const CREDENTIALS = [
  { title: "BS Computer Science", org: "University", year: "" },
  { title: "CCNA (200-301)", org: "Cisco", year: "In progress" },
  { title: "AWS Cloud Practitioner", org: "Amazon Web Services", year: "" },
];

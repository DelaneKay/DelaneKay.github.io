const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector("#scroll-progress-bar");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNavigation = document.querySelector(".mobile-nav");
const backToTop = document.querySelector(".back-to-top");
const projectDialog = document.querySelector("#project-dialog");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const projectDetails = {
  "landing-zone": {
    index: "PROJECT 01 / PLANNED",
    title: "Secure AWS Landing Zone",
    summary:
      "A small but production-minded multi-account AWS foundation that demonstrates governance, security service delegation, centralized evidence, and a repeatable Terraform deployment.",
    question:
      "How can a growing organization create preventative guardrails and centralized visibility without blocking workload teams from shipping?",
    evidence: [
      "Architecture diagram mapped to the AWS Security Reference Architecture",
      "Terraform modules and documented account/OU decisions",
      "Organization CloudTrail, Config aggregation, and log archive design",
      "Security Hub and GuardDuty delegated-administrator workflow",
    ],
    validation: [
      "Intentional guardrail violation tests",
      "Cross-account finding and log-delivery evidence",
      "Configuration drift and recovery demonstration",
    ],
    tags: ["AWS Organizations", "Terraform", "CloudTrail", "AWS Config", "Security Hub"],
  },
  "detection-pipeline": {
    index: "PROJECT 02 / PLANNED",
    title: "Threat Detection Pipeline",
    summary:
      "An event-driven detection workflow that turns a GuardDuty finding into an enriched, prioritized alert and safely automates containment for a controlled test scenario.",
    question:
      "How can cloud findings move from raw signal to an actionable, auditable response with minimal analyst delay?",
    evidence: [
      "Detection and response architecture with trust boundaries",
      "EventBridge routing and Lambda enrichment code",
      "Severity-based notification and containment logic",
      "Incident timeline with CloudTrail evidence",
    ],
    validation: [
      "Controlled GuardDuty sample finding",
      "Unit tests for enrichment and routing logic",
      "Containment rollback and failure-path testing",
    ],
    tags: ["GuardDuty", "EventBridge", "Lambda", "SNS", "CloudTrail", "Python"],
  },
  "iam-lab": {
    index: "PROJECT 03 / PLANNED",
    title: "IAM Least-Privilege Lab",
    summary:
      "A practical identity lab that moves from broad permissions to role-based, condition-aware policies supported by access analysis and CloudTrail evidence.",
    question:
      "How can engineers receive the access they need while reducing standing privilege, unintended resource access, and policy ambiguity?",
    evidence: [
      "Identity personas and access decision matrix",
      "Federated roles, permission boundaries, and policy conditions",
      "SCP guardrails and IAM Access Analyzer findings",
      "Before-and-after policy comparison",
    ],
    validation: [
      "Positive and negative authorization tests",
      "Privilege-escalation path review",
      "CloudTrail verification for assumed-role activity",
    ],
    tags: ["AWS IAM", "Identity Center", "Access Analyzer", "SCPs", "CloudTrail"],
  },
  "secure-pipeline": {
    index: "PROJECT 04 / PLANNED",
    title: "Secure Terraform Pipeline",
    summary:
      "A keyless GitHub Actions delivery pipeline that scans Terraform, evaluates policy, separates plan from apply, and produces clear deployment evidence.",
    question:
      "How can infrastructure teams deploy to AWS without long-lived credentials while enforcing useful security checks before change?",
    evidence: [
      "GitHub OIDC trust configuration and scoped AWS role",
      "Terraform formatting, validation, scanning, and policy gates",
      "Human-readable plan artifact and approval boundary",
      "Post-deployment verification and audit trail",
    ],
    validation: [
      "Intentionally insecure Terraform test cases",
      "OIDC claim and permission-boundary tests",
      "Protected deployment environment demonstration",
    ],
    tags: ["Terraform", "GitHub Actions", "AWS OIDC", "Checkov", "Policy as code"],
  },
};

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#07111f" : "#f1f5f8");
}

const storedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
setTheme(storedTheme || preferredTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

function closeMobileNavigation() {
  if (!menuToggle || !mobileNavigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileNavigation.hidden = true;
}

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
  mobileNavigation.hidden = expanded;
});

mobileNavigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNavigation();
});

function handleScroll() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  header?.classList.toggle("is-scrolled", scrollTop > 28);
  backToTop?.classList.toggle("is-visible", scrollTop > window.innerHeight * 0.65);
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion.matches) {
  revealElements.forEach((element) => element.classList.add("is-revealed"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add("is-revealed"), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -35px" },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
const trackedSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visibleEntry.target.id}`);
    });
  },
  { threshold: [0.25, 0.55], rootMargin: "-20% 0px -55%" },
);

trackedSections.forEach((section) => sectionObserver.observe(section));

const countElements = document.querySelectorAll(".count-up");
const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.target);
      const duration = prefersReducedMotion.matches ? 0 : 1000;
      const started = performance.now();

      function updateCount(now) {
        const elapsed = duration === 0 ? 1 : Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        element.textContent = String(Math.round(target * eased));
        if (elapsed < 1) requestAnimationFrame(updateCount);
      }

      requestAnimationFrame(updateCount);
      observer.unobserve(element);
    });
  },
  { threshold: 0.8 },
);
countElements.forEach((element) => countObserver.observe(element));

const rotatingPhrase = document.querySelector(".rotating-phrase");
const phrases = [
  "identity-first security.",
  "detectable cloud systems.",
  "secure infrastructure as code.",
  "automated defensive controls.",
];
let phraseIndex = 0;

if (rotatingPhrase && !prefersReducedMotion.matches) {
  window.setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    rotatingPhrase.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-5px)", offset: 0.45 },
        { opacity: 0, transform: "translateY(5px)", offset: 0.55 },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 480, easing: "ease-out" },
    );
    window.setTimeout(() => {
      rotatingPhrase.textContent = phrases[phraseIndex];
    }, 235);
  }, 3200);
}

const signalText = document.querySelector("#signal-text");
const signalIndex = document.querySelector(".signal-index");
const signals = [
  "Automate the control. Preserve the evidence.",
  "Identity before access. Context before trust.",
  "Make telemetry useful before making it loud.",
  "Treat infrastructure changes as security events.",
];
let signalPosition = 0;

if (signalText && signalIndex && !prefersReducedMotion.matches) {
  window.setInterval(() => {
    signalPosition = (signalPosition + 1) % signals.length;
    signalText.animate([{ opacity: 0.25 }, { opacity: 1 }], {
      duration: 420,
      easing: "ease-out",
    });
    signalText.textContent = signals[signalPosition];
    signalIndex.textContent = `0${signalPosition + 1} / 04`;
  }, 4200);
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    document.querySelectorAll(".project-card").forEach((card) => {
      const isVisible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !isVisible);
    });
  });
});

function populateList(element, values) {
  if (!element) return;
  element.replaceChildren(
    ...values.map((value) => {
      const listItem = document.createElement("li");
      listItem.textContent = value;
      return listItem;
    }),
  );
}

function openProjectDialog(projectKey) {
  const project = projectDetails[projectKey];
  if (!project || !projectDialog) return;

  document.querySelector("#dialog-index").textContent = project.index;
  document.querySelector("#dialog-title").textContent = project.title;
  document.querySelector("#dialog-summary").textContent = project.summary;
  document.querySelector("#dialog-question").textContent = project.question;
  populateList(document.querySelector("#dialog-evidence"), project.evidence);
  populateList(document.querySelector("#dialog-validation"), project.validation);

  const tagContainer = document.querySelector("#dialog-tags");
  tagContainer.replaceChildren(
    ...project.tags.map((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      return tagElement;
    }),
  );

  projectDialog.showModal();
  body.style.overflow = "hidden";
}

function closeProjectDialog() {
  projectDialog?.close();
  body.style.overflow = "";
}

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => openProjectDialog(button.dataset.project));
});

document.querySelector(".dialog-close")?.addEventListener("click", closeProjectDialog);
projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) closeProjectDialog();
});
projectDialog?.addEventListener("close", () => {
  body.style.overflow = "";
});

if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    },
    { passive: true },
  );

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateX(0) rotateY(0)";
    });
  });
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const credentialLinks = new Map([
  [
    "Solutions Architect - Associate",
    "https://www.credly.com/badges/4aa5870f-28d2-436b-b6f0-0952cbf98d85",
  ],
  [
    "Certified in Cybersecurity (CC)",
    "https://www.credly.com/badges/5f29d332-e4d0-468a-8038-97cc4dcd5a53",
  ],
  [
    "Google Cybersecurity",
    "https://www.coursera.org/account/accomplishments/professional-cert/certificate/W9P8IENM2OXH",
  ],
  ["Qualys VMDR", "https://www.qualys.com/training/course/vmdr/"],
  [
    "Linux for Blue Team",
    "https://app.letsdefend.io/my-rewards/detail/7923f7a8e1a548deb6b58f5a28268f3d",
  ],
  [
    "Mastercard Cybersecurity",
    "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/mfxGwGDp6WkQmtmTf/vcKAB5yYAgvemepGQ_mfxGwGDp6WkQmtmTf_68baf13ef5560a86b27107e9_1757088347851_completion_certificate.pdf",
  ],
  [
    "CCNA Routing & Switching",
    "https://www.linkedin.com/in/kudakwashe-delan-sibanda/details/certifications/",
  ],
  [
    "MTA: Introduction to Programming Using Python",
    "https://www.youracclaim.com/badges/e4cf5c51-f6b5-4219-9526-df4b2a9cc87a",
  ],
  [
    "Ultimate AWS Certified Security Specialty (SCS-C03) Preparation",
    "https://www.udemy.com/certificate/UC-ad1cd0ec-5bbb-4c31-8461-14282031aa8a/",
  ],
]);

const credentialGrid = document.querySelector(".credential-grid");
if (credentialGrid) {
  const originalCards = [...credentialGrid.querySelectorAll(".credential-card")];
  const featuredCard = originalCards.find(
    (card) => card.querySelector("h3")?.textContent.trim() === "Ultimate AWS Certified Security Specialty (SCS-C03) Preparation",
  );
  if (featuredCard) credentialGrid.prepend(featuredCard);

  [...credentialGrid.querySelectorAll(".credential-card")].forEach((card, index) => {
    const title = card.querySelector("h3")?.textContent.trim();
    const verificationUrl = credentialLinks.get(title);
    if (!verificationUrl) return;

    card.dataset.delay = String(index * 60);
    card.classList.add("is-linked");
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Verify ${title} credential - opens in a new tab`);

    const verifyCue = document.createElement("small");
    verifyCue.className = "credential-verify";
    verifyCue.textContent = "Verify credential \u2197";
    card.append(verifyCue);
    const openCredential = () => window.open(verificationUrl, "_blank", "noopener,noreferrer");
    card.addEventListener("click", openCredential);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openCredential();
    });
  });
}

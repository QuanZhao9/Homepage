const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 14);
};

const closeMenu = () => {
  navigation?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  navigation?.classList.toggle("is-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.hash === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const alignHashTarget = () => document.querySelector(window.location.hash)?.scrollIntoView();
  window.requestAnimationFrame(alignHashTarget);
  window.setTimeout(alignHashTarget, 120);
  window.setTimeout(alignHashTarget, 420);
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const researchAreas = {
  interfaces: {
    kicker: "01 / INTERFACE DYNAMICS",
    title: "Modeling and simulation of evolving interfaces.",
    description:
      "Free boundaries turn the geometry itself into an unknown. My work develops models and algorithms that accurately track this motion while respecting the underlying thermodynamic structure.",
    tags: ["Solid-state dewetting", "Sharp-interface models", "Parametric finite elements"],
    formula: "V<sub>n</sub> = Δ<sub>s</sub> κ",
    note: "geometry → variation → stable discretization",
  },
  geometry: {
    kicker: "02 / GEOMETRIC FLOWS",
    title: "Structure-preserving methods for evolving curves and surfaces.",
    description:
      "Geometric evolution equations connect curvature, energy, and motion. I study discretizations that reproduce dissipation, volume conservation, and tangential redistribution at the numerical level.",
    tags: ["Willmore flow", "Surface diffusion", "Biomembranes"],
    formula: "∂<sub>t</sub>Γ = −grad E(Γ)",
    note: "energy law → geometric motion → discrete stability",
  },
  multiphase: {
    kicker: "03 / MULTIPHASE SYSTEMS",
    title: "Coupled interface dynamics in complex fluids.",
    description:
      "Multiphase systems combine evolving geometry with fluid motion, contact lines, reactions, and junctions. The goal is a formulation that remains physically consistent and computationally robust.",
    tags: ["Moving contact lines", "Triple junctions", "ALE methods"],
    formula: "ρD<sub>t</sub>u = ∇·σ + f<sub>Γ</sub>",
    note: "fluid flow ↔ interface motion ↔ force balance",
  },
  computing: {
    kicker: "04 / NUMERICAL ANALYSIS",
    title: "Algorithms that retain the structure of the model.",
    description:
      "A numerical method should do more than approximate a solution. I focus on finite element schemes that preserve energy decay, conservation laws, and geometric invariants without sacrificing practical efficiency.",
    tags: ["Finite element analysis", "Energy stability", "Efficient solvers"],
    formula: "E<sup>m+1</sup> ≤ E<sup>m</sup>",
    note: "continuous principle → discrete analogue → computation",
  },
};

const researchButtons = [...document.querySelectorAll("[data-research]")];
const researchKicker = document.querySelector("[data-research-kicker]");
const researchTitle = document.querySelector("[data-research-title]");
const researchDescription = document.querySelector("[data-research-description]");
const researchTags = document.querySelector("[data-research-tags]");
const researchFormula = document.querySelector("[data-research-formula]");
const researchNote = document.querySelector("[data-research-note]");

const selectResearchArea = (key) => {
  const area = researchAreas[key];
  if (!area) return;

  researchButtons.forEach((button) => {
    const isActive = button.dataset.research === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    const action = button.querySelector("i");
    if (action) action.textContent = isActive ? "Exploring →" : "Open module →";
  });

  if (researchKicker) researchKicker.textContent = area.kicker;
  if (researchTitle) researchTitle.textContent = area.title;
  if (researchDescription) researchDescription.textContent = area.description;
  if (researchFormula) researchFormula.innerHTML = area.formula;
  if (researchNote) researchNote.textContent = area.note;
  if (researchTags) {
    researchTags.innerHTML = area.tags.map((tag) => `<li>${tag}</li>`).join("");
  }
};

researchButtons.forEach((button) => {
  button.addEventListener("click", () => selectResearchArea(button.dataset.research));
});

const publications = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
const publicationList = document.querySelector("[data-publication-list]");
const publicationHighlights = document.querySelector("[data-publication-highlights]");
const publicationSearch = document.querySelector("[data-publication-search]");
const publicationStatus = document.querySelector("[data-publication-status]");
const publicationFilters = [...document.querySelectorAll("[data-publication-filter]")];
const showAllButton = document.querySelector("[data-show-all]");

let activePublicationFilter = "all";
let publicationQuery = "";
let showAllPublications = false;
const initialPublicationLimit = 10;

document.querySelectorAll("[data-total-publications]").forEach((element) => {
  element.textContent = String(publications.length);
});

const collaboratorLine = (publication) =>
  publication.collaborators ? `With ${publication.collaborators}` : "Quan Zhao";

const renderHighlights = () => {
  if (!publicationHighlights) return;

  const highlights = publications.filter((publication) => publication.featured).slice(0, 4);
  publicationHighlights.innerHTML = highlights
    .map(
      (publication) => `
        <article class="highlight-card">
          <p class="highlight-meta">
            <span>${publication.type === "preprint" ? "Preprint" : "Published"}</span>
            <span>${publication.year}</span>
          </p>
          <h3>${publication.title}</h3>
          <p>${collaboratorLine(publication)}</p>
          <a href="${publication.link}" target="_blank" rel="noreferrer">
            ${publication.venue} ↗
          </a>
        </article>
      `,
    )
    .join("");
};

const matchesFilter = (publication) => {
  if (activePublicationFilter === "all") return true;
  if (activePublicationFilter === "preprint") return publication.type === "preprint";
  if (activePublicationFilter === "earlier") return publication.year <= 2024;
  return publication.year === Number(activePublicationFilter);
};

const matchesQuery = (publication) => {
  if (!publicationQuery) return true;
  const searchable = [
    publication.title,
    publication.collaborators,
    publication.venue,
    publication.year,
    publication.type,
  ]
    .join(" ")
    .toLowerCase();
  return searchable.includes(publicationQuery);
};

const renderPublications = () => {
  if (!publicationList) return;

  const filtered = publications.filter(
    (publication) => matchesFilter(publication) && matchesQuery(publication),
  );
  const visible = showAllPublications ? filtered : filtered.slice(0, initialPublicationLimit);

  if (visible.length === 0) {
    publicationList.innerHTML = '<li class="publication-empty">No publications match this search.</li>';
  } else {
    publicationList.innerHTML = visible
      .map(
        (publication) => `
          <li class="publication-item">
            <span class="publication-number">[${publication.number}]</span>
            <div class="publication-main">
              <h3>${publication.title}</h3>
              <p>${publication.type === "preprint" ? "Preprint" : "Published"} · ${collaboratorLine(publication)}</p>
            </div>
            <div class="publication-venue">
              <strong>${publication.year}</strong><br>${publication.venue}
            </div>
            <a href="${publication.link}" target="_blank" rel="noreferrer" aria-label="Open ${publication.title}">↗</a>
          </li>
        `,
      )
      .join("");
  }

  if (publicationStatus) {
    publicationStatus.textContent = `Showing ${visible.length} of ${filtered.length} matching records`;
  }

  if (showAllButton) {
    showAllButton.hidden = filtered.length <= initialPublicationLimit;
    showAllButton.textContent = showAllPublications
      ? "Show fewer publications ↑"
      : `Show all ${filtered.length} publications ↓`;
  }
};

publicationFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activePublicationFilter = button.dataset.publicationFilter;
    showAllPublications = false;
    publicationFilters.forEach((item) => item.classList.toggle("is-active", item === button));
    renderPublications();
  });
});

publicationSearch?.addEventListener("input", (event) => {
  publicationQuery = event.target.value.trim().toLowerCase();
  showAllPublications = false;
  renderPublications();
});

showAllButton?.addEventListener("click", () => {
  showAllPublications = !showAllPublications;
  renderPublications();
  if (!showAllPublications) {
    document.querySelector(".publication-tools")?.scrollIntoView({ behavior: "smooth" });
  }
});

renderHighlights();
renderPublications();

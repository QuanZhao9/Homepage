const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeNavigation = () => {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(willOpen));
  nav?.classList.toggle("is-open", willOpen);
  document.body.style.overflow = willOpen ? "hidden" : "";
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  window.requestAnimationFrame(() => target?.scrollIntoView());
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.hash === `#${visibleEntry.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.25, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

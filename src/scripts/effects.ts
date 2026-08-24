/* BhaktiMedia — single lightweight client bundle (all features guarded). */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- sticky header ---------- */
const header = document.getElementById("site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- theme toggle ---------- */
document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("bm-theme", dark ? "dark" : "light");
  })
);

/* ---------- mobile drawer ---------- */
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("drawer-backdrop");
function setDrawer(open: boolean) {
  if (!drawer || !backdrop) return;
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}
document.getElementById("drawer-open")?.addEventListener("click", () => setDrawer(true));
document.querySelectorAll("[data-drawer-close]").forEach((el) => el.addEventListener("click", () => setDrawer(false)));
backdrop?.addEventListener("click", () => setDrawer(false));
window.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

/* ---------- active nav ---------- */
const path = location.pathname.replace(/\/$/, "") || "/";
document.querySelectorAll<HTMLAnchorElement>(".nav-link[href]").forEach((a) => {
  const href = a.getAttribute("href") ?? "";
  if (href === path || (href !== "/" && path.startsWith(href))) a.setAttribute("aria-current", "page");
});

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll("[data-reveal]");
if (reduced || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- animated counters ---------- */
const fmt = (n: number) => n.toLocaleString("en-IN");
function animateCount(el: HTMLElement) {
  const target = Number(el.dataset.count ?? 0);
  const suffix = el.dataset.suffix ?? "";
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / 1800);
    el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterEls = document.querySelectorAll<HTMLElement>("[data-count]");
if (reduced) {
  counterEls.forEach((el) => (el.textContent = fmt(Number(el.dataset.count ?? 0)) + (el.dataset.suffix ?? "")));
} else {
  const cio = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { animateCount(e.target as HTMLElement); cio.unobserve(e.target); }
  }), { threshold: 0.4 });
  counterEls.forEach((el) => cio.observe(el));
}

/* ---------- golden dust particles (hero) ---------- */
const canvas = document.getElementById("dust") as HTMLCanvasElement | null;
if (canvas && !reduced) {
  const ctx = canvas.getContext("2d")!;
  let w = 0, h = 0, running = true;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
  type P = { x: number; y: number; r: number; s: number; sway: number; amp: number; a: number };
  const spawn = (fresh = true): P => ({
    x: Math.random() * w, y: fresh ? h + 20 : Math.random() * h,
    r: Math.random() * 1.8 + 0.6, s: Math.random() * 0.4 + 0.12,
    sway: Math.random() * Math.PI * 2, amp: Math.random() * 18 + 6, a: Math.random() * 0.5 + 0.25,
  });
  const P: P[] = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 16)) }, () => spawn(false));
  new IntersectionObserver(([e]) => (running = e.isIntersecting)).observe(canvas);
  const tick = () => {
    requestAnimationFrame(tick);
    if (!running || document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      p.y -= p.s; p.sway += 0.012;
      if (p.y < -10) P[i] = spawn();
      const x = p.x + Math.sin(p.sway) * p.amp;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,176,65,${p.a * (0.7 + 0.3 * Math.sin(p.sway * 3))})`;
      ctx.shadowColor = "rgba(255,150,40,0.8)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };
  tick();
}

/* ---------- mouse glow ---------- */
const hero = document.getElementById("home");
const glow = document.getElementById("hero-glow");
if (hero && glow && !reduced && finePointer) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

/* ---------- subtle tilt ---------- */
if (finePointer && !reduced) {
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(y * -4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
}

/* ---------- testimonial carousel ---------- */
document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((track) => {
  const root = track.closest("[data-carousel-root]");
  const step = () => (track.querySelector(":scope > *") as HTMLElement | null)?.offsetWidth ?? 400;
  root?.querySelector("[data-carousel-prev]")?.addEventListener("click", () =>
    track.scrollBy({ left: -(step() + 24), behavior: reduced ? "auto" : "smooth" }));
  root?.querySelector("[data-carousel-next]")?.addEventListener("click", () =>
    track.scrollBy({ left: step() + 24, behavior: reduced ? "auto" : "smooth" }));
});

/* ---------- gallery filters ---------- */
const filterBtns = document.querySelectorAll<HTMLButtonElement>("[data-filter-btn]");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const f = btn.dataset.filterBtn!;
    document.querySelectorAll<HTMLElement>("[data-cat]").forEach((item) => {
      const show = f === "all" || item.dataset.cat === f;
      item.classList.toggle("hidden", !show);
      if (show && !reduced) {
        item.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
          { duration: 350, easing: "ease-out" });
      }
    });
  })
);

/* ---------- lightbox ---------- */
const lightbox = document.getElementById("lightbox") as HTMLDialogElement | null;
if (lightbox) {
  const lbImg = lightbox.querySelector("img");
  const lbTitle = lightbox.querySelector<HTMLElement>("[data-lb-title]");
  document.querySelectorAll<HTMLElement>("[data-lightbox]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (lbImg) { lbImg.src = btn.dataset.src ?? ""; lbImg.alt = btn.dataset.title ?? ""; }
      if (lbTitle) lbTitle.textContent = btn.dataset.title ?? "";
      lightbox.showModal();
    })
  );
}

/* ---------- generic dialog openers ---------- */
document.querySelectorAll<HTMLElement>("[data-open-dialog]").forEach((btn) =>
  btn.addEventListener("click", () =>
    (document.getElementById(btn.dataset.openDialog!) as HTMLDialogElement | null)?.showModal())
);
document.querySelectorAll<HTMLDialogElement>("dialog").forEach((d) =>
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); })
);

/* ---------- demo forms (wire to Formspree / API in production) ---------- */
document.querySelectorAll<HTMLFormElement>("form[data-demo-form]").forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector<HTMLButtonElement>("button[type='submit']");
    if (btn) { btn.disabled = true; btn.textContent = "?? Sent! We reply within 24 hours."; }
    form.querySelectorAll("input, textarea, select").forEach((f) => ((f as HTMLInputElement).value = ""));
  })
);

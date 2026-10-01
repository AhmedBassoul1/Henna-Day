/* ============================================================
   SOIRÉE DE HENNÉ — Logique & animations
   Données : config.js
   ============================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   1. INJECTION DES DONNÉES
   ============================================================ */

// Noms en lettres individuelles → révélation lettre par lettre
function setLetters(el, text, base = 0.9) {
  if (!el) return;
  el.textContent = "";
  const frag = document.createDocumentFragment();
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "ltr";
    s.textContent = ch;
    s.style.transitionDelay = `${(base + 0.055 * i).toFixed(3)}s`;
    frag.appendChild(s);
  });
  el.appendChild(frag);
}

// La mariée d'abord, puis le marié → lecture naturelle de haut en bas
setLetters($("#bride"), brideName, 0.9);
setLetters($("#groom"), groomName, 0.9 + 0.055 * brideName.length + 0.18);

const text = {
  "#basmala":        basmala,
  "#eventTitle":     eventTitle,
  "#eventSubtitle":  eventSubtitle,
  "#dateLabel":      weddingDateLabel,
  "#timeLabel":      eventTimeLabel,
  "#placeLabel":     weddingLocation,
  "#invitationNote": invitationNote,
  "#venuePlace":     weddingLocation,
  "#envNames":       `${brideName} & ${groomName}`,
  "#envCardNames":   `${brideName} & ${groomName}`,
  "#envCardDate":    weddingDateLabel,
  "#footerInitials": `${brideName.charAt(0)} & ${groomName.charAt(0)}`,
};
for (const [sel, value] of Object.entries(text)) {
  const el = $(sel);
  if (el) el.textContent = value;
}

document.title = `${brideName} & ${groomName} — ${eventSubtitle}`;
$("#ogTitle")?.setAttribute("content", `${brideName} & ${groomName} — ${eventSubtitle}`);
$("#ogDesc")?.setAttribute("content", `${weddingDateLabel} · ${eventTimeLabel} · ${weddingLocation}`);

// Illustration du couple
if (typeof coupleImage === "string" && coupleImage.trim()) {
  $("#coupleImg").src = coupleImage;
}

// Carte Google Maps optionnelle
if (typeof mapUrl === "string" && mapUrl.trim()) {
  $("#map").src = mapUrl;
  $("#mapFrame").hidden = false;
}

/* ============================================================
   2. INTRO — OUVERTURE DE L'ENVELOPPE
   ============================================================ */

const intro    = $("#intro");
const envelope = $("#envelope");
const card     = $("#card");

document.body.classList.add("intro-active");
let introDone = false;

function revealCard() {
  // double rAF : garantit que la transition part bien de l'état initial
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      card.classList.add("is-visible");
      setTimeout(
        () => $("#scrollHint")?.classList.add("is-visible"),
        reduceMotion ? 0 : 2200
      );
    })
  );
}

function openEnvelope() {
  if (introDone) return;
  introDone = true;

  intro.classList.add("is-opening");
  envelope.classList.add("is-open");

  // La carte commence à apparaître pendant que l'enveloppe s'efface → fondu enchaîné
  const cardDelay = reduceMotion ? 0 : 1750;
  const hideDelay = reduceMotion ? 120 : 2050;

  setTimeout(revealCard, cardDelay);
  setTimeout(() => {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
  }, hideDelay);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

/* ============================================================
   3. COMPTE À REBOURS
   ============================================================ */

(function initCountdown() {
  const target = new Date(weddingDate).getTime();
  const nums = [...$$(".cd__num")];
  const prev = {};

  function update() {
    const diff = Math.max(0, target - Date.now());
    const map = {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };

    for (const el of nums) {
      const unit = el.dataset.unit;
      const v = String(map[unit]).padStart(2, "0");
      if (prev[unit] === v) continue;
      prev[unit] = v;
      el.textContent = v;
      if (!reduceMotion) {
        el.classList.remove("tick");
        void el.offsetWidth; // reflow → relance l'animation
        el.classList.add("tick");
      }
    }
  }

  update();
  // Synchronisé sur la seconde pleine → pas de saut visuel
  setTimeout(() => {
    update();
    setInterval(update, 1000);
  }, 1000 - (Date.now() % 1000));
})();

/* ============================================================
   4. RÉVÉLATIONS AU SCROLL
   ============================================================ */

(function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
})();

/* ============================================================
   5. PARALLAXE LISSÉE DE LA CARTE (lerp + rAF)
   ============================================================ */

(function initParallax() {
  if (reduceMotion || !card) return;

  let targetY = 0;
  let currentY = 0;
  let raf = null;

  function loop() {
    currentY += (targetY - currentY) * 0.085; // lissage exponentiel
    card.style.setProperty("--parallax", `${currentY.toFixed(2)}px`);

    if (Math.abs(targetY - currentY) > 0.15) {
      raf = requestAnimationFrame(loop);
    } else {
      card.style.setProperty("--parallax", `${targetY}px`);
      raf = null;
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      targetY = Math.min(window.scrollY * 0.16, 150);
      if (!raf) raf = requestAnimationFrame(loop);
    },
    { passive: true }
  );
})();

/* ============================================================
   6. PARTICULES DORÉES (canvas, delta-time, pause hors écran)
   ============================================================ */

(function initParticles() {
  if (reduceMotion) return;

  const canvas = $("#particles");
  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1, particles = [], last = performance.now(), raf = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function create() {
    const count = Math.min(60, Math.max(22, Math.floor(w / 20)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.7 + 0.4,
      vy: Math.random() * 22 + 6,          // px / seconde
      vx: (Math.random() - 0.5) * 16,
      alpha: Math.random() * 0.45 + 0.18,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // indépendant du FPS
    last = now;

    ctx.clearRect(0, 0, w, h);
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(240, 226, 182, .75)";

    for (const p of particles) {
      p.y -= p.vy * dt;
      p.x += (p.vx + Math.sin(p.phase + p.y * 0.01) * 10) * dt;
      p.phase += 0.7 * dt;

      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      else if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 169, 92, ${p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 2))})`;
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(draw);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  create();
  start();

  // Économie de batterie quand l'onglet est caché
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start()
  );

  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => { resize(); create(); }, 150);
  }, { passive: true });
})();

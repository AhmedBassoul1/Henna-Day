/* ============================================================
   1. INJECTION DES DONNÉES (depuis config.js) DANS LE DOM
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Noms en lettres individuelles → révélation lettre par lettre
function setLetters(el, text) {
  el.innerHTML = "";
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "ltr";
    s.textContent = ch;
    s.style.transitionDelay = `${0.05 * i}s`;
    el.appendChild(s);
  });
}
setLetters(document.getElementById("bride"), brideName);
setLetters(document.getElementById("groom"), groomName);

document.getElementById("dateLabel").textContent  = weddingDateLabel;
document.getElementById("placeLabel").textContent = weddingLocation;
document.getElementById("venuePlace").textContent = weddingLocation;
document.getElementById("map").src                = mapUrl;
document.getElementById("footerInitials").textContent =
  `${brideName.charAt(0)} & ${groomName.charAt(0)}`;
document.title = `${brideName} & ${groomName} — Save the Date`;

/* ============================================================
   2. INTRO ANIMÉE — ENVELOPPE
   ============================================================ */
const intro    = document.getElementById("intro");
const envelope = document.getElementById("envelope");

document.getElementById("envSeal").textContent  =
  `${brideName.charAt(0)}·${groomName.charAt(0)}`;
document.getElementById("envNames").textContent = `${brideName} & ${groomName}`;
document.getElementById("envDate").textContent  = weddingDateLabel;

document.body.classList.add("intro-active");
let introDone = false;

function openEnvelope() {
  if (introDone) return;
  introDone = true;
  envelope.classList.add("is-open");

  const wait = reduceMotion ? 200 : 1700;
  setTimeout(() => {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");

    // Révélation orchestrée du hero (stagger via CSS)
    requestAnimationFrame(() => {
      document.querySelector(".hero__inner")?.classList.add("is-visible");
      setTimeout(() => {
        document.querySelector(".scroll-hint")?.classList.add("is-visible");
      }, reduceMotion ? 0 : 1400);
    });
  }, wait);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
});

/* ============================================================
   3. COMPTE À REBOURS (avec animation de chiffre)
   ============================================================ */
const target = new Date(weddingDate).getTime();
const prev = {};

function updateCountdown() {
  let diff = Math.max(0, target - Date.now());

  const map = {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };

  document.querySelectorAll(".cd__num").forEach((el) => {
    const v = String(map[el.dataset.unit]).padStart(2, "0");
    if (prev[el.dataset.unit] !== v) {
      prev[el.dataset.unit] = v;
      el.textContent = v;
      if (!reduceMotion) {
        el.classList.remove("tick");
        void el.offsetWidth; // reflow → relance l'animation
        el.classList.add("tick");
      }
    }
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   4. RÉVÉLATIONS AU SCROLL (IntersectionObserver)
   ============================================================ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ============================================================
   5. PARALLAXE DOUCE DU HERO (rAF + interpolation)
   ============================================================ */
(function initParallax() {
  if (reduceMotion) return;
  const inner = document.querySelector(".hero__inner");
  if (!inner) return;

  let targetY = 0, currentY = 0, raf = null;

  function loop() {
    currentY += (targetY - currentY) * 0.08; // lissage
    inner.style.setProperty("--parallax", `${currentY}px`);
    if (Math.abs(targetY - currentY) > 0.1) {
      raf = requestAnimationFrame(loop);
    } else raf = null;
  }

  window.addEventListener("scroll", () => {
    targetY = Math.min(window.scrollY * 0.18, 160);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
})();

/* ============================================================
   6. PARTICULES FLOTTANTES (canvas net + delta-time)
   ============================================================ */
(function initParticles() {
  if (reduceMotion) return;

  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, particles, last = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const count = Math.min(70, Math.floor(w / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 24 + 6,        // px / seconde
      vx: (Math.random() - 0.5) * 18,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05); // indépendant du FPS
    last = now;

    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y -= p.vy * dt;
      p.x += p.vx * dt + Math.sin(p.phase + p.y * 0.01) * 12 * dt;
      p.phase += 0.6 * dt;

      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const twinkle = p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 2));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 163, 91, ${twinkle})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(231, 207, 154, 0.8)";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  requestAnimationFrame(draw);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 150);
  });
})();

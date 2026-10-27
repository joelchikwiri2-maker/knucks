(function () {
  if (typeof CONFIG === "undefined") {
    throw new Error("CONFIG is not loaded. Ensure config.js is included before script.js.");
  }

  const $ = (id) => document.getElementById(id);
  const C = CONFIG;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* --- fill content from config --- */
  $("heroName").textContent = C.name;
  $("heroMsg").textContent = C.heroMessage;
  $("thingsHeading").textContent = C.thingsHeading;
  $("greet").textContent = C.letterGreeting;
  $("signoff").textContent = C.letterSignoff;
  $("revealHeading").textContent = C.revealHeading;
  $("revealCaption").textContent = C.revealCaption;
  $("revealExplain").textContent = C.revealExplain;
  $("revealFinal").textContent = C.revealFinal;
  $("tTitle").textContent = C.trackTitle;
  $("tArtist").textContent = "· " + C.trackArtist;
  $("footLine").textContent = C.footerLine;
  $("footName").textContent = "— for " + C.name;
  document.title = "Happy birthday, " + C.name;

  C.letter.forEach((t) => { const p = document.createElement("p"); p.textContent = t; $("letterBody").appendChild(p); });

  C.things.forEach((t) => {
    const d = document.createElement("div"); d.className = "card reveal-in";
    d.innerHTML = '<span class="ico" aria-hidden="true"></span><h3></h3><p></p>';
    d.querySelector(".ico").textContent = t.icon;
    d.querySelector("h3").textContent = t.title;
    d.querySelector("p").textContent = t.text;
    $("cards").appendChild(d);
  });

  C.photos.forEach((p, i) => {
    const f = document.createElement("figure"); f.className = "polaroid reveal-in s" + (i % 3);
    f.tabIndex = 0;
    const img = new Image(); img.loading = "lazy"; img.alt = p.caption; img.src = p.src;
    img.onerror = () => {
      const ph = document.createElement("div"); ph.className = "ph";
      ph.textContent = "Add photo: " + p.src; img.replaceWith(ph);
    };
    const cap = document.createElement("figcaption"); cap.className = "script"; cap.textContent = p.caption;
    f.append(img, cap);
    if (i % 2 === 0) f.insertAdjacentHTML("afterbegin", '<span class="tape" aria-hidden="true"></span>');
    $("collage").appendChild(f);
  });

  /* --- scroll reveal (content stays visible if JS or IO fails) --- */
  const els = document.querySelectorAll(".reveal-in, .letter, .reveal, h2");
  els.forEach((e) => e.classList.add("rise"));
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
  } else els.forEach((e) => e.classList.add("in"));

  /* --- open button: scroll + small heart burst --- */
  $("openBtn").addEventListener("click", () => {
    $("photos").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (reduce) return;
    const r = $("openBtn").getBoundingClientRect();
    const cols = ["#d6455d", "#7a4fb5", "#2f4b9c", "#1c1a24"];
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span"); s.className = "burst"; s.textContent = i % 3 ? "♡" : "★";
      s.style.left = r.left + r.width / 2 + "px"; s.style.top = r.top + r.height / 2 + "px";
      s.style.color = cols[i % cols.length];
      s.style.setProperty("--x", (Math.random() * 240 - 120) + "px");
      s.style.setProperty("--y", (-60 - Math.random() * 160) + "px");
      document.body.appendChild(s); setTimeout(() => s.remove(), 1500);
    }
  });

  /* --- audio player --- */
  const a = $("audio"), play = $("playBtn"), seek = $("seek"), st = $("status");
  const fmt = (s) => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "–:––";
  const fail = () => { st.textContent = "Unavailable"; play.disabled = true; seek.disabled = true; $("fallback").hidden = false; };
  a.addEventListener("error", fail);
  a.src = C.audioSrc;
  a.addEventListener("loadedmetadata", () => { $("dur").textContent = fmt(a.duration); seek.disabled = false; st.textContent = "Ready"; });
  a.addEventListener("waiting", () => st.textContent = "Loading…");
  a.addEventListener("playing", () => { st.textContent = "Playing"; play.textContent = "❚❚"; play.setAttribute("aria-label", "Pause"); });
  a.addEventListener("pause", () => { if (!a.ended) st.textContent = "Paused"; play.textContent = "▶"; play.setAttribute("aria-label", "Play"); });
  a.addEventListener("ended", () => { st.textContent = "Finished"; seek.value = 0; $("cur").textContent = "0:00"; });
  a.addEventListener("timeupdate", () => { if (a.duration) seek.value = (a.currentTime / a.duration) * 100; $("cur").textContent = fmt(a.currentTime); });
  play.addEventListener("click", () => { if (a.paused) a.play().catch(fail); else a.pause(); });
  seek.addEventListener("input", () => { if (a.duration) a.currentTime = (seek.value / 100) * a.duration; });
})();

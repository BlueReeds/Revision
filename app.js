/* Ride & Révise — version GitHub Pages + Firebase Realtime Database (API REST, sans librairie) */

/* ======================= Illustrations ======================= */
const HERO_SVG = `
<svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1a22"/><stop offset=".65" stop-color="#1d3a3f"/><stop offset="1" stop-color="#ff7a2f" stop-opacity=".55"/></linearGradient>
    <linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="#101614" stop-opacity=".95"/><stop offset=".5" stop-color="#101614" stop-opacity=".35"/><stop offset="1" stop-color="#101614" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1200" height="420" fill="url(#sky)"/>
  <circle cx="930" cy="150" r="46" fill="#ffd9a8" opacity=".85"/>
  <path d="M0 290 L120 200 L210 250 L330 150 L450 240 L560 170 L690 250 L820 130 L960 230 L1080 160 L1200 220 L1200 420 L0 420Z" fill="#20352f"/>
  <path d="M0 330 L150 260 L260 300 L400 230 L520 300 L640 250 L760 310 L900 240 L1040 300 L1200 260 L1200 420 L0 420Z" fill="#17271f"/>
  <g fill="#0f1c16">
    ${Array.from({ length: 26 }, (_, i) => { const x = 20 + i * 47 + (i % 3) * 9; const h = 40 + (i * 37 % 45); const y = 360 - (i % 4) * 8; return `<path d="M${x} ${y} L${x + 14} ${y - h} L${x + 28} ${y}Z"/>`; }).join("")}
  </g>
  <path d="M0 420 L0 380 C 200 360 360 400 560 372 C 720 350 820 330 980 300 C 1060 286 1140 290 1200 282 L1200 420Z" fill="#3b2a1f"/>
  <path d="M0 395 C 220 380 380 410 580 386 C 740 366 840 344 1000 316 C 1080 302 1150 302 1200 296" fill="none" stroke="#8a5a3c" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>
  <g transform="translate(820 214) rotate(-11)">
    <g fill="none" stroke="#eef3ef" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="70" r="40"/><circle cx="128" cy="70" r="40"/></g>
    <g fill="none" stroke="#ff7a2f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M0 70 L52 74 L38 10 Z"/><path d="M38 10 L104 14 L52 74"/><path d="M104 14 L128 70"/></g>
    <g fill="none" stroke="#eef3ef" stroke-width="6" stroke-linecap="round"><path d="M30 6 L48 6"/><path d="M100 2 L104 14 M94 0 L114 -2"/></g>
    <g fill="none" stroke="#0b1210" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"><path d="M38 0 L78 -44"/><path d="M78 -44 L106 -2"/><path d="M38 0 L70 30 L56 78"/><path d="M38 0 L56 40 L44 86"/></g>
    <circle cx="92" cy="-64" r="17" fill="#0b1210"/>
    <path d="M74 -70 C 80 -92 112 -92 114 -66 L 120 -64" fill="#ff7a2f" stroke="#ff7a2f" stroke-width="4" stroke-linejoin="round"/>
  </g>
  <g fill="#c48a5e" opacity=".7"><circle cx="780" cy="300" r="5"/><circle cx="752" cy="310" r="3.5"/><circle cx="724" cy="316" r="6"/><circle cx="700" cy="326" r="3"/><circle cx="676" cy="330" r="4.5"/></g>
  <rect width="1200" height="420" fill="url(#fadeL)"/>
</svg>`;
function bandSvg(seed) {
  let x = 0, d = "M0 64 ", s = seed;
  while (x < 400) { s = (s * 9301 + 49297) % 233280; const h = 18 + (s / 233280) * 30; x += 30 + (s % 30); d += `L${x} ${64 - h} `; }
  return `<svg viewBox="0 0 400 64" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L400 64 Z" fill="rgba(0,0,0,.28)"/><path d="M0 60 C 120 48 220 64 400 44" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/></svg>`;
}
document.getElementById("hero-art").innerHTML = HERO_SVG;

/* ======================= Helpers ======================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = ts => new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const fmtDateTime = ts => new Date(ts).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const ago = ts => { const d = Math.floor((Date.now() - ts) / 86400000); return d <= 0 ? "aujourd'hui" : d === 1 ? "hier" : `il y a ${d} j`; };
const nClass = n => n >= 14 ? "n-ok" : n >= 10 ? "n-mid" : "n-bad";
const fmtN = n => (Math.round(n * 10) / 10).toString().replace(".", ",");
function trailOf(n) {
  if (n >= 16) return { name: "Piste noire", c: "var(--trail-black)" };
  if (n >= 13) return { name: "Piste rouge", c: "var(--trail-red)" };
  if (n >= 10) return { name: "Piste bleue", c: "var(--trail-blue)" };
  return { name: "Piste verte", c: "var(--trail-green)" };
}
const trailHtml = n => { const t = trailOf(n); return `<span class="trail"><i style="background:${t.c}"></i>${t.name}</span>`; };
let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3400); }
const PHOTO = n => `images/${n}.jpg`;
const SUBJECT_PHOTO_CYCLE = ["sommet", "glacier", "falaise", "pierrier", "rider"];
const subjectPhoto = s => { const i = Math.max(0, S.subjects.findIndex(x => x.id === s?.id)); return (s && S.subjectPhotos[s.id]) || PHOTO(SUBJECT_PHOTO_CYCLE[i % SUBJECT_PHOTO_CYCLE.length]); };
const cssUrl = u => `url('${String(u).replace(/'/g, "%27")}')`;
function pageHero(eyebrow, title, img, opts = {}) {
  return `<div class="page-hero ${opts.tall ? "tall" : ""}" style="background-image:${cssUrl(img)};${opts.pos ? `background-position:${opts.pos};` : ""}">
    <div class="ph-in"><span class="eyebrow"${opts.color ? ` style="color:${esc(opts.color)}"` : ""}>${eyebrow}</span><h2>${title}</h2>${opts.sub ? `<p class="ph-sub">${opts.sub}</p>` : ""}</div>${opts.side ? `<div class="ph-side">${opts.side}</div>` : ""}</div>`;
}
const SUBJECT_COLORS = ["#ff7a2f", "#3d8bff", "#5fd38d", "#c77dff", "#ffc847", "#ff6470", "#5cc8d6", "#a3e05a"];
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};

/* ======================= Firebase (REST) ======================= */
const CFG = window.RR_CONFIG || {};
const cleanUrl = u => String(u || "").trim().replace(/\s+/g, "").replace(/(firebasedatabase\.app|firebaseio\.com)\/.*$/, "$1").replace(/\/+$/, "");
let DB = cleanUrl(CFG.firebaseUrl) || cleanUrl(store.get("rr-firebase-url"));
class DbError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
async function api(path, method = "GET", body) {
  let r;
  try {
    r = await fetch(`${DB}/rr/${path}.json`, { method, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch { throw new DbError(0, "Connexion impossible"); }
  if (!r.ok) throw new DbError(r.status, await r.text().catch(() => ""));
  return r.json();
}
function dbMessage(e) {
  const st = e?.status;
  if (st === 401 || st === 403) return "La base refuse l'accès. Dans Firebase, onglet Règles de Realtime Database, colle les règles du README puis clique sur Publier.";
  if (st === 404) return "Adresse introuvable. Recopie l'adresse exacte affichée en haut de la page Realtime Database.";
  if (st === 413) return "Fichier trop lourd pour la base.";
  if (st === 423) return "La base est désactivée. Réactive-la dans la console Firebase.";
  if (st === 0) return "Impossible de joindre la base. Vérifie l'adresse (elle se termine par firebasedatabase.app ou firebaseio.com) et ta connexion.";
  return "Erreur de la base" + (st ? ` (${st})` : "") + ". Réessaie dans un instant.";
}

/* ======================= State ======================= */
const S = {
  ready: false, error: "",
  subjectPhotos: {}, subjectPhotoV: {}, subjects: [], lessons: [], quizzes: [], maps: [], results: [], settings: {}, cover: null, coverV: null,
  view: "home", subjectId: null, lessonId: null, dashFilter: "all", parentForm: "quiz",
  unlocked: store.sget("rr-parent") === "1",
};
const asList = o => Object.entries(o || {}).map(([id, v]) => ({ id, ...v }));

async function loadAll() {
  try {
    const [cat, res, set, pl] = await Promise.all([api("catalog"), api("results"), api("settings"), api("planning")]);
    S.plan = asList(pl).filter(p => p && p.date);
    S.subjects = asList(cat?.subjects).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    S.lessons = asList(cat?.lessons);
    S.quizzes = asList(cat?.quizzes);
    S.maps = asList(cat?.maps);
    S.results = asList(res).filter(r => r && r.total > 0).sort((a, b) => b.at - a.at);
    S.settings = set || {};
    await Promise.all(S.subjects.map(async sb => {
      if (!sb.photoV) { delete S.subjectPhotos[sb.id]; return; }
      if (S.subjectPhotoV[sb.id] === sb.photoV) return;
      const ph = await api(`subjectPhotos/${sb.id}`).catch(() => null);
      if (ph?.data) { S.subjectPhotos[sb.id] = ph.data; S.subjectPhotoV[sb.id] = sb.photoV; }
    }));
    if (S.settings.coverV && S.settings.coverV !== S.coverV) {
      const c = await api("cover").catch(() => null);
      S.cover = c?.data || null; S.coverV = S.settings.coverV;
    } else if (!S.settings.coverV) { S.cover = null; S.coverV = null; }
    S.error = "";
  } catch (e) { S.error = dbMessage(e); }
  S.ready = true;
  if ($("#player").hidden) render(); else renderHero();
}

/* ======================= Derived ======================= */
const lessonsOf = sid => S.lessons.filter(l => l.subjectId === sid).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
const quizzesOf = lid => S.quizzes.filter(q => q.lessonId === lid).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
const mapsOf = lid => S.maps.filter(m => m.lessonId === lid).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
const resultsOfQuiz = qid => S.results.filter(r => r.quizId === qid);
const byId = (arr, id) => arr.find(x => x.id === id);
const avg = arr => arr.length ? arr.reduce((s, r) => s + r.note20, 0) / arr.length : null;

/* ======================= Rendering ======================= */
function renderHero() {
  const res = S.results, a = avg(res), last = res[0];
  const dplus = Math.round(res.reduce((s, r) => s + r.note20 * 25, 0));
  const name = (S.settings.studentName || "").trim();
  $("#hero-eyebrow").textContent = name ? `Salut ${name}` : "Session du jour";
  $("#hero-stats").innerHTML = `
    <div class="stat"><div class="v num">${res.length}</div><div class="l">quiz bouclés</div></div>
    <div class="stat"><div class="v num">${a == null ? "–" : fmtN(a)}<small style="font-size:16px">/20</small></div><div class="l">moyenne</div></div>
    <div class="stat"><div class="v num">${dplus.toLocaleString("fr-FR")} m</div><div class="l">de D+ gagné</div></div>
    <div class="stat"><div class="v">${last ? ago(last.at) : "–"}</div><div class="l">dernière sortie</div></div>`;
  const photo = $("#hero-photo");
  photo.style.backgroundImage = cssUrl(S.cover || PHOTO("accueil"));
  photo.classList.toggle("custom", !!S.cover);
  photo.hidden = false;
}

function render() {
  document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-current", t.dataset.view === S.view ? "page" : "false"));
  $("#tab-parents").hidden = false;
  $("#hero").hidden = !(S.view === "home" && DB);
  renderHero();
  const m = $("#main");
  if (!DB) { m.innerHTML = viewSetup(); wireSetup(); return; }
  if (!S.ready) { m.innerHTML = `<div class="empty"><b>Chargement du parcours…</b></div>`; return; }
  const banner = S.error ? `<div class="banner" style="margin-bottom:18px">${esc(S.error)}</div>` : "";
  m.innerHTML = banner + ({ home: viewHome, subjects: viewSubjects, plan: viewPlan, dash: viewDash, parents: viewParents }[S.view] || viewHome)();
  if (S.view === "dash") wireDash();
  if (S.view === "plan") wirePlan();
  if (S.view === "parents") wireParents();
}

/* ---------- Première configuration ---------- */
function viewSetup() {
  return `<div class="setup">${pageHero("Première configuration", "Branche la base de données", PHOTO("accueil"), { pos: "70% 40%" })}<div class="card form">
    <p class="muted" style="margin:0">Les quiz et les notes sont rangés dans une base Firebase gratuite. Il faut indiquer son adresse une seule fois.</p>
    <ol>
      <li>Crée la base en suivant l'étape 1 du fichier README.</li>
      <li>Colle son adresse dans <code>config.js</code> sur GitHub, pour que tous les appareils la connaissent.</li>
      <li>Pour essayer tout de suite sur cet appareil, colle-la aussi ici.</li>
    </ol>
    <label class="f" for="setup-url">Adresse Firebase<input type="text" id="setup-url" placeholder="https://xxxx-default-rtdb.europe-west1.firebasedatabase.app" autocomplete="off"></label>
    <div><button class="btn" id="setup-go">Tester et connecter</button></div>
    <p class="notice" id="setup-msg" role="status"></p>
  </div></div>`;
}
function wireSetup() {
  $("#setup-go")?.addEventListener("click", async () => {
    const u = cleanUrl($("#setup-url").value), msg = $("#setup-msg");
    if (!/^https:\/\/.+(firebasedatabase\.app|firebaseio\.com)$/.test(u)) { msg.textContent = "L'adresse doit commencer par https:// et se terminer par firebasedatabase.app ou firebaseio.com."; return; }
    msg.textContent = "Test en cours…";
    const prev = DB; DB = u;
    try { await api("ping", "PUT", { at: Date.now() }); store.set("rr-firebase-url", u); toast("Base connectée"); loadAll(); }
    catch (e) { DB = prev; msg.textContent = dbMessage(e); }
  });
}

/* ---------- Élève ---------- */
function subjectCard(s, i) {
  const ls = lessonsOf(s.id);
  const qs = S.quizzes.filter(q => ls.some(l => l.id === q.lessonId));
  const rs = S.results.filter(r => r.subjectId === s.id);
  const done = new Set(rs.map(r => r.quizId).filter(id => qs.some(q => q.id === id))).size;
  const pct = qs.length ? Math.round(done / qs.length * 100) : 0;
  const a = avg(rs);
  return `<button class="subject" data-subject="${esc(s.id)}" style="--sc:${esc(s.color || SUBJECT_COLORS[i % 8])}">
    <div class="band" style="background-image:${cssUrl(subjectPhoto(s))}"></div>
    <div class="body"><h3>${esc(s.name)}</h3>
      <div class="meta num">${ls.length} leçon${ls.length > 1 ? "s" : ""} · ${qs.length} quiz${a != null ? ` · moy. ${fmtN(a)}/20` : ""}</div>
      <div class="bar" title="${pct}% des quiz faits"><i style="width:${pct}%"></i></div></div></button>`;
}
function emptyCatalog() {
  return `<div class="empty"><b>Le parcours est vide</b><span>Les parents ajoutent les quiz depuis l'onglet Parents. Les quiz des fractions sont prêts à être importés en un clic.</span><button class="btn" data-go="parents">Espace parents</button></div>`;
}
function viewHome() {
  if (!S.subjects.length) return `<div class="view">${emptyCatalog()}</div>`;
  const todo = S.quizzes.filter(q => !resultsOfQuiz(q.id).length).slice(0, 4);
  const recent = S.results.slice(0, 5);
  return `<div class="view">
    ${todayCard()}
    <div><span class="eyebrow">Choisis ta ligne</span><h2>Tes matières</h2></div>
    <div class="grid">${S.subjects.map(subjectCard).join("")}</div>
    <div class="split">
      <div class="card"><div class="sec-head" style="margin-bottom:6px"><h3>Pas encore roulés</h3></div>
        ${todo.length ? todo.map(quizRow).join("") : `<p class="muted">Tous les quiz ont été faits au moins une fois. Refais ceux où ta note est la plus basse.</p>`}</div>
      <div class="card"><div class="sec-head" style="margin-bottom:6px"><h3>Dernières sorties</h3></div>
        ${recent.length ? recent.map(resultMini).join("") : `<p class="muted">Aucune note pour l'instant. Lance un quiz pour commencer.</p>`}</div>
    </div></div>`;
}
function quizRow(q) {
  const l = byId(S.lessons, q.lessonId), s = l && byId(S.subjects, l.subjectId);
  const rs = resultsOfQuiz(q.id);
  const best = rs.length ? Math.max(...rs.map(r => r.note20)) : null;
  return `<div class="qv"><div class="t"><b>${esc(l?.title || "Leçon")} · ${esc(q.label)}</b><span class="muted" style="font-size:14px">${esc(s?.name || "")}${rs.length ? ` · fait ${rs.length}× · dernier ${ago(rs[0].at)}` : " · jamais fait"}</span></div>
    ${best != null ? `<span class="note ${nClass(best)} num">${fmtN(best)}</span>` : ""}<button class="btn small" data-play="${esc(q.id)}">Go</button></div>`;
}
function resultMini(r) {
  const q = byId(S.quizzes, r.quizId), l = byId(S.lessons, r.lessonId);
  return `<div class="qv"><div class="t"><b>${esc(l?.title || "Quiz supprimé")}${q ? " · " + esc(q.label) : ""}</b><span class="muted" style="font-size:14px">${fmtDateTime(r.at)} · ${r.score}/${r.total}</span></div>${trailHtml(r.note20)}<span class="note ${nClass(r.note20)} num">${fmtN(r.note20)}</span></div>`;
}
function viewSubjects() {
  if (S.lessonId && byId(S.lessons, S.lessonId)) return viewLesson();
  if (S.subjectId && byId(S.subjects, S.subjectId)) return viewSubject();
  if (!S.subjects.length) return `<div class="view">${emptyCatalog()}</div>`;
  return `<div class="view">${pageHero("Toutes les lignes", "Matières", PHOTO("sommet"), { pos: "center 30%", sub: `${S.subjects.length} matière${S.subjects.length > 1 ? "s" : ""} · ${S.quizzes.length} quiz au départ` })}<div class="grid">${S.subjects.map(subjectCard).join("")}</div></div>`;
}
function viewSubject() {
  const s = byId(S.subjects, S.subjectId), ls = lessonsOf(s.id);
  return `<div class="view">
    <div class="crumbs"><button data-crumb="root">Matières</button><span class="muted">/</span><span>${esc(s.name)}</span></div>
    ${pageHero("Matière", esc(s.name), subjectPhoto(s), { color: s.color, sub: `${ls.length} leçon${ls.length > 1 ? "s" : ""}` })}
    <div class="list">${ls.length ? ls.map(l => {
      const qs = quizzesOf(l.id), ms = mapsOf(l.id), rs = S.results.filter(r => r.lessonId === l.id), a = avg(rs);
      return `<button class="lesson-row" data-lesson="${esc(l.id)}"><div class="t"><b>${esc(l.title)}</b><span class="muted num" style="font-size:14px">${qs.length} version${qs.length > 1 ? "s" : ""} de quiz · ${ms.length} carte${ms.length > 1 ? "s" : ""} mentale${ms.length > 1 ? "s" : ""}${rs.length ? ` · ${rs.length} essai${rs.length > 1 ? "s" : ""}` : ""}</span></div>
        ${a != null ? `<span class="note ${nClass(a)} num">${fmtN(a)}</span>` : ""}<span class="chev">›</span></button>`;
    }).join("") : `<div class="empty"><b>Aucune leçon</b><span>Rien ici pour l'instant.</span></div>`}</div></div>`;
}
function viewLesson() {
  const l = byId(S.lessons, S.lessonId), s = byId(S.subjects, l.subjectId);
  const qs = quizzesOf(l.id), ms = mapsOf(l.id);
  return `<div class="view">
    <div class="crumbs"><button data-crumb="root">Matières</button><span class="muted">/</span><button data-crumb="subject">${esc(s?.name)}</button><span class="muted">/</span><span>${esc(l.title)}</span></div>
    ${pageHero(esc(s?.name), esc(l.title), subjectPhoto(s), { color: s?.color, sub: `${qs.length} version${qs.length > 1 ? "s" : ""} de quiz · ${ms.length} carte${ms.length > 1 ? "s" : ""} mentale${ms.length > 1 ? "s" : ""}` })}
    <div class="split">
      <div class="card"><h3 style="margin-bottom:4px">Quiz</h3><p class="muted" style="margin:0 0 6px;font-size:14px">Chaque version pose d'autres questions. Fais-les toutes.</p>
        ${qs.length ? qs.map(q => {
          const rs = resultsOfQuiz(q.id), best = rs.length ? Math.max(...rs.map(r => r.note20)) : null;
          return `<div class="qv"><div class="t"><b>${esc(q.label)}</b><span class="muted" style="font-size:14px">${rs.length ? `${rs.length} essai${rs.length > 1 ? "s" : ""} · dernier le ${fmtDate(rs[0].at)}` : "Jamais fait"}</span></div>
            ${best != null ? `${trailHtml(best)}<span class="note ${nClass(best)} num" title="Meilleure note">${fmtN(best)}</span>` : ""}
            <button class="btn small" data-play="${esc(q.id)}">${rs.length ? "Refaire" : "Go"}</button></div>`;
        }).join("") : `<p class="muted">Pas encore de quiz pour cette leçon.</p>`}</div>
      <div class="card"><h3 style="margin-bottom:10px">Cartes mentales</h3>
        <div class="list">${ms.length ? ms.map(m => `<button class="map-item" data-map="${esc(m.id)}"><span class="ic">${m.kind === "pdf" ? "PDF" : m.kind === "image" ? "IMG" : "WEB"}</span><span><b>${esc(m.title)}</b><br><span class="muted" style="font-size:13px">Voir la carte</span></span></button>`).join("") : `<p class="muted" style="margin:0">Pas encore de carte mentale.</p>`}</div></div>
    </div></div>`;
}

/* ---------- Tableau de bord ---------- */
function viewDash() {
  const all = S.results;
  const rs = S.dashFilter === "all" ? all : all.filter(r => r.subjectId === S.dashFilter);
  const a = avg(rs), best = rs.length ? Math.max(...rs.map(r => r.note20)) : null;
  const week = rs.filter(r => Date.now() - r.at < 7 * 86400000).length;
  const subjIds = [...new Set(all.map(r => r.subjectId))];
  const canDel = S.unlocked;
  return `<div class="view">
    ${pageHero("Les chronos", "Tableau de bord", PHOTO("rider"), { pos: "center 35%", sub: rs.length ? `Moyenne ${fmtN(a)}/20 · ${trailOf(a).name}` : "Pas encore de chrono" })}
    <div class="sec-head">
      <div class="filters" id="dash-filters"><button class="chip" data-f="all" aria-pressed="${S.dashFilter === "all"}">Tout</button>${S.subjects.filter(s => subjIds.includes(s.id)).map(s => `<button class="chip" data-f="${esc(s.id)}" aria-pressed="${S.dashFilter === s.id}">${esc(s.name)}</button>`).join("")}</div></div>
    <div class="kpis">
      <div class="card kpi"><div class="v num">${rs.length}</div><div class="l">quiz faits</div></div>
      <div class="card kpi"><div class="v num">${a == null ? "–" : fmtN(a)}</div><div class="l">moyenne /20</div></div>
      <div class="card kpi"><div class="v num">${best == null ? "–" : fmtN(best)}</div><div class="l">meilleure note</div></div>
      <div class="card kpi"><div class="v num">${week}</div><div class="l">quiz ces 7 derniers jours</div></div>
    </div>
    ${rs.length ? `<div class="split">
      <div class="card"><h3>${rs.length === 1 ? "Ta dernière note" : `Les ${Math.min(rs.length, 15)} dernières notes`}</h3><div style="margin-top:10px">${chartSvg(rs.slice(0, 15).reverse(), a)}</div></div>
      <div class="card"><h3 style="margin-bottom:12px">Moyenne par matière</h3><div class="subj-bars">${subjIds.map(id => {
        const s = byId(S.subjects, id), sa = avg(all.filter(r => r.subjectId === id));
        return `<div class="subj-bar"><span>${esc(s?.name || "Matière supprimée")}</span><span class="track"><i style="width:${sa / 20 * 100}%;background:${esc(s?.color || "var(--muted)")}"></i></span><span class="num" style="text-align:right;font-weight:700">${fmtN(sa)}</span></div>`;
      }).join("")}</div></div></div>
    <div class="tablewrap"><table><thead><tr><th>Date</th><th>Matière</th><th>Leçon</th><th>Version</th><th>Score</th><th>Note /20</th><th>Niveau</th>${canDel ? "<th></th>" : ""}</tr></thead><tbody>
      ${rs.map(r => { const q = byId(S.quizzes, r.quizId), l = byId(S.lessons, r.lessonId), s = byId(S.subjects, r.subjectId);
        return `<tr><td class="num">${fmtDateTime(r.at)}</td><td>${esc(s?.name || "–")}</td><td>${esc(l?.title || "–")}</td><td>${esc(q?.label || "supprimé")}</td><td class="num">${r.score}/${r.total}</td><td><span class="note ${nClass(r.note20)} num">${fmtN(r.note20)}</span></td><td>${trailHtml(r.note20)}</td>${canDel ? `<td><button class="btn small danger" data-delres="${esc(r.id)}">Effacer</button></td>` : ""}</tr>`; }).join("")}
    </tbody></table></div>`
    : `<div class="empty"><b>Aucune note pour l'instant</b><span>Les notes s'affichent ici dès qu'un quiz est terminé.</span></div>`}
  </div>`;
}
function chartSvg(rs, a) {
  const W = 520, H = 220, L = 30, R = 10, T = 12, B = 34, iw = W - L - R, ih = H - T - B, n = rs.length;
  const y = v => T + ih - v / 20 * ih, bw = Math.min(28, iw / n * 0.62);
  const grid = [0, 5, 10, 15, 20].map(v => `<line class="grid-l" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const bars = rs.map((r, i) => { const cx = L + iw / n * (i + .5), col = r.note20 >= 14 ? "var(--ok)" : r.note20 >= 10 ? "var(--mid)" : "var(--bad)";
    const showLbl = n <= 8 || (n - 1 - i) % 2 === 0;
    return `<rect x="${cx - bw / 2}" y="${y(r.note20)}" width="${bw}" height="${Math.max(2, y(0) - y(r.note20))}" rx="4" fill="${col}"><title>${fmtDate(r.at)} : ${fmtN(r.note20)}/20</title></rect>${showLbl ? `<text x="${cx}" y="${H - 12}" text-anchor="middle">${fmtDate(r.at)}</text>` : ""}`; }).join("");
  const avgL = a != null ? `<line class="avg-l" x1="${L}" x2="${W - R}" y1="${y(a)}" y2="${y(a)}"/><text x="${W - R}" y="${y(a) - 6}" text-anchor="end" style="fill:var(--sky)">moy. ${fmtN(a)}</text>` : "";
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dernières notes sur 20">${grid}${bars}${avgL}</svg>`;
}
function wireDash() { $("#dash-filters")?.addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { S.dashFilter = b.dataset.f; render(); } }); }

/* ---------- Parents ---------- */
const subjectOptions = sel => S.subjects.map(s => `<option value="${esc(s.id)}" ${s.id === sel ? "selected" : ""}>${esc(s.name)}</option>`).join("") + `<option value="__new" ${sel === "__new" ? "selected" : ""}>+ Nouvelle matière…</option>`;
const lessonOptions = (sid, sel) => lessonsOf(sid).map(l => `<option value="${esc(l.id)}" ${l.id === sel ? "selected" : ""}>${esc(l.title)}</option>`).join("") + `<option value="__new" ${sel === "__new" ? "selected" : ""}>+ Nouvelle leçon…</option>`;

function viewParents() {
  if (!S.unlocked) return `<div class="view">${pageHero("Atelier mécanique", "Espace parents", PHOTO("falaise"), { pos: "center 30%" })}<form class="card lock" id="lock-form">
    <label class="f" for="lock-code" style="align-items:center">Code parents<input type="password" id="lock-code" inputmode="numeric" autocomplete="off"></label>
    <button class="btn" type="submit">Entrer</button><p class="notice" id="lock-msg" role="status"></p></form></div>`;
  const f = S.parentForm;
  const sid = S.pSubject && (S.pSubject === "__new" || byId(S.subjects, S.pSubject)) ? S.pSubject : (S.subjects[0]?.id || "__new");
  const lid = S.pLesson && (S.pLesson === "__new" || (byId(S.lessons, S.pLesson)?.subjectId === sid)) ? S.pLesson : (lessonsOf(sid)[0]?.id || "__new");
  const packs = (S.packs || []).filter(pk => !S.quizzes.some(q => q.file === pk.quiz[0]));
  return `<div class="view">
    ${pageHero("Atelier mécanique", "Espace parents", PHOTO("falaise"), { pos: "center 30%", side: `<button class="btn ghost small" id="p-lock">Verrouiller</button>` })}
    ${packs.length ? `<div class="card form"><h3>Leçons prêtes à importer</h3><p class="notice" style="margin:0">Ces leçons sont déjà dans le dossier contenu du site. Un clic les ajoute au parcours.</p>
      <div class="list">${packs.map(pk => `<div class="qv"><div class="t"><b>${esc(pk.matiere)} · ${esc(pk.lecon)}</b><span class="muted" style="font-size:14px">${pk.titres?.length ? esc(pk.titres.join(", ")) : `${pk.quiz.length} version${pk.quiz.length > 1 ? "s" : ""} de quiz`}${pk.cartes.length ? ` · ${pk.cartes.length} carte${pk.cartes.length > 1 ? "s" : ""} mentale${pk.cartes.length > 1 ? "s" : ""}` : ""}</span></div><button class="btn small" data-seed="${esc(pk.id)}" type="button">Importer</button></div>`).join("")}</div></div>` : ""}
    <div class="card"><form class="form" id="add-form">
      <div class="seg" role="group" aria-label="Type d'ajout">
        <button type="button" data-pf="quiz" aria-pressed="${f === "quiz"}">Ajouter un quiz</button>
        <button type="button" data-pf="map" aria-pressed="${f === "map"}">Ajouter une carte mentale</button>
      </div>
      <div class="row two">
        <label class="f" for="p-subject">Matière<select id="p-subject">${subjectOptions(sid)}</select></label>
        <label class="f" for="p-subject-new" ${sid === "__new" ? "" : "hidden"}>Nom de la nouvelle matière<input type="text" id="p-subject-new" placeholder="Ex. Mathématiques"></label>
      </div>
      <div class="row two">
        <label class="f" for="p-lesson">Leçon<select id="p-lesson">${sid === "__new" ? `<option value="__new">+ Nouvelle leçon…</option>` : lessonOptions(sid, lid)}</select></label>
        <label class="f" for="p-lesson-new" id="p-lesson-new-w" ${(sid === "__new" || lid === "__new") ? "" : "hidden"}>Titre de la nouvelle leçon<input type="text" id="p-lesson-new" placeholder="Ex. Les fractions"></label>
      </div>
      ${f === "quiz" ? `<label class="f" for="p-file">Fichier(s) du quiz (.html)<span class="h">Tu peux en choisir plusieurs : chacun devient une version (Version 1, Version 2…).</span><input type="file" id="p-file" accept=".html,.htm,text/html" multiple></label>`
      : `<label class="f" for="p-file">Fichier de la carte mentale<span class="h">Page .html, image (.png, .jpg) ou PDF (5 Mo maximum).</span><input type="file" id="p-file" accept=".html,.htm,text/html,image/png,image/jpeg,image/webp,application/pdf"></label>
         <label class="f" for="p-title">Titre de la carte<input type="text" id="p-title" placeholder="Ex. Carte mentale des fractions"></label>`}
      <div><button class="btn" type="submit" id="p-submit">${f === "quiz" ? "Ajouter le quiz" : "Ajouter la carte"}</button></div>
      <p class="notice" id="p-msg" role="status"></p>
    </form></div>
    <div class="card"><h3 style="margin-bottom:10px">Contenu du parcours</h3>
      ${S.subjects.length ? `<div class="tree">${S.subjects.map(s => `
        <details open><summary><span class="dot" style="background:${esc(s.color)}"></span>${esc(s.name)}<span style="flex:1"></span><label class="btn small ghost" for="sp-${esc(s.id)}" onclick="event.stopPropagation()">Photo</label><input type="file" id="sp-${esc(s.id)}" data-subphoto="${esc(s.id)}" accept="image/png,image/jpeg,image/webp" hidden><button class="btn small danger" data-del="subjects:${esc(s.id)}" type="button">Supprimer</button></summary>
          <div class="subj-thumb" style="background-image:${cssUrl(subjectPhoto(s))}"></div>
          ${lessonsOf(s.id).map(l => `<div class="lesson"><div class="item"><b class="grow">${esc(l.title)}</b><button class="btn small danger" data-del="lessons:${esc(l.id)}">Supprimer la leçon</button></div>
            ${quizzesOf(l.id).map(q => `<div class="item"><span class="pill n-mid">Quiz</span><span class="grow">${esc(q.label)} <span class="muted">· ${resultsOfQuiz(q.id).length} essai(s)</span></span><button class="btn small ghost" data-play="${esc(q.id)}">Tester</button><button class="btn small danger" data-del="quizzes:${esc(q.id)}">Supprimer</button></div>`).join("")}
            ${mapsOf(l.id).map(m => `<div class="item"><span class="pill" style="background:color-mix(in srgb,var(--sky) 18%,transparent);color:var(--sky)">Carte</span><span class="grow">${esc(m.title)}</span><button class="btn small danger" data-del="maps:${esc(m.id)}">Supprimer</button></div>`).join("")}
          </div>`).join("") || `<p class="muted">Aucune leçon.</p>`}
        </details>`).join("")}</div>` : `<p class="muted">Rien pour l'instant. Commence avec le formulaire ci-dessus.</p>`}
    </div>
    <div class="split">
      <div class="card form"><h3>Réglages</h3>
        <label class="f" for="p-name">Prénom de l'élève<input type="text" id="p-name" value="${esc(S.settings.studentName || "")}" placeholder="Ex. Hugo"></label>
        <label class="f" for="p-cover">Photo de VTT pour l'accueil<span class="h">Une photo de son vélo ou d'une sortie, en .jpg ou .png.</span><input type="file" id="p-cover" accept="image/png,image/jpeg,image/webp"></label>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="p-save-settings" type="button">Enregistrer</button>${S.cover ? `<button class="btn ghost" id="p-cover-reset" type="button">Revenir à l'illustration</button>` : ""}</div>
      </div>
      <div class="card form"><h3>Notes automatiques</h3>
        <p class="notice" style="margin:0">Pour que la note s'enregistre toute seule à la fin d'un quiz, le fichier HTML doit envoyer ce message quand l'élève termine. Sinon, l'élève tape sa note en bas de l'écran.</p>
        <pre>parent.postMessage({ type: "quiz-score",
  score: 9, total: 12 }, "*");</pre>
        <p class="notice" style="margin:0">Astuce : demande à Claude un quiz « compatible Ride &amp; Révise » et cette ligne sera incluse.</p>
      </div>
    </div>
  </div>`;
}

function wireParents() {
  $("#lock-form")?.addEventListener("submit", e => {
    e.preventDefault();
    if ($("#lock-code").value === String(CFG.codeParents ?? "1234")) { S.unlocked = true; store.sset("rr-parent", "1"); render(); }
    else { $("#lock-msg").textContent = "Code incorrect."; }
  });
  $("#lock-code")?.focus();
  const form = $("#add-form"); if (!form) return;
  $("#p-lock").addEventListener("click", () => { S.unlocked = false; store.sset("rr-parent", "0"); render(); });
  form.querySelectorAll("[data-pf]").forEach(b => b.addEventListener("click", () => { S.parentForm = b.dataset.pf; render(); }));
  $("#p-subject").addEventListener("change", e => { S.pSubject = e.target.value; S.pLesson = null; render(); });
  $("#p-lesson").addEventListener("change", e => { S.pLesson = e.target.value; $("#p-lesson-new-w").hidden = e.target.value !== "__new"; });
  form.addEventListener("submit", onAdd);
  $("#p-save-settings").addEventListener("click", saveSettings);
  $("#p-cover-reset")?.addEventListener("click", async () => { try { await api("cover", "DELETE"); await api("settings", "PUT", { ...S.settings, coverV: null }); toast("Illustration rétablie"); loadAll(); } catch (e) { toast(dbMessage(e)); } });
  document.querySelectorAll("[data-seed]").forEach(b => b.addEventListener("click", () => seedPack(b)));
}

const readText = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Lecture du fichier impossible.")); r.readAsText(f); });
const readDataUrl = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Lecture du fichier impossible.")); r.readAsDataURL(f); });
async function shrinkImage(file, max = 1800, q = .85) {
  const url = await readDataUrl(file);
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Image illisible.")); i.src = url; });
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", q);
}

async function ensureSubjectLesson() {
  let sid = $("#p-subject").value, lid = $("#p-lesson").value;
  if (sid === "__new") {
    const name = $("#p-subject-new").value.trim(); if (!name) throw new Error("Donne un nom à la nouvelle matière.");
    sid = newId(); await api(`catalog/subjects/${sid}`, "PUT", { name, color: SUBJECT_COLORS[S.subjects.length % SUBJECT_COLORS.length], createdAt: Date.now() }); lid = "__new";
  }
  if (lid === "__new") {
    const title = $("#p-lesson-new").value.trim(); if (!title) throw new Error("Donne un titre à la nouvelle leçon.");
    lid = newId(); await api(`catalog/lessons/${lid}`, "PUT", { subjectId: sid, title, createdAt: Date.now() });
  }
  S.pSubject = sid; S.pLesson = lid;
  return { sid, lid };
}
async function addQuiz(lid, html, file, n, label) {
  const id = newId();
  await api(`quizHtml/${id}`, "PUT", { html });
  await api(`catalog/quizzes/${id}`, "PUT", { lessonId: lid, label: label || `Version ${n}`, file, createdAt: Date.now() + n });
}
async function onAdd(e) {
  e.preventDefault();
  const msg = $("#p-msg"), btn = $("#p-submit");
  const files = [...($("#p-file").files || [])];
  msg.textContent = "";
  if (!files.length) { msg.textContent = "Choisis d'abord un fichier."; return; }
  btn.disabled = true; msg.textContent = "Envoi en cours…";
  try {
    const { lid } = await ensureSubjectLesson();
    if (S.parentForm === "quiz") {
      let n = quizzesOf(lid).length;
      for (const f of files) {
        if (!/\.html?$/i.test(f.name)) throw new Error(`« ${f.name} » n'est pas un fichier .html.`);
        const html = await readText(f);
        if (html.length > 3000000) throw new Error(`« ${f.name} » est trop lourd (plus de 3 Mo).`);
        await addQuiz(lid, html, f.name, ++n);
      }
      toast(files.length > 1 ? `${files.length} versions ajoutées` : "Quiz ajouté");
    } else {
      const f = files[0];
      const title = $("#p-title").value.trim() || f.name.replace(/\.[^.]+$/, "");
      let kind, data;
      if (/\.html?$/i.test(f.name)) { kind = "html"; data = await readText(f); }
      else if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) { if (f.size > 5 * 1024 * 1024) throw new Error("Ce PDF dépasse 5 Mo. Compresse-le avant de l'envoyer."); kind = "pdf"; data = await readDataUrl(f); }
      else if (/^image\//.test(f.type)) { kind = "image"; data = await shrinkImage(f, 2400, .88); }
      else throw new Error("Ce type de fichier n'est pas accepté. Utilise .html, .png, .jpg ou .pdf.");
      const id = newId();
      await api(`mapData/${id}`, "PUT", { data });
      await api(`catalog/maps/${id}`, "PUT", { lessonId: lid, title, kind, createdAt: Date.now() });
      toast("Carte mentale ajoutée");
    }
    await loadAll();
  } catch (err) {
    const m = $("#p-msg"); if (m) m.textContent = err instanceof DbError ? dbMessage(err) : err.message;
  } finally { const b = $("#p-submit"); if (b) b.disabled = false; }
}
async function loadPacks() {
  try { const r = await fetch("contenu/packs.json", { cache: "no-cache" }); if (r.ok) S.packs = await r.json(); } catch {}
}
async function seedPack(btn) {
  const pk = (S.packs || []).find(x => x.id === btn.dataset.seed); if (!pk) return;
  btn.disabled = true; btn.textContent = "Import…";
  try {
    const get = async f => { const r = await fetch("contenu/" + f); if (!r.ok) throw new Error(`Fichier introuvable : contenu/${f}`); return r.text(); };
    const quizHtml = await Promise.all(pk.quiz.map(get));
    const mapHtml = await Promise.all(pk.cartes.map(c => get(c.fichier)));
    const norm = x => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    let sid = S.subjects.find(sb => norm(sb.name) === norm(pk.matiere))?.id;
    if (!sid) { sid = newId(); await api(`catalog/subjects/${sid}`, "PUT", { name: pk.matiere, color: pk.couleur || SUBJECT_COLORS[S.subjects.length % SUBJECT_COLORS.length], createdAt: Date.now() }); }
    let lid = S.lessons.find(l => l.subjectId === sid && norm(l.title) === norm(pk.lecon))?.id;
    if (!lid) { lid = newId(); await api(`catalog/lessons/${lid}`, "PUT", { subjectId: sid, title: pk.lecon, createdAt: Date.now() }); }
    let n = quizzesOf(lid).length;
    for (let i = 0; i < pk.quiz.length; i++) await addQuiz(lid, quizHtml[i], pk.quiz[i], ++n, pk.titres?.[i]);
    for (let i = 0; i < pk.cartes.length; i++) {
      const mid = newId();
      await api(`mapData/${mid}`, "PUT", { data: mapHtml[i] });
      await api(`catalog/maps/${mid}`, "PUT", { lessonId: lid, title: pk.cartes[i].titre, kind: "html", createdAt: Date.now() + i });
    }
    toast(`${pk.lecon} : importé`);
    await loadAll();
  } catch (err) { toast(err instanceof DbError ? dbMessage(err) : err.message); btn.disabled = false; btn.textContent = "Importer"; }
}
async function saveSettings() {
  try {
    const next = { ...S.settings, studentName: $("#p-name").value.trim() };
    const f = $("#p-cover").files?.[0];
    if (f) { const data = await shrinkImage(f, 1800, .82); await api("cover", "PUT", { data }); next.coverV = newId(); }
    await api("settings", "PUT", next);
    toast("Réglages enregistrés");
    await loadAll();
  } catch (err) { toast(err instanceof DbError ? dbMessage(err) : err.message); }
}

let pendingDel = null;
async function onDelete(btn) {
  const key = btn.dataset.del || ("results:" + btn.dataset.delres);
  if (pendingDel !== key) { pendingDel = key; btn.textContent = "Confirmer ?"; setTimeout(() => { if (pendingDel === key) { pendingDel = null; render(); } }, 3500); return; }
  pendingDel = null;
  const [kind, id] = key.split(":");
  try {
    if (kind === "results") { await api(`results/${id}`, "DELETE"); toast("Note effacée"); return loadAll(); }
    const delQuiz = async qid => { await api(`quizHtml/${qid}`, "DELETE"); await api(`catalog/quizzes/${qid}`, "DELETE"); };
    const delMap = async mid => { await api(`mapData/${mid}`, "DELETE"); await api(`catalog/maps/${mid}`, "DELETE"); };
    const delLesson = async lid => { for (const q of quizzesOf(lid)) await delQuiz(q.id); for (const m of mapsOf(lid)) await delMap(m.id); await api(`catalog/lessons/${lid}`, "DELETE"); };
    if (kind === "quizzes") await delQuiz(id);
    if (kind === "maps") await delMap(id);
    if (kind === "lessons") await delLesson(id);
    if (kind === "subjects") { for (const l of lessonsOf(id)) await delLesson(l.id); await api(`subjectPhotos/${id}`, "DELETE"); await api(`catalog/subjects/${id}`, "DELETE"); delete S.subjectPhotos[id]; }
    toast("Supprimé");
    await loadAll();
  } catch (err) { toast(dbMessage(err)); }
}

/* ======================= Lecteur ======================= */
let active = null, blobUrl = null;
const wrapDoc = html => /<html[\s>]/i.test(html) || /<!doctype/i.test(html) ? html
  : `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html}</body></html>`;
function openOverlay(inner) {
  const p = $("#player"); p.innerHTML = inner; p.hidden = false; document.body.style.overflow = "hidden";
  $("#pl-close").addEventListener("click", closePlayer);
}
async function openQuiz(qid) {
  const q = byId(S.quizzes, qid); if (!q) return;
  const l = byId(S.lessons, q.lessonId), s = l && byId(S.subjects, l.subjectId);
  active = { quizId: qid, lessonId: q.lessonId, subjectId: s?.id || null, saved: false };
  openOverlay(`<div class="player-bar gut"><div class="t"><b>${esc(l?.title || "Quiz")} · ${esc(q.label)}</b><span>${esc(s?.name || "")}</span></div><button class="btn ghost small" id="pl-close">Fermer</button></div>
    <iframe id="pl-frame" title="Quiz" sandbox="allow-scripts allow-forms"></iframe>
    <form class="scorebar gut" id="pl-score"><span class="lbl">Ma note :</span><input id="pl-s" inputmode="numeric" type="text" aria-label="Bonnes réponses" placeholder="9"><span>/</span><input id="pl-t" inputmode="numeric" type="text" aria-label="Nombre de questions" placeholder="12"><span class="grow"></span><button class="btn small" type="submit">Enregistrer</button></form>`);
  $("#pl-score").addEventListener("submit", e => { e.preventDefault(); saveScore(Number($("#pl-s").value.replace(",", ".")), Number($("#pl-t").value.replace(",", ".")), false); });
  try {
    const d = await api(`quizHtml/${qid}`);
    if (!d?.html) throw 0;
    if (active?.quizId === qid) $("#pl-frame").srcdoc = wrapDoc(d.html);
  } catch { const fr = $("#pl-frame"); if (fr) fr.srcdoc = `<p style="font-family:sans-serif;padding:20px">Ce quiz n'a pas pu être chargé. Ferme et réessaie.</p>`; }
}
async function openMap(mid) {
  const m = byId(S.maps, mid); if (!m) return;
  active = null;
  openOverlay(`<div class="player-bar gut"><div class="t"><b>${esc(m.title)}</b><span>Carte mentale</span></div><span id="pl-extra"></span><button class="btn ghost small" id="pl-close">Fermer</button></div><div id="pl-body" style="flex:1;display:flex;min-height:0"><div class="empty" style="margin:20px;flex:1"><b>Chargement…</b></div></div>`);
  try {
    const d = await api(`mapData/${mid}`); const body = $("#pl-body"); if (!body || !d?.data) throw 0;
    if (m.kind === "html") { body.innerHTML = `<iframe id="pl-frame" title="${esc(m.title)}" sandbox="allow-scripts"></iframe>`; $("#pl-frame").srcdoc = wrapDoc(d.data); }
    else if (m.kind === "image") body.innerHTML = `<img class="mapimg" src="${d.data}" alt="${esc(m.title)}">`;
    else {
      const blob = await (await fetch(d.data)).blob(); if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = URL.createObjectURL(blob);
      body.innerHTML = `<iframe id="pl-frame" title="${esc(m.title)}" src="${blobUrl}"></iframe>`;
      $("#pl-extra").innerHTML = `<a class="btn small" href="${blobUrl}" target="_blank" rel="noopener" download="${esc(m.title)}.pdf">Ouvrir le PDF</a>`;
    }
  } catch { const body = $("#pl-body"); if (body) body.innerHTML = `<div class="empty" style="margin:20px;flex:1"><b>Carte introuvable</b><span>Ferme et réessaie.</span></div>`; }
}
function closePlayer() { $("#player").hidden = true; $("#player").innerHTML = ""; document.body.style.overflow = ""; active = null; render(); }

async function saveScore(score, total, auto) {
  if (!active) return;
  if (!(total > 0) || !(score >= 0) || score > total) { toast("Note invalide : mets ton nombre de bonnes réponses et le nombre de questions."); return; }
  if (active.saved) return;
  active.saved = true;
  const note20 = Math.round(score / total * 200) / 10;
  const row = { quizId: active.quizId, lessonId: active.lessonId, subjectId: active.subjectId, score, total, note20, at: Date.now(), auto };
  try {
    const r = await api("results", "POST", row);
    S.results.unshift({ id: r?.name || newId(), ...row });
    toast(`${fmtN(note20)}/20 enregistré · ${trailOf(note20).name} !`);
    const sb = $("#pl-score");
    if (sb) sb.innerHTML = `<span class="lbl">Note enregistrée :</span><span class="note ${nClass(note20)} num">${fmtN(note20)}/20</span>${trailHtml(note20)}<span class="grow"></span><button class="btn small" type="button" id="pl-done">Terminer</button>`;
    $("#pl-done")?.addEventListener("click", closePlayer);
  } catch (err) { active.saved = false; toast(dbMessage(err)); }
}
window.addEventListener("message", e => {
  const f = $("#pl-frame");
  if (!active || !f || e.source !== f.contentWindow) return;
  const d = e.data;
  if (d && d.type === "quiz-score") saveScore(Number(d.score), Number(d.total), true);
});

/* ======================= Planning ======================= */
// Chaque créneau = 1 heure : { date: "AAAA-MM-JJ", hour: 17, subjectId, lessonId?, quizId?, note?, done? }
const PLAN_HOURS = Array.from({ length: 14 }, (_, i) => 8 + i); // 8 h → 21 h (dernier créneau 21 h – 22 h)
const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_LONG = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const pad2 = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const mondayOf = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
const fmtDay = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const hourLabel = h => `${h} h – ${h + 1} h`;
S.plan = S.plan || [];
S.weekStart = mondayOf(new Date());
S.planDay = (new Date().getDay() + 6) % 7;
const planNewId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const slotAt = (date, hour) => S.plan.find(p => p.date === date && p.hour === hour);
function slotDone(p) {
  if (p.done) return true;
  return S.results.some(r => ymd(new Date(r.at)) === p.date &&
    (p.quizId ? r.quizId === p.quizId : p.lessonId ? r.lessonId === p.lessonId : r.subjectId === p.subjectId));
}
function slotState(p) {
  if (slotDone(p)) return "done";
  const end = new Date(p.date + "T00:00:00"); end.setHours(p.hour + 1);
  return end < new Date() ? "missed" : "todo";
}
function slotTexts(p) {
  const s = byId(S.subjects, p.subjectId), l = byId(S.lessons, p.lessonId), q = byId(S.quizzes, p.quizId);
  return { s, l, q, title: s?.name || "Matière supprimée", detail: [l?.title, q?.label].filter(Boolean).join(" · ") };
}
function slotBlock(p, compact) {
  const { s, title, detail } = slotTexts(p), st = slotState(p);
  const mark = st === "done" ? `<span class="pl-st ok" title="Fait">✓</span>` : st === "missed" ? `<span class="pl-st miss" title="Pas encore fait">!</span>` : "";
  return `<span class="pl-block ${st}" style="--sc:${esc(s?.color || "var(--muted)")}">
    <span class="pl-t">${esc(title)}${mark}</span>
    ${detail && !compact ? `<span class="pl-d">${esc(detail)}</span>` : detail ? `<span class="pl-d">${esc(detail)}</span>` : ""}
    ${p.note ? `<span class="pl-n">${esc(p.note)}</span>` : ""}</span>`;
}

function viewPlan() {
  const ws = S.weekStart, days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  const first = ymd(days[0]), last = ymd(days[6]), today = ymd(new Date());
  const week = S.plan.filter(p => p.date >= first && p.date <= last);
  const nDone = week.filter(slotDone).length;
  const prevFirst = ymd(addDays(ws, -7)), prevLast = ymd(addDays(ws, -1));
  const prevCount = S.plan.filter(p => p.date >= prevFirst && p.date <= prevLast).length;
  const isThisWeek = ymd(mondayOf(new Date())) === first;
  const perSubject = S.subjects.map(s => ({ s, n: week.filter(p => p.subjectId === s.id).length })).filter(x => x.n);
  const cell = (d, h) => {
    const date = ymd(d), p = slotAt(date, h);
    return `<button class="pl-cell${p ? " filled" : ""}${date === today ? " today" : ""}" data-slot="${date}|${h}" aria-label="${DAY_LONG[(d.getDay() + 6) % 7]} ${fmtDay(d)}, ${hourLabel(h)}${p ? " : " + esc(slotTexts(p).title) : ", libre"}">${p ? slotBlock(p) : `<span class="pl-plus">+</span>`}</button>`;
  };
  const dsel = S.planDay, dd = days[dsel];
  return `<div class="view">
    ${pageHero("Ton programme", "Planning", PHOTO("pierrier"), { pos: "center 60%", sub: week.length ? `${week.length} créneau${week.length > 1 ? "x" : ""} d'1 h cette semaine · ${nDone} fait${nDone > 1 ? "s" : ""}` : "Aucun créneau prévu cette semaine" })}
    <div class="pl-bar">
      <div class="pl-nav">
        <button class="btn ghost small" data-week="-1" aria-label="Semaine précédente">‹</button>
        <b class="num">Semaine du ${fmtDay(days[0])} au ${fmtDay(days[6])}</b>
        <button class="btn ghost small" data-week="1" aria-label="Semaine suivante">›</button>
        ${isThisWeek ? "" : `<button class="btn ghost small" data-week="0">Cette semaine</button>`}
      </div>
      <div class="pl-actions">
        ${prevCount ? `<button class="btn ghost small" id="pl-copy">Copier la semaine précédente (${prevCount})</button>` : ""}
      </div>
    </div>
    ${perSubject.length ? `<div class="pl-sum">${perSubject.map(x => `<span class="pill" style="background:color-mix(in srgb, ${esc(x.s.color)} 18%, transparent);color:${esc(x.s.color)}">${esc(x.s.name)} · ${x.n} h</span>`).join("")}<span class="pl-legend"><span class="pl-st ok">✓</span> fait <span class="pl-st miss">!</span> pas encore fait</span></div>` : `<p class="notice" style="margin:0">Touche un créneau libre pour y placer une révision d'une heure.</p>`}

    <div class="pl-week" role="grid">
      <div class="pl-corner"></div>
      ${days.map((d, i) => `<div class="pl-dh${ymd(d) === today ? " today" : ""}"><b>${DAY_SHORT[i]}</b><span class="num">${d.getDate()}</span></div>`).join("")}
      ${PLAN_HOURS.map(h => `<div class="pl-h num">${h} h</div>${days.map(d => cell(d, h)).join("")}`).join("")}
    </div>

    <div class="pl-day">
      <div class="pl-days">${days.map((d, i) => { const n = week.filter(p => p.date === ymd(d)).length;
        return `<button class="pl-dchip${i === dsel ? " on" : ""}${ymd(d) === today ? " today" : ""}" data-pday="${i}"><b>${DAY_SHORT[i]}</b><span class="num">${d.getDate()}</span>${n ? `<i>${n}</i>` : ""}</button>`; }).join("")}</div>
      <h3 style="margin:4px 0 2px">${DAY_LONG[dsel]} ${fmtDay(dd)}</h3>
      <div class="pl-list">${PLAN_HOURS.map(h => `<div class="pl-row"><span class="pl-h num">${h} h</span>${cell(dd, h)}</div>`).join("")}</div>
    </div>
  </div>`;
}

function wirePlan() {
  const m = $("#main");
  m.querySelectorAll("[data-week]").forEach(b => b.addEventListener("click", () => {
    const k = Number(b.dataset.week);
    S.weekStart = k === 0 ? mondayOf(new Date()) : addDays(S.weekStart, 7 * k);
    S.planDay = k === 0 ? (new Date().getDay() + 6) % 7 : 0;
    render();
  }));
  m.querySelectorAll("[data-pday]").forEach(b => b.addEventListener("click", () => { S.planDay = Number(b.dataset.pday); render(); }));
  m.querySelectorAll("[data-slot]").forEach(b => b.addEventListener("click", () => { const [d, h] = b.dataset.slot.split("|"); openSlot(d, Number(h)); }));
  $("#pl-copy")?.addEventListener("click", copyPrevWeek);
}

async function copyPrevWeek() {
  const b = $("#pl-copy"); if (b) { b.disabled = true; b.textContent = "Copie…"; }
  const pf = ymd(addDays(S.weekStart, -7)), pl = ymd(addDays(S.weekStart, -1));
  const src = S.plan.filter(p => p.date >= pf && p.date <= pl);
  let n = 0;
  try {
    for (const p of src) {
      const d = new Date(p.date + "T00:00:00"); const date = ymd(addDays(d, 7));
      if (slotAt(date, p.hour)) continue;
      const row = { date, hour: p.hour, subjectId: p.subjectId, lessonId: p.lessonId || null, quizId: p.quizId || null, note: p.note || "", done: false, createdAt: Date.now() };
      const id = planNewId(); await PLAN_STORE.save(id, row); S.plan.push({ id, ...row }); n++;
    }
    toast(n ? `${n} créneau${n > 1 ? "x" : ""} copié${n > 1 ? "s" : ""}` : "Ces créneaux sont déjà occupés");
  } catch (err) { toast(PLAN_STORE.errText(err)); }
  render();
}

/* ---------- Fenêtre d'édition d'un créneau ---------- */
function ensureSheet() {
  let el = $("#pl-sheet");
  if (!el) { el = document.createElement("div"); el.id = "pl-sheet"; el.className = "pl-sheet"; el.hidden = true; document.body.appendChild(el); }
  return el;
}
function openSlot(date, hour, keepForm) {
  const p = slotAt(date, hour);
  const d = new Date(date + "T00:00:00");
  const f = keepForm || { subjectId: p?.subjectId || S.subjects[0]?.id || "", lessonId: p?.lessonId || "", quizId: p?.quizId || "", note: p?.note || "", done: !!p?.done };
  const el = ensureSheet();
  if (!S.subjects.length) {
    el.innerHTML = `<div class="pl-panel card form"><h3>${DAY_LONG[(d.getDay() + 6) % 7]} ${fmtDay(d)} · ${hourLabel(hour)}</h3><p class="muted">Il faut d'abord au moins une matière. Les parents l'ajoutent dans l'onglet Parents.</p><div><button class="btn ghost" data-close>Fermer</button></div></div>`;
  } else {
    const ls = lessonsOf(f.subjectId), qs = f.lessonId ? quizzesOf(f.lessonId) : [];
    const st = p ? slotState(p) : null;
    el.innerHTML = `<form class="pl-panel card form" id="pl-form">
      <div class="sec-head"><div><span class="eyebrow">${DAY_LONG[(d.getDay() + 6) % 7]} ${fmtDay(d)}</span><h3>${hourLabel(hour)}</h3></div>
        ${st === "done" ? `<span class="pill n-ok">Fait</span>` : st === "missed" ? `<span class="pill n-bad">Pas encore fait</span>` : ""}</div>
      <label class="f" for="pl-subject">Matière<select id="pl-subject">${S.subjects.map(s => `<option value="${esc(s.id)}" ${s.id === f.subjectId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>
      <label class="f" for="pl-lesson">Leçon<select id="pl-lesson"><option value="">Toute la matière</option>${ls.map(l => `<option value="${esc(l.id)}" ${l.id === f.lessonId ? "selected" : ""}>${esc(l.title)}</option>`).join("")}</select></label>
      ${f.lessonId ? `<label class="f" for="pl-quiz">Quiz à faire<select id="pl-quiz"><option value="">Pas de quiz précis</option>${qs.map(q => `<option value="${esc(q.id)}" ${q.id === f.quizId ? "selected" : ""}>${esc(q.label)}</option>`).join("")}</select></label>` : ""}
      <label class="f" for="pl-note">Consigne<span class="h">Facultatif. Ex. : relire la carte mentale, puis faire le quiz.</span><input type="text" id="pl-note" maxlength="120" value="${esc(f.note)}"></label>
      ${p ? `<label class="pl-check" for="pl-done"><input type="checkbox" id="pl-done" ${f.done ? "checked" : ""}> Révision faite</label>` : ""}
      <div class="pl-btns">
        <button class="btn" type="submit">Enregistrer</button>
        ${p && p.quizId && byId(S.quizzes, p.quizId) ? `<button class="btn ghost" type="button" id="pl-go">Lancer le quiz</button>` : p && p.lessonId ? `<button class="btn ghost" type="button" id="pl-open">Ouvrir la leçon</button>` : ""}
        ${p ? `<button class="btn danger" type="button" id="pl-del">Libérer le créneau</button>` : ""}
        <button class="btn ghost" type="button" data-close>Annuler</button>
      </div>
      <p class="notice" id="pl-msg" role="status"></p>
    </form>`;
  }
  el.hidden = false; document.body.style.overflow = "hidden";
  const read = () => ({ subjectId: $("#pl-subject").value, lessonId: $("#pl-lesson").value, quizId: $("#pl-quiz")?.value || "", note: $("#pl-note").value.trim(), done: $("#pl-done")?.checked || false });
  el.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeSheet));
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); }, { once: true });
  $("#pl-subject")?.addEventListener("change", () => openSlot(date, hour, { ...read(), lessonId: "", quizId: "" }));
  $("#pl-lesson")?.addEventListener("change", () => openSlot(date, hour, { ...read(), quizId: "" }));
  $("#pl-go")?.addEventListener("click", () => { closeSheet(); openQuiz(p.quizId); });
  $("#pl-open")?.addEventListener("click", () => { closeSheet(); S.view = "subjects"; S.subjectId = p.subjectId; S.lessonId = p.lessonId; render(); window.scrollTo(0, 0); });
  let armed = false;
  $("#pl-del")?.addEventListener("click", async e => {
    if (!armed) { armed = true; e.target.textContent = "Confirmer ?"; return; }
    try { await PLAN_STORE.remove(p.id); S.plan = S.plan.filter(x => x.id !== p.id); toast("Créneau libéré"); closeSheet(); render(); }
    catch (err) { $("#pl-msg").textContent = PLAN_STORE.errText(err); }
  });
  $("#pl-form")?.addEventListener("submit", async e => {
    e.preventDefault();
    const v = read();
    if (!v.subjectId) { $("#pl-msg").textContent = "Choisis une matière."; return; }
    const row = { date, hour, subjectId: v.subjectId, lessonId: v.lessonId || null, quizId: v.quizId || null, note: v.note, done: !!v.done, createdAt: p?.createdAt || Date.now() };
    const id = p?.id || planNewId();
    try {
      await PLAN_STORE.save(id, row);
      S.plan = S.plan.filter(x => x.id !== id).concat([{ id, ...row }]);
      toast(p ? "Créneau modifié" : "Révision ajoutée au planning");
      closeSheet(); render();
    } catch (err) { $("#pl-msg").textContent = PLAN_STORE.errText(err); }
  });
}
function closeSheet() { const el = $("#pl-sheet"); if (el) { el.hidden = true; el.innerHTML = ""; } if ($("#player").hidden) document.body.style.overflow = ""; }
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#pl-sheet") && !$("#pl-sheet").hidden) closeSheet(); });

/* ---------- Programme du jour (accueil) ---------- */
function todayCard() {
  const today = ymd(new Date());
  const list = S.plan.filter(p => p.date === today).sort((a, b) => a.hour - b.hour);
  const rows = list.map(p => {
    const { title, detail } = slotTexts(p), st = slotState(p);
    const action = p.quizId && byId(S.quizzes, p.quizId) ? `<button class="btn small" data-play="${esc(p.quizId)}">${st === "done" ? "Refaire" : "Go"}</button>`
      : p.lessonId && byId(S.lessons, p.lessonId) ? `<button class="btn small ghost" data-lesson-open="${esc(p.subjectId)}|${esc(p.lessonId)}">Ouvrir</button>` : "";
    return `<div class="qv"><span class="pl-hour num">${p.hour} h</span><div class="t"><b>${esc(title)}${detail ? " · " + esc(detail) : ""}</b><span class="muted" style="font-size:14px">${p.note ? esc(p.note) : hourLabel(p.hour)}</span></div>
      ${st === "done" ? `<span class="pill n-ok">Fait</span>` : st === "missed" ? `<span class="pill n-bad">À rattraper</span>` : ""}${action}</div>`;
  }).join("");
  return `<div class="card"><div class="sec-head" style="margin-bottom:6px"><h3>Au programme aujourd'hui</h3><button class="btn small ghost" data-go="plan">Planning</button></div>
    ${rows || `<p class="muted" style="margin:6px 0 0">Rien de prévu aujourd'hui. Ajoute un créneau d'une heure dans le planning.</p>`}</div>`;
}

const PLAN_STORE = {
  save: (id, row) => api(`planning/${id}`, "PUT", row),
  remove: id => api(`planning/${id}`, "DELETE"),
  errText: err => err instanceof DbError ? dbMessage(err) : (err?.message || "L'enregistrement a échoué."),
};

/* ======================= Événements ======================= */
$("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; S.view = b.dataset.view; if (S.view === "subjects") { S.subjectId = null; S.lessonId = null; } render(); window.scrollTo(0, 0); });
$("#main").addEventListener("click", e => {
  const t = e.target.closest("[data-subject],[data-lesson],[data-lesson-open],[data-crumb],[data-play],[data-map],[data-go],[data-del],[data-delres]");
  if (!t) return;
  if (t.dataset.del || t.dataset.delres) { e.preventDefault(); e.stopPropagation(); return onDelete(t); }
  if (t.dataset.subject) { S.view = "subjects"; S.subjectId = t.dataset.subject; S.lessonId = null; render(); window.scrollTo(0, 0); }
  else if (t.dataset.lessonOpen) { const [sid, lid] = t.dataset.lessonOpen.split("|"); S.view = "subjects"; S.subjectId = sid; S.lessonId = lid; render(); window.scrollTo(0, 0); }
  else if (t.dataset.lesson) { S.lessonId = t.dataset.lesson; render(); window.scrollTo(0, 0); }
  else if (t.dataset.crumb === "root") { S.subjectId = null; S.lessonId = null; render(); }
  else if (t.dataset.crumb === "subject") { S.lessonId = null; render(); }
  else if (t.dataset.play) openQuiz(t.dataset.play);
  else if (t.dataset.map) openMap(t.dataset.map);
  else if (t.dataset.go) { S.view = t.dataset.go; render(); }
});
$("#main").addEventListener("change", async e => {
  const inp = e.target.closest("input[data-subphoto]"); if (!inp || !inp.files?.[0]) return;
  const sid = inp.dataset.subphoto;
  try {
    toast("Envoi de la photo…");
    const data = await shrinkImage(inp.files[0], 1400, .82);
    await api(`subjectPhotos/${sid}`, "PUT", { data });
    await api(`catalog/subjects/${sid}/photoV`, "PUT", newId());
    S.subjectPhotoV[sid] = null;
    toast("Photo de la matière enregistrée");
    await loadAll();
  } catch (err) { toast(err instanceof DbError ? dbMessage(err) : err.message); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#player").hidden) closePlayer(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && DB && $("#player").hidden) loadAll(); });
setInterval(() => { if (!document.hidden && DB && $("#player").hidden && S.view !== "parents" && !($("#pl-sheet") && !$("#pl-sheet").hidden)) loadAll(); }, 60000);

/* ======================= Démarrage ======================= */
render();
loadPacks();
if (DB) loadAll();

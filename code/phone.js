// The player's phone: shows Nexus messages from the story, with sound and a shake (the same on iPhone and Android).
const params = new URLSearchParams(location.search);
const room = (params.get("room") || "").toUpperCase();
const $ = id => document.getElementById(id);
let french = true, ws, openThread = null, closedByUs = false;
const threads = {}; // id -> { name, msgs: [{ from, fr, en }], unread }
let entries = [], prompts = [], jUnread = 0, view = "msgs";
const saved = (() => { try { return JSON.parse(localStorage.getItem("echo-journal-" + room) || "{}"); } catch (e) { return {}; } })();
const save = () => { try { localStorage.setItem("echo-journal-" + room, JSON.stringify(saved)); } catch (e) { /* optional */ } };

const TXT = {
  calling: { fr: "Bienvenue sur Nexus.", en: "Welcome to Nexus." },
  answer: { fr: "Ouvrir Nexus", en: "Open Nexus" },
  note: { fr: "Gardez cette page ouverte pendant le jeu.", en: "Keep this page open during the game." },
  msgs: { fr: "Messages", en: "Messages" },
  journal: { fr: "Journal", en: "Journal" },
  jTitle: { fr: "Mon journal", en: "My journal" },
  write: { fr: "Écris ici, juste pour toi…", en: "Write here, just for you…" },
  stays: { fr: "Ce que tu écris reste sur ton téléphone.", en: "What you write stays on your phone." },
  jNotif: { fr: "Une question pour toi", en: "A question for you" },
  entry: { fr: "Entrée", en: "Entry" },
  saved: { fr: "Enregistré", en: "Saved" },
  jEmpty: { fr: "Ton journal se remplit au fil de l’histoire.", en: "Your journal fills in as the story goes." },
  empty: { fr: "Aucun message pour l’instant.", en: "No messages yet." },
  noRoom: { fr: "Cette session n’existe plus. Scannez le QR code de l’ordinateur.", en: "This session no longer exists. Scan the computer’s QR code." },
};
const T = k => TXT[k][french ? "fr" : "en"];
const pick = m => (french ? m.fr : m.en);
const clock = () => new Date().toLocaleTimeString(french ? "fr-CH" : "en-GB", { hour: "2-digit", minute: "2-digit" });
const COLORS = ["#ff7aa8", "#ffb86b", "#7dffb2", "#4df0ff", "#a78bff", "#ff4fc3"];
const colorOf = s => COLORS[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

function paintStatic() {
  $("gateText").textContent = T("calling");
  $("answer").textContent = T("answer");
  $("gateNote").textContent = T("note");
  $("tabMsgs").querySelector(".lbl").textContent = T("msgs");
  $("tabJournal").querySelector(".lbl").textContent = T("journal");
  $("tabJournal").querySelector(".dotb").hidden = !jUnread;
  $("tabMsgs").querySelector(".dotb").hidden = !Object.values(threads).some(t => t.unread);
  $("screenTitle").textContent = view === "journal" ? T("jTitle") : T("msgs");
  renderList();
  if (openThread) renderThread();
}

function connect() {
  if (!/^[A-Z0-9]{4}$/.test(room)) { $("gateText").textContent = T("noRoom"); $("answer").hidden = true; return; }
  const proto = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${proto}://${location.host}/?role=phone&room=${room}`);
  ws.onopen = () => send({ type: "hello" });
  ws.onmessage = e => {
    let m; try { m = JSON.parse(e.data); } catch (err) { return; }
    if (m.type === "error") { $("gateText").textContent = T("noRoom"); $("answer").hidden = true; $("gate").hidden = false; closedByUs = true; }
    else if (m.type === "peer" && m.connected && $("gate").hidden === false) startCall();
    else if (m.type === "profile") onProfile(m);
    else if (m.type === "msg") onMessage(m);
    else if (m.type === "journal") { entries = m.entries || []; renderJournal(); }
    else if (m.type === "prompt") onPrompt(m);
  };
  ws.onclose = () => { if (!closedByUs) setTimeout(connect, 1500); };
}
const send = m => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };

function onProfile(m) {
  french = m.french !== false;
  $("meName").textContent = m.name || "";
  if (m.avatar) $("meSil").style.setProperty("--c", m.avatar);
  paintStatic();
}

// ---- The journal on the phone: written entries + questions the player answers herself ----
function onPrompt(m) {
  if (prompts.some(x => x.id === m.id)) return;
  prompts.push({ id: m.id, fr: m.fr, en: m.en });
  if (view !== "journal") { jUnread++; toast(T("journal"), T("jNotif")); }
  feel("normal");
  paintStatic(); renderJournal();
}

function renderJournal() {
  const box = $("jEntries"); box.innerHTML = "";
  if (!entries.length) { const e = document.createElement("p"); e.className = "jempty"; e.textContent = T("jEmpty"); box.appendChild(e); }
  entries.forEach((e, i) => {
    const d = document.createElement("div"); d.className = "entry";
    const s = document.createElement("small"); s.textContent = T("entry") + " " + (i + 1);
    const t = document.createElement("p"); t.textContent = pick(e);
    d.append(s, t); box.appendChild(d);
  });
  const pr = $("jPrompts"); pr.innerHTML = "";
  prompts.forEach(q => {
    const card = document.createElement("div"); card.className = "prompt";
    const t = document.createElement("p"); t.className = "q"; t.textContent = pick(q);
    const ta = document.createElement("textarea"); ta.placeholder = T("write"); ta.value = saved[q.id] || "";
    const grow = () => { ta.style.height = "auto"; ta.style.height = Math.max(130, ta.scrollHeight) + "px"; };
    const foot = document.createElement("div"); foot.className = "foot";
    const note = document.createElement("span"); note.textContent = T("stays");
    const ok = document.createElement("span"); ok.className = "ok"; ok.textContent = "✓ " + T("saved");
    foot.append(note, ok);
    ta.oninput = () => {
      saved[q.id] = ta.value; save(); grow();
      ok.classList.add("on"); clearTimeout(ta.okId); ta.okId = setTimeout(() => ok.classList.remove("on"), 1500);
    };
    ta.onfocus = () => setTimeout(() => card.scrollIntoView({ block: "center", behavior: "smooth" }), 300); // keep it above the keyboard
    card.append(t, ta, foot); pr.appendChild(card);
    setTimeout(grow, 0);
  });
}

function show(v) {
  view = v;
  $("list").hidden = v !== "msgs" || !!openThread;
  $("thread").hidden = v !== "msgs" || !openThread;
  $("journalView").hidden = v !== "journal";
  $("top").hidden = $("gate").hidden === false || (v === "msgs" && !!openThread); // more room while reading a conversation
  $("tabMsgs").classList.toggle("on", v === "msgs");
  $("tabJournal").classList.toggle("on", v === "journal");
  if (v === "journal") { jUnread = 0; renderJournal(); $("journalView").scrollTop = 0; }
  paintStatic();
}

// ---- What a message feels like, the same on every phone: sound + a shake or a silence ----
let audio;
function unlockSound() {
  try { audio = new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch (err) { audio = null; }
}
function tone(freq, start, dur, gain) {
  if (!audio) return;
  const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + start;
  o.type = "sine"; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + dur + 0.05);
}
function feel(kind) {
  const app = $("app");
  if (kind === "cold") { tone(196, 0, 0.5, 0.18); shake(app, "cold"); }                 // low, dull: nobody cares
  else if (kind === "left_out") { tone(220, 0, 0.7, 0.2); tone(147, 0.25, 0.9, 0.2); silence(); } // you are left out
  else { tone(880, 0, 0.15, 0.2); tone(1175, 0.16, 0.2, 0.2); shake(app, "ping"); }
}
function shake(el, cls) { el.classList.remove("ping", "cold"); void el.offsetWidth; el.classList.add(cls); }
function silence() { document.body.classList.add("silent"); clearTimeout(silence.id); silence.id = setTimeout(() => document.body.classList.remove("silent"), 7000); }
// Keeps the screen on so the page stays connected (works on recent iPhone and Android).
async function keepAwake() { try { if (navigator.wakeLock) await navigator.wakeLock.request("screen"); } catch (err) { /* optional */ } }
document.addEventListener("visibilitychange", () => { if (!document.hidden && audio) { audio.resume(); keepAwake(); } });

function startCall() {
  $("gate").hidden = true; $("bar").hidden = false;
  show("msgs"); renderList();
}

function onMessage(m) {
  const t = threads[m.thread] || (threads[m.thread] = { name: m.threadName, msgs: [], unread: 0 });
  t.msgs.push({ from: m.from, fr: m.fr, en: m.en, time: clock() });
  const reading = openThread === m.thread;
  if (!reading) t.unread++;
  feel(m.feel || "normal");
  const who = m.from || pick(t.name);
  if (!reading) toast(who, pick(m));
  renderList();
  if (reading) renderThread();
}

function toast(title, body) {
  const n = $("notif");
  n.innerHTML = ""; const b = document.createElement("b"); b.textContent = title;
  n.append(b, document.createTextNode(body)); n.hidden = false;
  clearTimeout(toast.id); toast.id = setTimeout(() => { n.hidden = true; }, 4500);
}

function renderList() {
  const el = $("list"); el.innerHTML = "";
  const ids = Object.keys(threads);
  if (!ids.length) { const p = document.createElement("p"); p.className = "empty"; p.textContent = T("empty"); el.appendChild(p); return; }
  const initials = s => s.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  ids.reverse().forEach(id => {
    const t = threads[id], last = t.msgs[t.msgs.length - 1], name = pick(t.name);
    const row = document.createElement("button"); row.className = "row" + (t.unread ? " unread" : "");
    const av = document.createElement("span"); av.className = "avatar"; av.style.setProperty("--c", colorOf(name)); av.textContent = initials(name);
    const txt = document.createElement("span"); txt.className = "txt";
    const head = document.createElement("span"); head.className = "head";
    const nm = document.createElement("b"); nm.textContent = name;
    const tm = document.createElement("time"); tm.textContent = last.time || "";
    head.append(nm, tm);
    const pv = document.createElement("span"); pv.className = "prev"; pv.textContent = (last.from ? last.from + " : " : "") + pick(last);
    txt.append(head, pv); row.append(av, txt);
    if (t.unread) { const bd = document.createElement("span"); bd.className = "badge"; bd.textContent = t.unread; row.appendChild(bd); }
    row.onclick = () => { openThread = id; t.unread = 0; showThread(); };
    el.appendChild(row);
  });
}

function showThread() { show("msgs"); renderThread(); }
function renderThread() {
  const t = threads[openThread]; if (!t) return;
  $("threadTitle").textContent = pick(t.name);
  const box = $("bubbles"); box.innerHTML = "";
  t.msgs.forEach(m => {
    const d = document.createElement("div"); d.className = "bubble" + (m.from ? "" : " system");
    if (m.from) { const s = document.createElement("small"); s.textContent = m.from; s.style.setProperty("--c", colorOf(m.from)); d.appendChild(s); }
    d.appendChild(document.createTextNode(pick(m)));
    if (m.time) { const tm = document.createElement("time"); tm.textContent = m.time; d.appendChild(tm); }
    box.appendChild(d);
  });
  box.scrollTop = box.scrollHeight;
}

$("back").onclick = () => { openThread = null; show("msgs"); renderList(); };
$("tabMsgs").onclick = () => { openThread = null; show("msgs"); renderList(); };
$("tabJournal").onclick = () => show("journal");
// A tap is needed before the browser lets the page play sounds (the same on iPhone and Android).
$("answer").onclick = () => {
  unlockSound();
  keepAwake();
  $("answer").disabled = true;
  connect();
};

paintStatic();

// The player's phone: it is the controller of the game. One main screen (what to do now);
// messages and the journal are two small buttons at the top. Same on iPhone and Android.
const Phone = (() => {
const $ = id => document.getElementById(id);
let french = true, openThread = null, view = "choice";
const threads = {};                 // id -> { name, msgs: [{ from, fr, en, image, time }], unread }
let entries = [], prompts = [], jUnread = 0;
let journalOn = false;              // the journal is only there at the end of the story
let chat = null;                    // the scene played in a conversation: { token, ready, answered, choices }
let game = { mode: "wait" };        // what the story asks of the player now (sent by the computer)
let answered = null;                // token of the choice already answered
const saved = (() => { try { return JSON.parse(localStorage.getItem("echo-journal") || "{}"); } catch (e) { return {}; } })();
const save = () => { try { localStorage.setItem("echo-journal", JSON.stringify(saved)); } catch (e) { /* optional */ } };

const TXT = {
  calling: { fr: "Bienvenue sur Nexus", en: "Welcome to Nexus" },
  answer: { fr: "Ouvrir", en: "Open" },
  note: { fr: "", en: "" },
  msgs: { fr: "Messages", en: "Messages" },
  jTitle: { fr: "Mon journal", en: "My journal" },
  back: { fr: "Retour au jeu", en: "Back to the game" },
  empty: { fr: "Aucun message pour l’instant.", en: "No messages yet." },
  noRoom: { fr: "Cette session n’existe plus. Scanne le QR code de l’ordinateur.", en: "This session no longer exists. Scan the computer’s QR code." },
  wait: { fr: "", en: "" },
  sent: { fr: "", en: "" },
  write: { fr: "Écris ici, juste pour toi…", en: "Write here, just for you…" },
  stays: { fr: "Ce que tu écris reste sur ton téléphone.", en: "What you write stays on your phone." },
  jNotif: { fr: "Une question pour toi", en: "A question for you" },
  entry: { fr: "Entrée", en: "Entry" },
  saved: { fr: "Enregistré", en: "Saved" },
  tap: { fr: "Touche un message pour réagir.", en: "Tap a message to react." },
  cancel: { fr: "Annuler", en: "Cancel" },
  hold: { fr: "Maintiens appuyé", en: "Press and hold" },
  writeBtn: { fr: "Écrire à Echo…", en: "Write to Echo…" },
  writePh: { fr: "Tes mots pour Echo", en: "Your words for Echo" },
  send: { fr: "Envoyer", en: "Send" },
  jEmpty: { fr: "Ton journal se remplit au fil de l’histoire.", en: "Your journal fills in as the story goes." },
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
  $("closeText").textContent = T("back");
  $("btnJournal").hidden = !journalOn;
  $("btnMsgs").hidden = !journalOn;          // messages and journal are only there at the end
  $("btnJournal").querySelector(".dotb").hidden = !jUnread;
  $("btnMsgs").querySelector(".dotb").hidden = !Object.values(threads).some(t => t.unread);
  renderList();
  if (openThread) renderThread();
}

// ---------------------------------------------------------------- the story talks to the phone (in the same page)

function receive(m) {
  if (m.type === "profile") {
    french = m.french !== false;
    if (m.photo) { $("mePic").src = m.photo; $("mePic").hidden = false; } else $("mePic").hidden = true;   // the cyberpunk portrait, if the player added one
    paintStatic(); renderGame();
  }
  else if (m.type === "msg") onMessage(m);
  else if (m.type === "journal") { entries = m.entries || []; renderJournal(); }
  else if (m.type === "prompt") onPrompt(m);
  else if (m.type === "state") onState(m);
}
const send = m => Link.toGame(m);

function startCall() {
  $("app").classList.remove("on-gate");   // the small NEXUS bar appears once the welcome screen is gone
  $("gate").hidden = true;
  show("choice"); renderGame();
}

// ---------------------------------------------------------------- the main screen: what to do now

function onState(m) {
  const end = m.token === "end";
  if (end && !journalOn) { journalOn = true; jUnread = 1; }   // the story is over: the journal appears
  if (!end && journalOn) { journalOn = false; jUnread = 0; if (view === "journal") show("choice"); }   // played again: hidden again
  const wasChat = game.ui === "chat";
  const isNew = m.mode === "choose" && (game.mode !== "choose" || game.token !== m.token);
  game = m;
  $("bloom").innerHTML = Flower.svg(m.bloom === undefined ? 1 : m.bloom, 34);
  if (m.ui === "chat") {
    chat = { token: m.token, ready: m.ready, answered: m.answered, choices: m.choices || [] };
    if (!threads[m.thread]) threads[m.thread] = { name: m.threadName, msgs: [], unread: 0 };
    openThread = m.thread; threads[m.thread].unread = 0;
    if (isNew) feel("normal");
    show("chat"); renderThread(); renderChat(); paintStatic();
    return;
  }
  chat = null;
  renderGame();
  paintStatic();
  if (wasChat) { show("choice"); $("notif").hidden = true; }                          // the conversation is over: back to the main screen
  if (isNew) { feel("normal"); show("choice"); }       // the story needs an answer: bring the player here
}

// ---------------------------------------------------------------- inside the conversation: reply, react, leave, put the phone down

function renderChat() {
  const comp = $("composer"), chips = $("chips");
  chips.innerHTML = "";
  const active = chat && chat.ready && !chat.answered && answered !== chat.token;
  comp.hidden = !active;
  $("leaveBtn").hidden = true; $("ignoreBtn").hidden = true;
  renderThread();
  if (!active) return;
  chat.choices.forEach((c, i) => {
    if (c.kind === "reply") {
      const b = document.createElement("button"); b.className = "chip"; b.textContent = pick(c);
      b.onclick = () => act(i);
      chips.appendChild(b);
    } else if (c.kind === "write") {                    // she writes her own words
      const b = document.createElement("button"); b.className = "chip"; b.textContent = "✎ " + T("writeBtn");
      b.onclick = () => {
        chips.hidden = true; $("writeRow").hidden = false;
        $("writeInput").placeholder = T("writePh"); $("writeSend").textContent = T("send"); $("writeInput").focus();
        const go = () => { const v = $("writeInput").value.trim(); if (v) act(i, v); };
        $("writeSend").onclick = go; $("writeInput").onkeydown = e => { if (e.key === "Enter") go(); };
      };
      chips.appendChild(b);
    } else if (c.kind === "leave") {
      const b = $("leaveBtn"); b.hidden = false; b.textContent = pick(c); b.onclick = () => act(i);
    } else if (c.kind === "ignore") {
      const b = $("ignoreBtn"); b.hidden = false; b.textContent = pick(c); b.onclick = () => act(i);
    }
  });
  $("hint").textContent = chat.choices.some(c => c.kind === "react") ? T("tap") : "";
}

// Do the action chosen in the conversation: it is sent to the story, and shown here at once
function act(i, text) {
  if (!chat || !chat.ready || chat.answered || answered === chat.token) return;
  const c = chat.choices[i], token = chat.token, t = threads[openThread];
  answered = token;
  send({ type: "choose", token, index: i, text });
  $("writeRow").hidden = true; $("chips").hidden = false; $("writeInput").value = "";
  if (t) t.msgs.push(c.kind === "write" ? { from: "__me", fr: text, en: text, time: clock() } : c.kind === "reply" ? { from: "__me", fr: c.fr, en: c.en, time: clock() } : { from: null, fr: "✓ " + c.fr, en: "✓ " + c.en, sys: true });
  $("sheet").hidden = true;
  renderChat();
  if (c.kind === "ignore") silence();
}

// Tap a message: what you can do with it (like, report, screenshot…)
function openSheet(key) {
  if (!chat || !chat.ready || chat.answered || answered === chat.token) return;
  const opts = chat.choices.map((c, i) => ({ c, i })).filter(x => x.c.kind === "react" && x.c.msg === key);
  if (!opts.length) return;
  const box = $("sheetBtns"); box.innerHTML = "";
  opts.forEach(x => { const b = document.createElement("button"); b.textContent = pick(x.c); b.onclick = () => act(x.i); box.appendChild(b); });
  $("sheetTitle").textContent = "";
  $("sheetClose").textContent = T("cancel");
  $("sheet").hidden = false;
}

let timerFor = null, timerId = null;
function stopTimer() { clearTimeout(timerId); timerId = null; timerFor = null; $("timer").hidden = true; }
// A choice with a time limit: when the bar is empty, `fallback` is chosen for her (saying nothing is a choice too)
function startTimer(token, secs, fallback) {
  timerFor = token;
  const bar = $("timer").firstElementChild;
  $("timer").hidden = false;
  bar.style.transition = "none"; bar.style.width = "100%"; void bar.offsetWidth;
  bar.style.transition = `width ${secs}s linear`; bar.style.width = "0";
  timerId = setTimeout(() => answerChoice(token, fallback), secs * 1000);
}
function answerChoice(token, i) {
  if (answered === token) return;
  answered = token;
  stopTimer(); stopMech();
  send({ type: "choose", token, index: i });
  renderGame();
}
// A choice you must press and hold (standing up for someone takes effort): a bar fills while you hold
function holdToConfirm(b, done, ms = 900) {
  b.style.setProperty("--hold", ms + "ms");
  b.classList.add("hold");
  const hint = document.createElement("small"); hint.textContent = T("hold"); b.appendChild(hint);
  let t = null;
  const start = e => { if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); if (t) return; b.classList.add("holding"); t = setTimeout(() => { t = null; b.classList.remove("holding"); buzz(60); done(); }, ms); };
  const cancel = () => { clearTimeout(t); t = null; b.classList.remove("holding"); };
  b.addEventListener("pointerdown", start); b.addEventListener("keydown", start);
  ["pointerup", "pointerleave", "pointercancel", "keyup", "blur"].forEach(ev => b.addEventListener(ev, cancel));
  b.addEventListener("contextmenu", e => e.preventDefault());
}

let mechFor = null, mechStops = [];
function stopMech() { mechStops.forEach(f => f()); mechStops = []; mechFor = null; }

function renderGame() {
  if (game.mode === "choose" && game.mech && mechFor === game.token && answered !== game.token) return;   // a small game is running: do not restart it
  const list = $("choiceList"), sent = $("choiceSent");
  list.innerHTML = ""; sent.hidden = true;
  $("choicePrompt").textContent = "";
  if (game.mode === "choose") {
    $("choicePrompt").textContent = game.prompt ? pick(game.prompt) : "";
    if (answered === game.token) { stopTimer(); sent.textContent = T("sent"); sent.hidden = false; return; }
    const token = game.token;
    if (game.mech && MECH[game.mech]) { stopTimer(); stopMech(); mechFor = token; MECH[game.mech](list, token); return; }
    game.choices.forEach((c, i) => {
      const b = document.createElement("button"); b.className = "choice"; b.append(pick(c));
      if (c.hold) holdToConfirm(b, () => answerChoice(token, i), game.holdMs);
      else b.onclick = () => answerChoice(token, i);
      list.appendChild(b);
    });
    if (game.timer) { if (timerFor !== token) startTimer(token, game.timer, game.fallback); } else stopTimer();
  } else {
    stopTimer(); stopMech();
    sent.textContent = T("wait"); sent.hidden = false;     // the story goes on by itself: nothing to do but watch
  }
}


// ---------------------------------------------------------------- small games that choose for you

const MECH = {
  // The class laughs: tap to join in (4 taps or more = laugh), or say no
  laugh(list, token) {
    const secs = game.seconds || 5;
    list.innerHTML = `<div class="crowd"><span>${french ? "Les autres rient…" : "The others are laughing…"}</span><div class="meter"><i id="crowdBar"></i></div></div>
      <button class="laughBtn" id="laughBtn" type="button">${french ? "HA HA" : "HA HA"}</button>
      <div class="meter you"><i id="youBar"></i></div>
      <button class="choice" id="noLaugh" type="button"></button>`;
    $("noLaugh").textContent = pick(game.choices[1]);
    let taps = 0, done = false;
    const crowd = $("crowdBar"); crowd.style.transition = `width ${secs}s ease-out`; void crowd.offsetWidth; crowd.style.width = "100%";
    const finish = i => { if (done) return; done = true; answerChoice(token, i); };
    $("laughBtn").onpointerdown = e => { e.preventDefault(); if (done) return; taps++; $("youBar").style.width = Math.min(100, taps * 25) + "%"; buzz(15); $("laughBtn").classList.remove("pop"); void $("laughBtn").offsetWidth; $("laughBtn").classList.add("pop"); };
    $("noLaugh").onclick = () => finish(1);
    const id = setTimeout(() => finish(taps >= 4 ? 0 : 1), secs * 1000);
    mechStops.push(() => clearTimeout(id));
  },

  // Slide yourself along the bench: next to Echo, alone, or with the group
  drag(list, token) {
    list.innerHTML = `<div class="track" id="track"><span class="zl"></span><span class="zm"></span><span class="zr"></span><div class="token" id="token"></div></div>`;
    const tr = $("track"), tk = $("token");
    tr.querySelector(".zl").textContent = pick(game.choices[0]); tr.querySelector(".zm").textContent = pick(game.choices[2]); tr.querySelector(".zr").textContent = pick(game.choices[1]);
    const pic = $("mePic"); if (!pic.hidden && pic.src) tk.style.backgroundImage = `url(${pic.src})`; else tk.textContent = "◉";
    let x = 0.5, moved = false, drag = false;
    const place = () => { tk.style.left = (x * 100) + "%"; const z = x < 0.34 ? "zl" : x > 0.66 ? "zr" : "zm"; tr.dataset.zone = z; };
    const move = e => { const r = tr.getBoundingClientRect(); x = Math.max(0.06, Math.min(0.94, (e.clientX - r.left) / r.width)); moved = true; place(); };
    tk.onpointerdown = e => { drag = true; tk.setPointerCapture(e.pointerId); e.preventDefault(); };
    tk.onpointermove = e => { if (drag) move(e); };
    const end = () => { if (!drag) return; drag = false; if (!moved) return; buzz(40); const z = tr.dataset.zone; answerChoice(token, z === "zl" ? 0 : z === "zr" ? 1 : 2); };
    tk.onpointerup = end; tk.onpointercancel = end;
    place();
  },

  // Insults appear on Echo's back: tap them to wipe them off before they stay
  wipe(list, token) {
    const secs = game.seconds || 8, words = game.words || [];
    list.innerHTML = `<div class="wipeInfo"><span id="wipeCount"></span><div class="meter"><i id="wipeBar"></i></div></div><div class="wipeArea" id="wipeArea"></div>`;
    const area = $("wipeArea"); let spawned = 0, erased = 0, over = false;
    const total = Math.max(1, Math.floor(secs * 1000 / 650));
    const count = () => { $("wipeCount").textContent = erased + " / " + total; };
    count();
    const bar = $("wipeBar"); bar.style.width = "100%"; bar.style.transition = "none"; void bar.offsetWidth; bar.style.transition = `width ${secs}s linear`; bar.style.width = "0";
    const spawn = () => {
      if (over || spawned >= total) return;
      const w = words[spawned % words.length], b = document.createElement("button");
      b.className = "insult"; b.type = "button"; b.textContent = pick(w);
      b.style.left = (4 + Math.random() * 58) + "%"; b.style.top = (4 + Math.random() * 78) + "%"; b.style.setProperty("--r", (Math.random() * 12 - 6) + "deg");
      b.onpointerdown = e => { e.preventDefault(); if (b.dataset.gone) return; b.dataset.gone = 1; erased++; count(); buzz(20); b.classList.add("gone"); setTimeout(() => b.remove(), 200); };
      area.appendChild(b); spawned++;
      setTimeout(() => { if (!b.dataset.gone) b.classList.add("stay"); }, 1700);   // it stays on Echo's back
    };
    const iv = setInterval(spawn, 650); spawn();
    const end = setTimeout(() => { over = true; clearInterval(iv); const r = erased / total; answerChoice(token, r >= 0.6 ? 0 : r >= 0.3 ? 1 : 2); }, secs * 1000 + 600);
    mechStops.push(() => { clearInterval(iv); clearTimeout(end); });
  },
};

// ---------------------------------------------------------------- which screen is shown

function show(v) {
  view = v;
  $("app").classList.toggle("overlay", v !== "choice");
  const inChat = v === "chat";
  $("choiceView").hidden = v !== "choice";
  $("list").hidden = v !== "msgs" || !!openThread;
  $("thread").hidden = !((v === "msgs" && !!openThread) || inChat);
  $("journalView").hidden = v !== "journal";
  $("viewBar").hidden = v === "choice" || inChat || (v === "msgs" && !!openThread);
  $("back").hidden = inChat;                                 // in a live conversation there is no way out but to act
  $("viewTitle").textContent = v === "journal" ? T("jTitle") : T("msgs");
  if (!inChat) { $("composer").hidden = true; $("leaveBtn").hidden = true; $("sheet").hidden = true; }
  if (v === "journal") { jUnread = 0; renderJournal(); $("journalView").scrollTop = 0; }
  paintStatic();
}

// ---------------------------------------------------------------- messages

function onMessage(m) {
  const t = threads[m.thread] || (threads[m.thread] = { name: m.threadName, msgs: [], unread: 0 });
  t.msgs.push({ from: m.from, fr: m.fr, en: m.en, image: m.image, key: m.key, time: clock() });
  const reading = (view === "msgs" || view === "chat") && openThread === m.thread;
  if (!reading) t.unread++;
  const isGroupEvent = !m.from;
  if (!m.quiet) feel(m.feel || "normal");
  if (isGroupEvent) toast(french ? "Groupe" : "Group", pick(m), "group", m.thread);
  else if (!reading && !m.quiet) toast(m.from, pick(m), "msg", m.thread);
  paintStatic();
  if (reading) { renderThread(); if (view === "chat") renderChat(); }
}

const GROUP_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16.5 14.2c2.7.2 4.5 2.4 4.5 5.3"/></svg>';
const MSG_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H11l-4 3.5V16H4z"/></svg>';

// A notification at the top of the phone (tap it to read). kind: "group", "msg" or "journal"
function toast(title, body, kind, thread) {
  const n = $("notif");
  n.classList.toggle("group", kind === "group");
  $("nIcon").innerHTML = kind === "group" ? GROUP_ICON : MSG_ICON;
  $("nTime").textContent = french ? "maintenant" : "now";
  $("nTitle").textContent = title;
  $("nBody").textContent = body;
  n.hidden = false;
  n.onclick = () => {
    n.hidden = true;
    if (kind === "journal") show("journal");
    else if (thread && threads[thread]) { openThread = thread; threads[thread].unread = 0; show("msgs"); renderThread(); }
  };
  n.style.animation = "none"; void n.offsetWidth; n.style.animation = "";
  clearTimeout(toast.id); toast.id = setTimeout(() => { n.hidden = true; }, kind === "group" ? 6500 : 4500);
}

function renderList() {
  const el = $("list"); el.innerHTML = "";
  const ids = Object.keys(threads).filter(id => threads[id].msgs.length);   // a conversation that has just opened is still empty
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
    row.onclick = () => { openThread = id; t.unread = 0; show("msgs"); renderThread(); };
    el.appendChild(row);
  });
}

function renderThread() {
  const t = threads[openThread]; if (!t) return;
  $("threadTitle").textContent = pick(t.name);
  const box = $("bubbles"); box.innerHTML = "";
  const canReact = key => chat && chat.ready && !chat.answered && chat.choices.some(c => c.kind === "react" && c.msg === key);
  t.msgs.forEach(m => {
    const mine = m.from === "__me";
    const d = document.createElement("div"); d.className = "bubble" + (mine ? " me" : (m.from ? "" : " system"));
    if (m.from && !mine) { const s = document.createElement("small"); s.textContent = m.from; s.style.setProperty("--c", colorOf(m.from)); d.appendChild(s); }
    if (m.image) { const im = document.createElement("img"); im.src = Assets.url(m.image); im.alt = pick(m); d.appendChild(im); }
    else d.appendChild(document.createTextNode(pick(m)));
    if (m.time && !m.sys) { const tm = document.createElement("time"); tm.textContent = m.time; d.appendChild(tm); }
    if (m.key && view === "chat") { d.dataset.key = m.key; if (canReact(m.key)) { d.classList.add("tappable"); d.onclick = () => openSheet(m.key); } }
    box.appendChild(d);
  });
  box.scrollTop = box.scrollHeight;
}

// ---------------------------------------------------------------- journal: written entries + questions the player answers herself

function onPrompt(m) {
  if (prompts.some(x => x.id === m.id)) return;
  prompts.push({ id: m.id, fr: m.fr, en: m.en });
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
    ta.onfocus = () => setTimeout(() => card.scrollIntoView({ block: "center", behavior: "smooth" }), 300);   // keep it above the keyboard
    card.append(t, ta, foot); pr.appendChild(card);
    setTimeout(grow, 0);
  });
}

// ---------------------------------------------------------------- what a message feels like: sound + a shake, vibration where allowed

let audio;
function unlockSound() { try { audio = new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch (err) { audio = null; } }
function tone(freq, start, dur, gain) {
  if (!audio) return;
  const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + start;
  o.type = "sine"; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + dur + 0.05);
}
// Vibration works on most Android phones; iPhone browsers do not allow it, so everyone also gets sound and a shake.
const buzz = pattern => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (err) { /* not supported */ } };
function feel(kind) {
  const app = $("app");
  if (kind === "cold") { tone(196, 0, 0.5, 0.18); shake(app, "cold"); buzz([450]); }
  else if (kind === "left_out") { tone(220, 0, 0.7, 0.2); tone(147, 0.25, 0.9, 0.2); silence(); buzz([120, 60, 120, 60, 500]); }
  else if (kind === "group") { tone(659, 0, 0.14, 0.2); tone(523, 0.15, 0.14, 0.2); tone(784, 0.3, 0.25, 0.2); shake(app, "ping"); buzz([220, 90, 220]); }
  else { tone(880, 0, 0.15, 0.2); tone(1175, 0.16, 0.2, 0.2); shake(app, "ping"); buzz([130, 70, 130]); }
}
function shake(el, cls) { el.classList.remove("ping", "cold"); void el.offsetWidth; el.classList.add(cls); }
function silence() { /* no grey screen any more: one thing at a time */ }
// Keeps the screen on so the page stays connected (works on recent iPhone and Android).
async function keepAwake() { try { if (navigator.wakeLock) await navigator.wakeLock.request("screen"); } catch (err) { /* optional */ } }
document.addEventListener("visibilitychange", () => { if (!document.hidden && audio) { audio.resume(); keepAwake(); } });

// ---------------------------------------------------------------- buttons

$("btnMsgs").onclick = () => { openThread = null; show("msgs"); };
$("btnJournal").onclick = () => show("journal");
$("closeView").onclick = () => show(chat ? "chat" : "choice");
$("sheetClose").onclick = () => { $("sheet").hidden = true; };
$("back").onclick = () => { openThread = null; show("msgs"); };
// A tap is needed before the browser lets the page play sounds (the same on iPhone and Android).
$("answer").onclick = () => { unlockSound(); buzz(40); keepAwake(); startCall(); Phone.onOpen(); };

paintStatic();

return { receive, onOpen: () => {} };
})();

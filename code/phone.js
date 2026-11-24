// The player's phone: the remote of the game (the story plays on the computer screen). One main screen (what to do now);
// messages and the journal are two small buttons at the top. Same on iPhone and Android.
const Phone = (() => {
const $ = id => document.getElementById(id);
let french = new URLSearchParams(location.search).get("lang") !== "en", openThread = null, view = "choice";
const threads = {};                 // id -> { name, msgs: [{ from, fr, en, image, time }], unread }
let entries = [], prompts = [], jUnread = 0;
let journalOn = false;              // the journal is only there at the end of the story
let chat = null;                    // the scene played in a conversation: { token, ready, answered, choices }
let game = { mode: "wait" };        // what the story asks of the player now (sent by the computer)
let answered = null;                // token of the choice already answered
let ready = false;                  // the computer has sent the player's profile: Nexus can be opened
const saved = (() => { try { return JSON.parse(localStorage.getItem("echo-journal") || "{}"); } catch (e) { return {}; } })();
const save = () => { try { localStorage.setItem("echo-journal", JSON.stringify(saved)); } catch (e) { /* optional */ } };

const TXT = {
  calling: { fr: "Connexion à Nexus", en: "Log in to Nexus" },
  answer: { fr: "Se connecter", en: "Log in" },
  note: { fr: "", en: "" },
  lookScreen: { fr: "Regarde l’écran de l’ordinateur.", en: "Look at the computer screen." },
  msgs: { fr: "Messages", en: "Messages" },
  jTitle: { fr: "Mon journal", en: "My journal" },
  back: { fr: "Retour au jeu", en: "Back to the game" },
  empty: { fr: "Aucun message pour l’instant.", en: "No messages yet." },
  noRoom: { fr: "Cette session n’existe plus. Scanne le QR code de l’ordinateur.", en: "This session no longer exists. Scan the computer’s QR code." },
  wait: { fr: "Regarde l’écran de l’ordinateur.", en: "Look at the computer screen." },
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
  memeBtn: { fr: "Créer un mème", en: "Make a meme" },
  memeTitle: { fr: "Ton mème sur Echo", en: "Your meme about Echo" },
  memeTop: { fr: "Texte du haut", en: "Top text" },
  memeBottom: { fr: "Texte du bas", en: "Bottom text" },
  memeMock: { fr: "Pour se moquer", en: "To make fun" },
  memeSupport: { fr: "Pour la défendre", en: "To defend Echo" },
  memePost: { fr: "Publier", en: "Post" },
  feelTitle: { fr: "Comment tu te sens ?", en: "How do you feel?" },
  feelMemory: { fr: "Ça me fait penser à une scène que j’ai vécue…", en: "It reminds me of a scene I lived…" },
  feelOther: { fr: "Ce que j’aurais voulu faire ou dire…", en: "What I would have wanted to do or say…" },
  noteBtn: { fr: "Ajouter ma note", en: "Add my note" },
  notePh: { fr: "Ça me rappelle… / ce que je ressens…", en: "It reminds me of… / what I feel…" },
  qIntro: { fr: "Ces questions sont pour la classe. Tu peux envoyer ta réponse anonymement : personne ne saura que c’est toi, et on en parlera ensemble. Ou la garder pour toi.", en: "These questions are for the class. You can send your answer anonymously: nobody will know it’s you, and we’ll talk about it together. Or keep it to yourself." },
  qSend: { fr: "Envoyer anonymement", en: "Send anonymously" },
  qKeep: { fr: "Garder pour moi", en: "Keep it to myself" },
  qSent: { fr: "✓ Envoyée anonymement", en: "✓ Sent anonymously" },
  qKept: { fr: "✓ Gardée pour moi", en: "✓ Kept to myself" },
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
  $("gateNote").textContent = ready ? T("note") : T("lookScreen");
  $("profile").hidden = !ready;
  const P = k => french ? PROFILE[k].fr : PROFILE[k].en;
  $("nameLabel").textContent = P("nameLabel");
  $("nameInput").placeholder = P("namePlaceholder");
  $("uploadText").textContent = P(me.photo ? "uploadChange" : "upload");
  $("adjustBtn").textContent = P("adjust");
  $("adjustBtn").hidden = !me.photo;
  $("uploadErr").textContent = P("uploadErr");
  $("slotImg").hidden = !me.photo; $("slotPlus").hidden = !!me.photo;
  if (me.photo) $("slotImg").src = me.photo.big;
  $("answer").disabled = !ready || !$("nameInput").value.trim();   // only the name is required
  $("closeText").textContent = T("back");
  $("btnJournal").hidden = true;
  $("btnMsgs").hidden = true;                // no chat or journal buttons: the journal simply opens at the end
  $("btnJournal").querySelector(".dotb").hidden = !jUnread;
  $("btnMsgs").querySelector(".dotb").hidden = !Object.values(threads).some(t => t.unread);
  renderList();
  if (openThread) renderThread();
}

// ---------------------------------------------------------------- the story talks to the phone (in the same page)

function receive(m) {
  if (m.type === "clearnotif") $("notif").hidden = true;
  else if (m.type === "ready") { french = m.french !== false; ready = true; paintStatic(); }   // the introduction is over: log in
  else if (m.type === "profile") {
    french = m.french !== false;
    if (m.preload) Assets.preload(m.preload);   // the pictures of the conversations are ready before they arrive
    if (m.started && !$("gate").hidden) { ready = true; startCall(); }   // the phone came back during the game
    paintStatic(); renderGame();
  }
  else if (m.type === "msg") onMessage(m);
  else if (m.type === "journal") { entries = m.entries || []; renderJournal(); }
  else if (m.type === "prompt") onPrompt(m);
  else if (m.type === "state") onState(m);
}
const send = m => Link.send(m);

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
  if (end) { renderJournal(); show("journal"); }   // the story is over: the journal is the screen (questions, replay)
  if (wasChat) { show("choice"); $("notif").hidden = true; }                          // the conversation is over: back to the main screen
  if (isNew && !end) { feel("normal"); show("choice"); }       // the story needs an answer: bring the player here (not at the end: the journal stays)
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
    if ((c.kind === "reply" || c.kind === "action") && usesSheet()) { /* in the tap sheet */ }
    else if (c.kind === "reply") {
      const b = document.createElement("button"); b.className = "chip"; b.textContent = pick(c);
      b.onclick = () => act(i);
      chips.appendChild(b);
    } else if (c.kind === "action") {                   // an action shown as a line, not as a message of hers
      const b = document.createElement("button"); b.className = "chip"; b.textContent = pick(c);
      b.onclick = () => act(i);
      chips.appendChild(b);
    } else if (c.kind === "meme" && !usesSheet()) {   // with a message to tap, the meme maker is in the sheet
      const b = document.createElement("button"); b.className = "chip"; b.textContent = "✎ " + T("memeBtn");
      b.onclick = () => openMemeMaker(i);
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
  $("hint").textContent = chat.choices.some(c => c.kind === "react") || usesSheet() ? T("tap") : "";
}

// Do the action chosen in the conversation: it is sent to the story, and shown here at once
function act(i, text, extra = {}) {
  if (!chat || !chat.ready || chat.answered || answered === chat.token) return;
  const c = chat.choices[i], token = chat.token, t = threads[openThread];
  answered = token;
  send({ type: "choose", token, index: i, text, stance: extra.stance });
  $("writeRow").hidden = true; $("chips").hidden = false; $("writeInput").value = "";
  if (t) t.msgs.push(extra.image ? { from: "__me", fr: "[mème]", en: "[meme]", image: extra.image, time: clock() } : c.kind === "write" ? { from: "__me", fr: text, en: text, time: clock() } : c.kind === "reply" ? { from: "__me", fr: c.fr, en: c.en, time: clock() } : { from: null, fr: "✓ " + c.fr, en: "✓ " + c.en, sys: true });
  $("sheet").hidden = true;
  renderChat();
  if (c.kind === "ignore") silence();
}

// Tap a message: what you can do with it (like, report, screenshot…)
function openSheet(key) {
  if (!chat || !chat.ready || chat.answered || answered === chat.token) return;
  const opts = sheetChoices(key);   // the meme maker is one of the reactions
  if (!opts.length) return;
  const box = $("sheetBtns"); box.innerHTML = "";
  opts.forEach(x => { const b = document.createElement("button"); b.textContent = (x.c.kind === "meme" ? "✎ " : "") + pick(x.c); b.onclick = () => { if (x.c.kind === "meme") { $("sheet").hidden = true; openMemeMaker(x.i); } else act(x.i); }; box.appendChild(b); });
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
  $("choiceView").classList.toggle("emojiMode", game.token !== "end");   // the phone screen is always entirely used
  const list = $("choiceList"), sent = $("choiceSent");
  list.innerHTML = ""; list.classList.remove("emojis"); sent.hidden = true;
  $("choicePrompt").textContent = "";
  if (game.token === "end") return;   // the end: no buttons here, the journal is the screen (replay is a long press there)
  if (game.mode === "choose") {
    $("choicePrompt").textContent = game.prompt ? pick(game.prompt) : "";
    if (answered === game.token) { stopTimer(); waitPanel(list); return; }
    const token = game.token;
    if (game.mech && MECH[game.mech]) { stopTimer(); stopMech(); mechFor = token; MECH[game.mech](list, token); return; }
    list.classList.toggle("emojis", !!game.emoji);   // scene 1: four faces
    game.choices.forEach((c, i) => {
      const b = document.createElement("button"); b.className = game.emoji ? "choice emoji" : "choice";
      if (game.big && game.big[i]) {   // the laugh: a big tile, one more "HA" at every tap; the laugh is sent a moment after the last tap
        b.classList.add("bigtile");
        const h = document.createElement("span"); h.className = "ha"; h.textContent = "HA";
        const s = document.createElement("small"); s.textContent = pick(c); b.append(h, s);
        let n = 1, t = null;   // one "HA" is already written
        b.onclick = () => {
          n++; h.textContent = Array(n).fill("HA").join(" "); h.style.fontSize = Math.max(24, 64 - n * 4) + "px";
          buzz(15); b.classList.remove("tapped"); void b.offsetWidth; b.classList.add("tapped");
          clearTimeout(t); t = setTimeout(() => answerChoice(token, i), 1500);   // a short moment to tap again
        };
        list.appendChild(b); return;
      }
      else b.append(pick(c));
      if (c.hold) holdToConfirm(b, () => answerChoice(token, i), game.holdMs);
      else b.onclick = () => answerChoice(token, i);
      list.appendChild(b);
    });
    if (game.timer) { if (timerFor !== token) startTimer(token, game.timer, game.fallback); } else stopTimer();
  } else {
    stopTimer(); stopMech();
    waitPanel(list);                                        // the story goes on by itself: nothing to do but watch
  }
}

// Nothing to answer: a calm full page (a flower, "look at the screen") so the phone is never empty
function waitPanel(list) {
  list.innerHTML = `<div class="waitFill"><div class="waitFlower">${Flower.svg(1, 96)}</div><p>${T("wait")}</p></div>`;
}


// ---------------------------------------------------------------- small games that choose for you

const MECH = {
  // The class laughs: tap to join in (a "HA" for every tap, no time limit), or say no
  laugh(list, token) {
    list.innerHTML = `<div class="crowd"><span>${french ? "Les autres rient…" : "The others are laughing…"}</span></div>
      <button class="laughBtn" id="laughBtn" type="button">HA</button>
      <button class="choice" id="noLaugh" type="button"></button>`;
    $("noLaugh").textContent = pick(game.choices[1]);
    let taps = 1, done = false, t = null;   // one "HA" is already written
    const finish = i => { if (done) return; done = true; clearTimeout(t); answerChoice(token, i); };
    $("laughBtn").onpointerdown = e => {
      e.preventDefault(); if (done) return; taps++;
      $("laughBtn").textContent = Array(taps).fill("HA").join(" "); $("laughBtn").style.fontSize = Math.max(16, 28 - taps * 1.5) + "px";
      buzz(15); $("laughBtn").classList.remove("pop"); void $("laughBtn").offsetWidth; $("laughBtn").classList.add("pop");
      clearTimeout(t); t = setTimeout(() => finish(0), 1500);   // the laugh is sent a moment after the last tap
    };
    $("noLaugh").onclick = () => finish(1);
    mechStops.push(() => clearTimeout(t));
  },

  // A flower sticker to move to one of the places written on the screen (positions in game.spots)
  drag(list, token) {
    const POS = { tl: [0.22, 0.12], tr: [0.78, 0.12], b: [0.5, 0.9], t: [0.5, 0.1], l: [0.22, 0.5], bl: [0.22, 0.9] };   // x, y in the area
    const spots = game.spots && game.spots.length ? game.spots : [{ i: 2, at: "tl" }, { i: 0, at: "tr" }, { i: 1, at: "b" }];
    list.innerHTML = `<div class="stArea" id="stArea">${spots.map((sp, k) => `<span class="sz" data-k="${k}" style="left:${POS[sp.at][0] * 100}%;top:${POS[sp.at][1] * 100}%"></span>`).join("")}<div class="stFlower" id="stFlower"></div></div>`;
    const area = $("stArea"), fl = $("stFlower");
    area.querySelectorAll(".sz").forEach((el, k) => { el.textContent = pick(game.choices[spots[k].i]); });
    fl.innerHTML = Flower.svg(1, 84);
    let x = 0.5, y = 0.52, moved = false, drag = false;
    const zone = () => {   // the nearest place, once the flower has left the middle
      if (Math.hypot(x - 0.5, y - 0.52) < 0.16) return -1;
      let best = 0, d = 9;
      spots.forEach((sp, k) => { const e = Math.hypot(x - POS[sp.at][0], (y - POS[sp.at][1]) * 0.7); if (e < d) { d = e; best = k; } });
      return best;
    };
    const place = () => { fl.style.left = (x * 100) + "%"; fl.style.top = (y * 100) + "%"; area.dataset.zone = zone(); };
    const move = e => { const r = area.getBoundingClientRect(); x = Math.max(0.08, Math.min(0.92, (e.clientX - r.left) / r.width)); y = Math.max(0.1, Math.min(0.92, (e.clientY - r.top) / r.height)); moved = true; place(); };
    fl.onpointerdown = e => { drag = true; fl.classList.add("dragging"); fl.setPointerCapture(e.pointerId); e.preventDefault(); };
    fl.onpointermove = e => { if (drag) move(e); };
    const end = () => {
      if (!drag) return; drag = false; fl.classList.remove("dragging");
      const z = zone();
      if (!moved || z < 0) { x = 0.5; y = 0.52; moved = false; place(); return; }   // not far enough: the flower goes back
      buzz(40); answerChoice(token, spots[z].i);
    };
    fl.onpointerup = end; fl.onpointercancel = end;
    place();
  },

  // (old version) Slide yourself along the bench: next to Echo, alone, or with the group
  dragBench(list, token) {
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
    list.innerHTML = `<div class="wipeInfo"><span id="wipeCount"></span></div><div class="wipeArea" id="wipeArea"></div>`;
    const area = $("wipeArea"); let spawned = 0, erased = 0, over = false;
    const total = Math.max(1, Math.floor(secs * 1000 / 650));
    const count = () => { $("wipeCount").textContent = erased + " / " + total; };
    count();
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
    const end = setTimeout(() => { over = true; clearInterval(iv); const r = erased / total; answerChoice(token, r >= 0.6 ? 0 : r >= 0.3 ? 1 : 2); }, total * 650 + 2000);   // once the last insult has had its time
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
  $("closeView").hidden = journalOn && v === "journal";   // at the end there is no way back: only replay
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
  if (isGroupEvent && !m.quiet && !reading) toast(french ? "Groupe" : "Group", pick(m), "group", m.thread);
  else if (!reading && !m.quiet) toast(m.from, pick(m), "msg", m.thread);
  paintStatic();
  if (reading) { renderThread(); if (view === "chat") renderChat(); }
}

const GROUP_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16.5 14.2c2.7.2 4.5 2.4 4.5 5.3"/></svg>';
const MSG_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H11l-4 3.5V16H4z"/></svg>';

// A notification at the top of the phone (only to look at). kind: "group", "msg" or "journal"
function toast(title, body, kind, thread) {
  const n = $("notif");
  n.classList.toggle("group", kind === "group");
  $("nIcon").innerHTML = kind === "group" ? GROUP_ICON : MSG_ICON;
  $("nTime").textContent = french ? "maintenant" : "now";
  $("nTitle").textContent = title;
  $("nBody").textContent = body;
  n.hidden = false;
  n.onclick = null;   // a notification is only to look at: it cannot be tapped
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

// In a conversation the player acts by tapping the message (the image): which choices that opens.
// A scene with a message to tap puts every answer there (reply, action, reaction, meme); the other buttons stay below.
const usesSheet = () => { const t = threads[openThread]; return !!(chat && t && t.msgs.some(m => m.key) && !chat.choices.some(c => c.kind === "write")); };
const sheetChoices = key => (chat ? chat.choices.map((c, i) => ({ c, i })).filter(x => (x.c.kind === "react" && x.c.msg === key) || (usesSheet() && ["reply", "action", "meme"].includes(x.c.kind))) : []);
function renderThread() {
  const t = threads[openThread]; if (!t) return;
  $("threadTitle").textContent = pick(t.name);
  const box = $("bubbles"); box.innerHTML = "";
  const canReact = key => chat && chat.ready && !chat.answered && sheetChoices(key).length > 0;
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


// ---------------------------------------------------------------- the meme maker: a picture, two lines of text, and what it is for

const MEME_BGS = ["images/classe.png", "images/couloir.png", "images/toit.png"];
function openMemeMaker(index) {
  const box = $("memeMaker"), cv = $("memeCanvas"), g = cv.getContext("2d");
  let bg = MEME_BGS[0], tone = null, mine = null;   // mine: a picture imported from the phone
  $("memeTitle").textContent = T("memeTitle");
  $("memeTop").placeholder = T("memeTop"); $("memeBottom").placeholder = T("memeBottom");
  $("memeTop").value = ""; $("memeBottom").value = "";
  const [bMock, bSupport] = $("memeTone").children;
  bMock.textContent = T("memeMock"); bSupport.textContent = T("memeSupport");
  $("memeCancel").textContent = T("cancel"); $("memePost").textContent = T("memePost");
  const thumbs = $("memeBgs"); thumbs.innerHTML = "";
  MEME_BGS.forEach(p => {
    const b = document.createElement("button"); b.type = "button"; b.className = "thumb"; b.style.backgroundImage = `url(${Assets.url(p)})`;
    b.onclick = () => { bg = p; draw(); };
    thumbs.appendChild(b);
  });
  const up = document.createElement("label"); up.className = "thumb upload"; up.innerHTML = '<span>+</span><input type="file" accept="image/*" hidden>';
  up.querySelector("input").onchange = e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const url = URL.createObjectURL(f), im = new Image();
    im.onload = () => { mine = im; bg = "mine"; up.style.backgroundImage = `url(${url})`; draw(); };
    im.src = url;
  };
  thumbs.appendChild(up);
  // the text sits on the picture, white with a black outline, as small as needed to fit
  const line = (txt, y, base) => {
    txt = txt.toUpperCase(); if (!txt) return;
    let size = 54; g.font = `900 ${size}px Impact, "Arial Black", sans-serif`;
    while (g.measureText(txt).width > cv.width - 40 && size > 20) { size -= 2; g.font = `900 ${size}px Impact, "Arial Black", sans-serif`; }
    g.textAlign = "center"; g.textBaseline = base; g.lineJoin = "round"; g.lineWidth = Math.max(5, size / 7); g.strokeStyle = "#000"; g.fillStyle = "#fff";
    g.strokeText(txt, cv.width / 2, y); g.fillText(txt, cv.width / 2, y);
  };
  function draw() {
    g.fillStyle = "#08070f"; g.fillRect(0, 0, cv.width, cv.height);
    const im = bg === "mine" ? mine : Assets.img(bg);
    if (im) { const s = Math.max(cv.width / im.width, cv.height / im.height); g.drawImage(im, (cv.width - im.width * s) / 2, (cv.height - im.height * s) / 2, im.width * s, im.height * s); }
    const echo = bg === "mine" ? null : Assets.img("images/characters/echo.png");   // her own picture is shown alone
    if (echo) { const h = cv.height * 0.8, w = echo.width * h / echo.height; g.drawImage(echo, (cv.width - w) / 2, cv.height - h - 10, w, h); }
    line($("memeTop").value, 14, "top"); line($("memeBottom").value, cv.height - 14, "bottom");
    [...thumbs.children].forEach((b, i) => b.classList.toggle("on", i < MEME_BGS.length ? MEME_BGS[i] === bg : bg === "mine"));
    $("memePost").disabled = !tone || !($("memeTop").value.trim() || $("memeBottom").value.trim());
  }
  [bMock, bSupport].forEach(b => { b.classList.remove("on"); b.onclick = () => { tone = b.dataset.tone; bMock.classList.toggle("on", b === bMock); bSupport.classList.toggle("on", b === bSupport); draw(); }; });
  $("memeTop").oninput = draw; $("memeBottom").oninput = draw;
  $("memeCancel").onclick = () => { box.hidden = true; };
  $("memePost").onclick = () => {
    const caption = [$("memeTop").value.trim(), $("memeBottom").value.trim()].filter(Boolean).join(" / ");
    const image = cv.toDataURL("image/jpeg", 0.72);
    box.hidden = true;
    act(index, caption, { stance: tone, image });
  };
  box.hidden = false; draw();
}

// ---------------------------------------------------------------- journal: written entries + questions the player answers herself

function onPrompt(m) {
  if (prompts.some(x => x.id === m.id)) return;
  prompts.push({ id: m.id, fr: m.fr, en: m.en });
  paintStatic(); renderJournal();
}

const FEELINGS = [
  { id: "sad", fr: "Triste", en: "Sad" }, { id: "angry", fr: "En colère", en: "Angry" }, { id: "uneasy", fr: "Mal à l’aise", en: "Uneasy" },
  { id: "guilty", fr: "Coupable", en: "Guilty" }, { id: "relieved", fr: "Soulagé·e", en: "Relieved" }, { id: "proud", fr: "Fier·ère", en: "Proud" },
  { id: "lost", fr: "Perdu·e", en: "Lost" }, { id: "nothing", fr: "Rien de spécial", en: "Nothing special" },
];
// A text box that saves what is written, on this phone only
function noteBox(key, placeholder, minH = 90) {
  const ta = document.createElement("textarea"); ta.placeholder = placeholder; ta.value = saved[key] || "";
  const grow = () => { ta.style.height = "auto"; ta.style.height = Math.max(minH, ta.scrollHeight) + "px"; };
  const ok = document.createElement("span"); ok.className = "ok"; ok.textContent = "✓ " + T("saved");
  ta.oninput = () => { saved[key] = ta.value; save(); grow(); ok.classList.add("on"); clearTimeout(ta.okId); ta.okId = setTimeout(() => ok.classList.remove("on"), 1500); };
  ta.onfocus = () => setTimeout(() => ta.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
  setTimeout(grow, 0);
  return [ta, ok];
}

// The questions at the end, to answer in her own words (they stay on the phone)
const END_Q = [
  { id: "end1", fr: "Quelle scène m’a le plus marqué·e, et pourquoi ?", en: "Which scene stayed with me the most, and why?" },
  { id: "end2", fr: "Est-ce que j’ai déjà vécu quelque chose de pareil ? Qu’est-ce que j’ai fait ?", en: "Have I ever lived something like this? What did I do?" },
  { id: "end3", fr: "Qu’est-ce que j’aurais voulu faire ou dire autrement ?", en: "What would I have wanted to do or say differently?" },
  { id: "end4", fr: "Si Echo existait dans ma classe, qu’est-ce que je voudrais lui dire ?", en: "If Echo existed in my class, what would I want to tell them?" },
];

function renderJournal() {
  // How do I feel? Does it remind me of something I lived? (free, saved on the phone)
  const fb = $("jFeel"); fb.innerHTML = "";
  const card = document.createElement("div"); card.className = "prompt feel";
  const q = document.createElement("p"); q.className = "q"; q.textContent = T("feelTitle");
  const chips = document.createElement("div"); chips.className = "feelChips";
  const picked = new Set(saved.feel || []);
  FEELINGS.forEach(f => {
    const b = document.createElement("button"); b.type = "button"; b.className = "feelChip" + (picked.has(f.id) ? " on" : ""); b.textContent = pick(f);
    b.onclick = () => { picked.has(f.id) ? picked.delete(f.id) : picked.add(f.id); saved.feel = [...picked]; save(); b.classList.toggle("on", picked.has(f.id)); };
    chips.appendChild(b);
  });
  card.append(q, chips); fb.appendChild(card);

  $("jEntries").innerHTML = "";   // what happened is now told on the computer screen: here, only questions
  const pr = $("jPrompts"); pr.innerHTML = "";
  const intro = document.createElement("p"); intro.className = "qIntro"; intro.textContent = T("qIntro"); pr.appendChild(intro);
  [...prompts, ...END_Q].forEach(q => {
    const card = document.createElement("div"); card.className = "prompt";
    const t = document.createElement("p"); t.className = "q"; t.textContent = pick(q);
    const ta = document.createElement("textarea"); ta.placeholder = T("write"); ta.value = saved[q.id] || "";
    const grow = () => { ta.style.height = "auto"; ta.style.height = Math.max(130, ta.scrollHeight) + "px"; };
    const foot = document.createElement("div"); foot.className = "foot";
    const note = document.createElement("span"); note.textContent = T("stays");
    const ok = document.createElement("span"); ok.className = "ok"; ok.textContent = "✓ " + T("saved");
    foot.append(note, ok);
    // send it anonymously to the class, or keep it to myself
    const acts = document.createElement("div"); acts.className = "qActs";
    const sendB = document.createElement("button"); sendB.type = "button"; sendB.className = "qSend";
    const keepB = document.createElement("button"); keepB.type = "button"; keepB.className = "qKeep";
    const paint = () => {
      const mode = saved[q.id + "_mode"];
      sendB.textContent = mode === "sent" ? T("qSent") : T("qSend"); sendB.disabled = mode === "sent" || !ta.value.trim();
      keepB.textContent = mode === "kept" ? T("qKept") : T("qKeep"); keepB.disabled = mode === "sent";
      ta.readOnly = mode === "sent";
    };
    sendB.onclick = () => { const text = ta.value.trim(); if (!text) return; saved[q.id + "_mode"] = "sent"; save(); send({ type: "answer", id: q.id, q: pick(q), text }); paint(); };
    keepB.onclick = () => { saved[q.id + "_mode"] = "kept"; save(); paint(); };
    acts.append(sendB, keepB);
    ta.oninput = () => {
      if (saved[q.id + "_mode"] === "kept") { delete saved[q.id + "_mode"]; }
      paint();
      saved[q.id] = ta.value; save(); grow();
      ok.classList.add("on"); clearTimeout(ta.okId); ta.okId = setTimeout(() => ok.classList.remove("on"), 1500);
    };
    ta.onfocus = () => setTimeout(() => card.scrollIntoView({ block: "center", behavior: "smooth" }), 300);   // keep it above the keyboard
    card.append(t, ta, acts, foot); pr.appendChild(card);
    paint();
    setTimeout(grow, 0);
  });
  // play again, or go back to the last scene and choose differently
  const rp = $("jReplay"); rp.innerHTML = "";
  if (game.token === "end" && game.choices) game.choices.forEach((c, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "replayBtn"; b.textContent = pick(c);
    b.onclick = () => answerChoice("end", i);
    rp.appendChild(b);
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
$("answer").onclick = () => {
  const name = $("nameInput").value.trim(); if (!name) return;
  unlockSound(); buzz(40); keepAwake();
  if (me.photo) { $("mePic").src = me.photo.small; $("mePic").hidden = false; } else $("mePic").hidden = true;   // the cyberpunk portrait, next to NEXUS
  startCall(); send({ type: "open", name });
};

// Logging in: a name is required; a photo is optional (it becomes a cyberpunk portrait, framed like on WhatsApp). It stays on this phone.
const me = { photo: null, source: null, frame: null };
$("nameInput").oninput = paintStatic;
async function frame(img, previous) {
  const P = k => french ? PROFILE[k].fr : PROFILE[k].en;
  const res = await Cropper.open(img, { title: P("cropTitle"), hint: P("cropHint"), ok: P("cropOk"), cancel: P("cropCancel") }, previous);
  if (!res) return false;
  me.photo = Cyber.exportImage(img, res.crop);
  me.source = img; me.frame = res.state;
  return true;
}
$("photoInput").onchange = async e => {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file) return;
  let img;
  try { img = await Cyber.load(file); $("uploadErr").hidden = true; }
  catch (err) { $("uploadErr").hidden = false; return; }
  const done = await frame(img);
  if (!done) Cyber.release(img);
  paintStatic();
};
$("adjustBtn").onclick = async () => { if (me.source) { await frame(me.source, me.frame); paintStatic(); } };

paintStatic();

Link.onMessage = receive;
Link.onPeer = ok => { document.body.classList.toggle("no-screen", !ok); };
Assets.preload([...MEME_BGS, "images/characters/echo.png"]);
return { receive };
})();

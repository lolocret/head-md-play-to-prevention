// Echo — the story plays on the computer (the screen: scene, story line, gauge); the phone is the remote
// (phone.js: choices, messages, journal) and talks to this file through link.js (the server relays).
// French by default; add ?lang=en to the address for English
let french = new URLSearchParams(location.search).get("lang") !== "en";
let state, beatIndex, finished;
let sceneSeq = 0;   // counts the scenes played (replays included)
const newState = () => ({ harass: 0, passive: 0, help: 0, bond: 0, flags: {}, extra: [], delayed: [] });
let phase = "title", introIndex = 0; // title | intro | phone | world | dialog | ending
let player = { name: "" };   // the name is typed on the phone when the player logs in to Nexus

const $ = id => document.getElementById(id);
// {name} in any text becomes the player’s name, to make the story personal
const fill = s => String(s).replace(/\{name\}/g, (typeof player !== "undefined" && player.name) || "");
const L = t => fill(french ? t.fr : t.en);
const nexusImages = () => { const l = []; Object.values(NEXUS.beats).forEach(msgs => msgs.forEach(m => { if (m.image) l.push(m.image); })); ["happy", "neutral", "laugh", "angry"].forEach(n => l.push("images/reactions/" + n + ".gif")); l.push("images/reactions/make-meme.png"); return l; };
const profileMsg = () => ({ type: "profile", french, preload: nexusImages(), started: phase !== "phone" });   // the phone logs in, or comes back during the game
const readyMsg = () => ({ type: "ready", french });   // the introduction is over: the phone may log in

// ---------------------------------------------------------------- flow

// Some scenes only happen under a condition (e.g. Echo at Altaya needs a strong bond)
// A scene may need: a bond with Echo (bondMin), or one of some flags set by an earlier choice (anyFlag): the story branches
const available = b => !b.if || ((b.if.bondMin === undefined || state.bond >= b.if.bondMin) && (!b.if.anyFlag || b.if.anyFlag.some(f => state.flags[f])));
function nextAvailable(i) { while (i < STORY.beats.length && !available(STORY.beats[i])) i++; return i; }

function restart() {
  state = newState();
  lastSnap = null;
  Nexus.reset();
  beatIndex = nextAvailable(0);
  finished = false;
  phase = "world";
  Scene.setBeat(STORY.beats[beatIndex].id);
  Scene.reset();
  render();
  maybeStartBeat();
}

// Once the scene is in its place, it starts (after a short pause)
function maybeStartBeat() {
  if (phase !== "world" || !Scene.atBeat()) return;
  const idx = beatIndex;
  setTimeout(() => {
    if (phase === "world" && beatIndex === idx && Scene.atBeat()) {
      phase = "dialog"; sceneSeq++;   // a new number for every scene played, so the phone never takes it for an answered one
      chatReady = false; chatAnswered = false;
      const ch = STORY.beats[idx].chat;
      if (ch) setTimeout(() => { if (phase === "dialog" && beatIndex === idx) { chatReady = true; syncPhone(); } }, Nexus.readyAt(STORY.beats[idx].id));   // once every message is in
      fireDelayed(idx);                       // an old choice comes back
      if (idx === STORY.beats.length - 1) lastSnap = { state: JSON.parse(JSON.stringify(state)), beatIndex: idx };   // to try the last scene again
      render();
      Nexus.beat(STORY.beats[idx].id);        // the scene starts: messages arrive on the phone
    }
  }, 700);
}
Scene.onEnter = () => { syncPhone(); maybeStartBeat(); };

// The story takes the player to the next scene, wherever it happens
function next() {
  Nexus.reset();                 // the messages of the scene that just ended do not arrive in the next one
  Link.send({ type: "clearnotif" });
  beatIndex = nextAvailable(beatIndex + 1);
  if (beatIndex >= STORY.beats.length) { finished = true; phase = "ending"; render(); return; }
  phase = "world";
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.setBeat(STORY.beats[beatIndex].id);
  render();
  if (Scene.atBeat()) maybeStartBeat(); else Scene.go(Scene.beatPlaceId());
}

// How open Echo's flowers are: 1 = fine, 0 = closed (the worse Echo feels, the more they close)
// How open Echo's flower is: it grows with the bond (the closer we are, the more it blooms) and closes with the hurt
const bloomValue = () => Math.max(0, Math.min(1, 0.4 + 0.6 * Math.min(1, Math.max(0, state.bond) / STORY.bondToUnlock) - 0.7 * Math.min(1, state.harass / Math.max(1, STORY.harassStage3))));

// 0 stable, 1 bugs, 2 crises, 3 Echo short-circuits
function stage() {
  if (state.harass >= STORY.harassStage3) return 3;
  if (state.harass >= STORY.harassStage2) return 2;
  if (state.harass >= STORY.harassStage1) return 1;
  return 0;
}

// The end follows what the player did to Echo, then what they did on Friday:
//  - the gauge went to the end                    -> Echo malfunctions and is taken back to Altaya (Echo harasses nobody)
//  - the player opened the door or spoke up       -> the plan fails, Echo stays
//  - the player filmed, stayed quiet or left      -> the plan goes ahead, Echo is switched off and does not come back
function endingId() {
  if (stage() >= 3) return "harass";
  if (state.flags.planStopped) return "help";
  return "passive";
}

// Echo is open to you if the bond is strong, wary if you hurt more than you helped
const mood = () => state.bond >= STORY.bondToUnlock ? "open" : (state.harass > state.help ? "wary" : "neutral");
const noteApplies = n => (n.flag && state.flags[n.flag]) || (n.bondMin !== undefined && state.bond >= n.bondMin) || (n.bondMax !== undefined && state.bond <= n.bondMax);

// ---------------------------------------------------------------- choices and their consequences

// A choice made "for fun" can come back later: a message, a line in the journal (the "later" part of a choice)
function fireDelayed(idx) {
  state.delayed.forEach(d => {
    if (d.done || d.at > idx) return;
    d.done = true;
    if (d.later.journal) state.extra.push({ beat: Math.max(0, idx - 1), text: d.later.journal });
  });
}

function choose(c, text, index, stance) {
  const chat = STORY.beats[beatIndex].chat;
  if (c.kind === "meme") c = { ...c, ...(c[stance === "support" ? "support" : "mock"] || {}) };   // a meme counts for what it was made for
  if (c.later) state.delayed.push({ at: beatIndex + c.later.after, later: c.later, done: false });
  for (const k of ["harass", "passive", "help", "bond"]) state[k] += c[k] || 0;
  if (c.flag) state.flags[c.flag] = true;
  (c.flags || []).forEach(f => { state.flags[f] = true; });
  if (c.journal) state.extra.push({ beat: beatIndex, text: text && c.kind === "meme" ? { fr: c.journal.fr + " « " + text + " »", en: c.journal.en + " “" + text + "”" } : c.journal });
  if (text && c.kind !== "meme") state.extra.push({ beat: beatIndex, text: { fr: `J’ai écrit à Echo, « ${text} »`, en: `I wrote to Echo, “${text}”` } });   // her own words go in the journal
  if (chat) {                                            // stay in the conversation a moment: the others answer, then the story goes on
    chatAnswered = true; syncPhone();
    const idx = beatIndex;
    const stay = Nexus.after(STORY.beats[idx].id, stance ? index + ":" + stance : index, chat.thread);
    setTimeout(() => { if (phase === "dialog" && beatIndex === idx) next(); }, stay);
  } else next();
}

let lastSnap = null;   // the state at the start of the last scene (a second chance after an ending that is not "Echo stays")
function retryLastScene() {
  if (!lastSnap) return;
  state = JSON.parse(JSON.stringify(lastSnap.state));
  beatIndex = lastSnap.beatIndex; finished = false; phase = "dialog"; sceneSeq++;
  Nexus.reset(); Nexus.beat(STORY.beats[beatIndex].id);
  render();
}

// ---------------------------------------------------------------- the phone

let chatReady = false, chatAnswered = false;   // a scene played inside a conversation: the options appear once the messages are in

let pending = null;   // what the phone may answer right now: { token, kind: "choice" | "continue" | "restart", choices }
let sentSig = null;   // the last state sent (to send only what changed)

function phoneState() {
  pending = null;
  const empty = { fr: "", en: "" }, place = Scene.placeName();
  if (phase === "dialog" && !finished) {
    const beat = STORY.beats[beatIndex];
    const alone = beat.alone && state.bond < STORY.bondToUnlock;
    const choices = alone ? (beat.alone.choices || []) : beat.choices;
    const token = "b" + beatIndex + "." + sceneSeq;
    if (beat.chat) {                                   // the player is in the conversation and acts in it
      const thread = beat.chat.thread;
      const base = { mode: "choose", ui: "chat", token, thread, threadName: NEXUS.threads[thread], place, prompt: empty, ready: chatReady, answered: chatAnswered };
      if (!chatReady || chatAnswered) return { ...base, choices: [] };
      pending = { token, kind: "choice", choices };
      const ix = INTERACT[beat.id] || {};
      return { ...base, choices: choices.map((c, i) => ({ fr: fill(c.label.fr), en: fill(c.label.en), kind: (ix.hide || []).includes(i) ? "hidden" : ix.write === i ? "write" : (c.kind || "reply"), msg: c.msg, icon: c.icon, iconImg: c.iconImg, img: c.img })) };
    }
    if (choices && choices.length) {
      pending = { token, kind: "choice", choices };
      const ix = alone ? {} : (INTERACT[beat.id] || {});
      return { mode: "choose", token, place, prompt: beat.prompt ? { fr: fill(beat.prompt.fr), en: fill(beat.prompt.en) } : empty,
        choices: choices.map((c, i) => ({ fr: fill(c.label.fr), en: fill(c.label.en), hold: (ix.hold || []).includes(i), img: c.img })),
        timer: ix.timer || 0, fallback: ix.fallback || 0, holdMs: ix.holdMs || 900, emoji: !!ix.emoji, big: ix.big || {}, icons: ix.icons || {}, spots: ix.spots || [], mech: ix.mech || "", seconds: ix.seconds || 0, words: ix.words || [] };
    }
    pending = { token, kind: "continue" };
    return { mode: "choose", token, place, prompt: empty, choices: [{ fr: "Continuer", en: "Continue" }] };
  }
  if (phase === "ending") {
    pending = { token: "end", kind: "restart" };
    const choices = [{ fr: "Rejouer", en: "Play again" }];
    if (lastSnap && endingId() !== "help") choices.push({ fr: "Revenir à la dernière scène et choisir autrement", en: "Go back to the last scene and choose differently" });
    return { mode: "choose", token: "end", place, prompt: empty, choices };
  }
  return { mode: "wait", place };
}

function syncPhone() {
  const s = phoneState();
  s.bloom = +bloomValue().toFixed(2);          // the phone shows Echo's flowers too
  const sig = JSON.stringify(s);
  if (sig === sentSig) return;
  sentSig = sig;
  Link.send({ type: "state", ...s });
}

// The phone answered
const shared = [];   // the answers the players sent anonymously to the class (no name, no photo)
Link.onMessage = m => {
  if (m.type === "answer") { if (m.text && !shared.some(x => x.id === m.id && x.text === m.text)) shared.unshift({ id: m.id, q: String(m.q || "").slice(0, 160), text: String(m.text).slice(0, 400) }); if (phase === "ending") renderEnding(); return; }
  if (m.type === "open") { if (phase === "phone") { player.name = String(m.name || "").slice(0, 20).trim(); Link.send(profileMsg()); sentSig = null; restart(); } return; }   // the player opened Nexus on the phone: the story starts
  if (m.type !== "choose" || !pending || m.token !== pending.token) return;
  const p = pending; pending = null;
  if (p.kind === "choice") { const c = p.choices[m.index]; if (c) choose(c, typeof m.text === "string" ? m.text.slice(0, 120).trim() : "", m.index, m.stance === "support" || m.stance === "mock" ? m.stance : ""); }
  else if (p.kind === "continue") next();
  else if (p.kind === "restart") { if (m.index === 1) retryLastScene(); else restart(); }
};

// The phone connects (or comes back): it gets everything again
Link.onPeer = ok => {
  document.body.classList.toggle("no-phone", !ok);
  renderLink();
  if (!ok) return;
  if (phase === "phone") Link.send(readyMsg()); else if (player.name) Link.send(profileMsg());
  sentSig = null; updateJournal.sig = null;
  syncPhone(); updateJournal();
};
function renderLink() {
  const inGame = phase !== "title" && phase !== "intro" && phase !== "phone";
  $("linkBanner").hidden = Link.connected || !inGame;
  $("linkBanner").textContent = french ? "Le téléphone s’est déconnecté. Rouvre la page sur le téléphone (ou rescanne le QR code)." : "The phone disconnected. Reopen the page on the phone (or scan the QR code again).";
  $("qrBox").hidden = phase !== "phone" || !(qrShown || noServer);   // the QR code is shown when the player is asked to take the phone
  if (noServer) return;
  $("qrText").textContent = Link.connected ? (french ? "Téléphone connecté ✓" : "Phone connected ✓") : (french ? "Scanne ce QR code avec ton téléphone." : "Scan this QR code with your phone.");
  $("qr").classList.toggle("ok", Link.connected);
}
let qrShown = false, noServer = false;

// ---------------------------------------------------------------- the screen

function render() {
  renderScreen();
  syncPhone();
}

// The picture behind an introduction page: its own, or the one of the previous pages
const introPicture = i => INTRO[i].image || (i > 0 ? introPicture(i - 1) : "");
function showPicture(url) {
  $("introBg").style.backgroundImage = url ? `url(${Assets.url(url)})` : "";
  $("introBg").hidden = !url;
}

function renderScreen() {
  $("choices").innerHTML = "";
  $("prompt").textContent = "";
  $("titleScreen").hidden = phase !== "title";
  if (phase === "title") { $("introBg").style.backgroundImage = `url(${Assets.url(TITLE.image)})`; $("introBg").hidden = false; }   // the title page shows the 2041 picture
  else if (phase === "phone") showPicture(introPicture(INTRO.length - 1));                         // the last picture stays until the game starts
  else if (phase !== "intro") $("introBg").hidden = true;
  document.body.classList.toggle("on-title", phase === "title");
  if (phase === "title") renderTitle();
  renderLink();
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.french = french;
  Scene.stage = stage();
  Scene.bloom = bloomValue();
  Scene.refresh();
  const inGame = phase === "world" || phase === "dialog" || phase === "ending";
  document.body.classList.toggle("pre-game", !inGame);   // before the game starts, no place is shown behind the pages
  $("main").hidden = phase !== "intro" && phase !== "phone";   // the pages before the game
  $("main").classList.toggle("phoneStep", phase === "phone");   // the "take your phone" page: QR code on the left, text on the right
  $("screenText").hidden = !inGame;                                                 // in the game: the story line, at the bottom of the screen
  $("storyLine").textContent = "";
  $("echoCard").hidden = true; document.body.classList.remove("ended");
  updateGauge();
  updateJournal();

  if (phase === "title") return;
  if (phase === "intro") return renderIntro();
  if (phase === "phone") return renderPhoneWait();
  if (phase === "world") return;
  if (finished) return renderEnding();

  const beat = STORY.beats[beatIndex];
  // variants: "alone" when the player is not close enough to Echo (Altaya stays closed); Echo's mood when the scene has one
  const alone = beat.alone && state.bond < STORY.bondToUnlock;
  if (alone) state.flags["alone_" + beat.id] = true;
  const text = alone ? (beat.alone.line || beat.alone.text)
    : (beat.moodLines ? (beat.moodLines[mood()] || beat.line) : (beat.line || (beat.moodText ? (beat.moodText[mood()] || beat.text) : beat.text)));
  let body = L(text);
  $("storyLine").textContent = body;     // one short line above the choices
  $("storyLine").classList.toggle("long", body.length > 140);
}

function renderTitle() {
  $("gameName").textContent = TITLE.name;
  $("tagline").textContent = L(TITLE.tagline);
  $("playBtn").textContent = L(TITLE.play);
  $("credits").textContent = TITLE.credits;
}

// The introduction is over: the story waits for the player to open Nexus on the phone
function renderPhoneWait() {
  $("title").textContent = "";
  $("body").textContent = french ? "Prends ton téléphone\nconnecte-toi à Nexus." : "Take your phone\nlog in to Nexus.";
  renderLink();
}

function addButton(label, onClick) {
  const b = document.createElement("button");
  b.textContent = label;
  b.onclick = onClick;
  $("choices").appendChild(b);
}

function renderIntro() {
  const page = INTRO[introIndex];
  showPicture(introPicture(introIndex));   // a page without its own picture keeps the previous one
  $("title").textContent = L(page.title);
  $("body").textContent = L(page.text);
  addButton(french ? "Suivant" : "Next", () => {
    introIndex++;
    if (introIndex >= INTRO.length) { phase = "phone"; Link.send(readyMsg()); }
    render();
  });
  const dots = document.createElement("div"); dots.className = "dots";   // where we are in the introduction
  INTRO.forEach((_, i) => { const d = document.createElement("i"); if (i === introIndex) d.className = "on"; dots.appendChild(d); });
  $("choices").appendChild(dots);
  $("main").classList.remove("turn"); void $("main").offsetWidth; $("main").classList.add("turn");   // the text rises in at every page
}

// The ending text, with a line that depends on what the player did
function endingText(e) {
  let t = L(e.text);
  if (e.id === "passive") t += " " + L(state.flags.filmed ? ENDING_EXTRAS.filmed : ENDING_EXTRAS.notFilmed);
  if (e.id === "help" && state.bond >= STORY.bondToUnlock) t += " " + L(ENDING_EXTRAS.altaya);
  if (e.id === "help" && (state.flags.clarisseListened || state.flags.clarisseToldStop)) t += " " + L(ENDING_EXTRAS.clarisse);
  if (e.id === "passive" && state.flags.clarisseMocked) t += " " + L(ENDING_EXTRAS.clarisseMocked);
  return t;
}

// The end: a quiet page: how it ended for Echo, in a few words, and how their flowers are
function renderEnding() {
  const e = STORY.endings.find(x => x.id === endingId()) || STORY.endings[0], st = stage();
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt !== undefined) n.textContent = txt; return n; };
  const card = $("echoCard");
  card.hidden = false; card.textContent = ""; card.className = "endCard end-" + e.id + " stage" + st;
  document.body.classList.add("ended");
  const flowers = el("div", "en-flowers"); flowers.innerHTML = [0, 1, 2].map(() => Flower.svg(bloomValue(), 34)).join("");
  // two plain lines: our bond with Echo, and where Echo's gauge ended
  const row = (label, v, word) => { const r = el("div", "en-row"); const m = el("div", "en-line"); const i = el("i"); i.style.width = Math.round(Math.max(0, Math.min(1, v)) * 100) + "%"; m.appendChild(i); r.append(el("span", "en-label", label), m, el("span", "en-word", word)); return r; };
  const bond = state.bond >= STORY.bondToUnlock ? (french ? "fort" : "strong") : state.bond >= 1 ? (french ? "fragile" : "fragile") : (french ? "absent" : "none");
  const rows = el("div", "en-rows");
  rows.append(row(french ? "Notre lien" : "Our bond", state.bond / (STORY.bondToUnlock * 2), bond), row(french ? "État d’Echo" : "Echo’s state", echoHealth(), L(STORY.stages[st])));
  card.append(el("p", "en-kicker", french ? "Fin" : "The end"), el("h3", "", L(e.title)), el("p", "en-text", endingText(e)), flowers, rows);
  if (shared.length) {   // what the class sent anonymously
    const box = el("div", "sharedBox"); box.appendChild(el("h4", "", french ? "Réponses anonymes de la classe" : "Anonymous answers from the class"));
    shared.slice(0, 4).forEach(x => { const q = el("blockquote"); q.append(el("small", "", x.q), document.createTextNode(x.text)); box.appendChild(q); });
    card.appendChild(box);
  }
}

// Gauge: a flower in bloom on the left, a wilted one on the right, the bar between them (green -> orange -> red)
// Echo's state: 1 = fine (full gauge), 0 = the most harassed Echo can take
const echoHealth = () => 1 - Math.min(1, state.harass / Math.max(1, STORY.harassStage3));

function updateGauge() {
  const v = echoHealth();                         // full at the start, it goes down as Echo is harassed
  const color = `hsl(${130 * v}, 75%, 50%)`;
  $("gaugeFill").style.width = (v * 100) + "%";
  $("gaugeFill").style.background = color;
  $("gFlowerOpen").innerHTML = Flower.svg(bloomValue(), 40);   // one flower that evolves: it blooms with the bond, droops with the hurt
}

// The journal lives on the phone: one entry per scene (what you did and how it felt)
function updateJournal() {
  const last = finished ? STORY.beats.length - 1 : (phase === "dialog" ? beatIndex : beatIndex - 1);
  const entries = [];
  STORY.beats.slice(0, last + 1).forEach((b, i) => {
    if (b.alone && state.flags["alone_" + b.id]) entries.push(b.alone.journal || b.journal);
    else state.extra.filter(x => x.beat === i).forEach(x => entries.push(x.text));
  });
  const sig = entries.length + "|" + french;
  if (sig !== updateJournal.sig) {
    updateJournal.sig = sig;
    Link.send({ type: "journal", entries: entries.map(t => ({ fr: fill(t.fr), en: fill(t.en) })) });
  }
}

$("playBtn").onclick = () => { phase = "intro"; render(); };
// Enter, Space or the right arrow turn the page, like the button
document.addEventListener("keydown", e => {
  if (!["Enter", " ", "ArrowRight"].includes(e.key) || (e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) return;
  const b = phase === "intro" ? document.querySelector("#choices button") : phase === "title" && !$("playBtn").disabled ? $("playBtn") : null;
  if (b) { e.preventDefault(); b.click(); }
});

state = newState();
beatIndex = 0;
finished = false;
Scene.init($("scene"));   // nothing is drawn yet: the pictures load first (see below)

// Everything is loaded before the game starts: the pictures of the title, the introduction, the places, the characters and the messages
(function loadEverything() {
  $("loaderText").textContent = french ? "Chargement…" : "Loading…";
  const list = [TITLE.image, ...INTRO.map(p => p.image).filter(Boolean),
    ...["couloir", "classe", "toit", "serre", "chambre", "altaya"].map(id => `images/${id}.png`),
    ...["echo", "kovasko", "clarisse", "student"].map(id => `images/characters/${id}.png`)];
  Object.values(NEXUS.beats).forEach(msgs => msgs.forEach(m => { if (m.image) list.push(m.image); }));
  Link.start().then(info => {      // opens the room: the phone joins with the QR code
    if (!info) { noServer = true; $("qr").hidden = true; $("qrBox").hidden = false; $("qrText").textContent = french ? "Il faut le serveur : lance « npm start » (dossier server), puis ouvre http://localhost:3000." : "The server is needed: run “npm start” (server folder), then open http://localhost:3000."; return; }
    qrShown = true;
    $("qr").innerHTML = "";
    new QRCode($("qr"), { text: info.url, width: 440, height: 440, colorDark: "#0a0a1c", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    $("qrUrl").textContent = info.url.replace(/^https?:\/\//, "");
    renderLink();
  });
  Assets.preload(list, p => { $("loaderFill").style.width = Math.round(p * 100) + "%"; }).then(() => {
    render();                                   // the pictures are ready: show the title page
    $("loader").classList.add("done");
    setTimeout(() => { $("loader").hidden = true; }, 600);
  });
})();

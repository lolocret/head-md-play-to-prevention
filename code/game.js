// Echo — a story played on a phone. The scene, the story line and the choices are all on the same screen;
// phone.js is the Nexus part (choices, messages, journal) and talks to this file through link.js.
// French by default; add ?lang=en to the address for English
let french = new URLSearchParams(location.search).get("lang") !== "en";
let state, beatIndex, finished;
const newState = () => ({ harass: 0, passive: 0, help: 0, bond: 0, flags: {}, extra: [], delayed: [] });
let phase = "title", introIndex = 0; // title | intro | profile | phone | world | dialog | ending
let player = { name: "", avatar: PROFILE.defaultAvatar, photo: null };   // photo: a cyberpunk portrait (optional)

const $ = id => document.getElementById(id);
// {name} in any text becomes the player’s name, to make the story personal
const fill = s => String(s).replace(/\{name\}/g, (typeof player !== "undefined" && player.name) || "");
const L = t => fill(french ? t.fr : t.en);
const profileMsg = () => ({ type: "profile", name: player.name, avatar: player.avatar, photo: player.photo ? player.photo.small : null, french });

// ---------------------------------------------------------------- flow

// Some scenes only happen under a condition (e.g. Echo at Altaya needs a strong bond)
const available = b => !b.if || state.bond >= (b.if.bondMin || -Infinity);
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
      phase = "dialog";
      chatReady = false; chatAnswered = false;
      const ch = STORY.beats[idx].chat;
      if (ch) setTimeout(() => { if (phase === "dialog" && beatIndex === idx) { chatReady = true; syncPhone(); } }, ch.readyAt);
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
  beatIndex = nextAvailable(beatIndex + 1);
  if (beatIndex >= STORY.beats.length) { finished = true; phase = "ending"; render(); return; }
  phase = "world";
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.setBeat(STORY.beats[beatIndex].id);
  render();
  if (Scene.atBeat()) maybeStartBeat(); else Scene.go(Scene.beatPlaceId());
}

// How open Echo's flowers are: 1 = fine, 0 = closed (the worse Echo feels, the more they close)
const bloomValue = () => 1 - Math.min(1, state.harass / Math.max(1, STORY.harassStage3));

// 0 stable, 1 bugs, 2 crises, 3 Echo short-circuits
function stage() {
  if (state.harass >= STORY.harassStage3) return 3;
  if (state.harass >= STORY.harassStage2) return 2;
  if (state.harass >= STORY.harassStage1) return 1;
  return 0;
}

function endingId() {
  if (stage() >= 3) return "harass";
  if (state.help >= STORY.helpToSucceed && state.help >= state.passive) return "help";
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
    if (d.later.msg) {
      const m = d.later.msg;
      setTimeout(() => Link.send({ type: "msg", thread: m.t, threadName: NEXUS.threads[m.t], from: m.from, fr: fill(m.fr), en: fill(m.en), feel: "normal" }), 5000);
    }
  });
}

function choose(c) {
  const chat = STORY.beats[beatIndex].chat;
  if (c.later) state.delayed.push({ at: beatIndex + c.later.after, later: c.later, done: false });
  for (const k of ["harass", "passive", "help", "bond"]) state[k] += c[k] || 0;
  if (c.flag) state.flags[c.flag] = true;
  if (c.help > 0) Nexus.cold(c.help, chat && chat.thread);       // helping Echo: the others answer coldly, in the conversation the player is in
  if (c.journal) state.extra.push({ beat: beatIndex, text: c.journal });
  if (chat) {                                            // stay in the conversation a moment: the answers and the cold reply are seen
    chatAnswered = true; syncPhone();
    const idx = beatIndex;
    setTimeout(() => { if (phase === "dialog" && beatIndex === idx) next(); }, 4800);
  } else next();
}

let lastSnap = null;   // the state at the start of the last scene (a second chance after an ending that is not "Echo stays")
function retryLastScene() {
  if (!lastSnap) return;
  state = JSON.parse(JSON.stringify(lastSnap.state));
  beatIndex = lastSnap.beatIndex; finished = false; phase = "dialog";
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
    const token = "b" + beatIndex;
    if (beat.chat) {                                   // the player is in the conversation and acts in it
      const thread = beat.chat.thread;
      const base = { mode: "choose", ui: "chat", token, thread, threadName: NEXUS.threads[thread], place, prompt: empty, ready: chatReady, answered: chatAnswered };
      if (!chatReady || chatAnswered) return { ...base, choices: [] };
      pending = { token, kind: "choice", choices };
      return { ...base, choices: choices.map(c => ({ fr: fill(c.label.fr), en: fill(c.label.en), kind: c.kind || "reply", msg: c.msg })) };
    }
    if (choices && choices.length) {
      pending = { token, kind: "choice", choices };
      return { mode: "choose", token, place, prompt: beat.prompt ? { fr: fill(beat.prompt.fr), en: fill(beat.prompt.en) } : empty,
        choices: choices.map(c => ({ fr: fill(c.label.fr), en: fill(c.label.en) })) };
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
Link.onMessage = m => {
  if (m.type !== "choose" || !pending || m.token !== pending.token) return;
  const p = pending; pending = null;
  if (p.kind === "choice") { const c = p.choices[m.index]; if (c) choose(c); }
  else if (p.kind === "continue") next();
  else if (p.kind === "restart") { if (m.index === 1) retryLastScene(); else restart(); }
};

// The player opened Nexus (the welcome screen): the story starts
Phone.onOpen = () => { if (phase === "phone") { sentSig = null; restart(); } };

// ---------------------------------------------------------------- the screen

function render() {
  renderScreen();
  syncPhone();
}

// The picture behind an introduction page: its own, or the one of the previous pages
const introPicture = i => INTRO[i].image || (i > 0 ? introPicture(i - 1) : "");
function showPicture(url) {
  $("introBg").style.backgroundImage = url ? `url(${url})` : "";
  $("introBg").hidden = !url;
}

function renderScreen() {
  $("choices").innerHTML = "";
  $("prompt").textContent = "";
  $("profile").hidden = true;
  $("titleScreen").hidden = phase !== "title";
  if (phase === "title") { $("introBg").style.backgroundImage = `url(${TITLE.image})`; $("introBg").hidden = false; }   // the title page shows the 2041 picture
  else if (phase === "profile" || phase === "phone") showPicture(introPicture(INTRO.length - 1));                         // the last picture stays until the game starts
  else if (phase !== "intro") $("introBg").hidden = true;
  document.body.classList.toggle("on-title", phase === "title");
  if (phase === "title") renderTitle();
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.french = french;
  Scene.stage = stage();
  Scene.bloom = bloomValue();
  Scene.refresh();
  const inGame = phase === "world" || phase === "dialog" || phase === "ending";
  document.body.classList.toggle("pre-game", !inGame);   // before the game starts, no place is shown behind the pages
  $("main").hidden = phase !== "intro" && phase !== "profile";          // the pages before the game; in the game the story line is in the Nexus panel
  $("app").hidden = !(phase === "phone" || inGame);                     // Nexus: the welcome screen, then the game
  $("storyLine").textContent = "";
  updateGauge();
  updateJournal();

  if (phase === "title") return;
  if (phase === "intro") return renderIntro();
  if (phase === "profile") return renderProfile();
  if (phase === "phone" || phase === "world") return;
  if (finished) return renderEnding();

  const beat = STORY.beats[beatIndex];
  // variants: "alone" when the player is not close enough to Echo (Altaya stays closed); Echo's mood when the scene has one
  const alone = beat.alone && state.bond < STORY.bondToUnlock;
  if (alone) state.flags["alone_" + beat.id] = true;
  const text = alone ? (beat.alone.line || beat.alone.text)
    : (beat.moodLines ? (beat.moodLines[mood()] || beat.line) : (beat.line || (beat.moodText ? (beat.moodText[mood()] || beat.text) : beat.text)));
  let body = L(text);
  (beat.notes || []).forEach(n => { if (noteApplies(n)) body += "\n\n" + L(n.text); });
  $("storyLine").textContent = body;     // one short line above the choices
  $("storyLine").classList.toggle("long", body.length > 140);
}

function renderTitle() {
  $("gameName").textContent = TITLE.name;
  $("tagline").textContent = L(TITLE.tagline);
  $("playBtn").textContent = L(TITLE.play);
  $("credits").textContent = TITLE.credits;
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
    if (introIndex >= INTRO.length) phase = "profile";
    render();
  });
}

// A name is required; a photo is optional (it becomes a cyberpunk portrait, framed like on WhatsApp)
async function frame(img, previous) {
  const res = await Cropper.open(img, { title: L(PROFILE.cropTitle), hint: L(PROFILE.cropHint), ok: L(PROFILE.cropOk), cancel: L(PROFILE.cropCancel) }, previous);
  if (!res) return false;
  player.photo = Cyber.exportImage(img, res.crop);
  player.source = img; player.frame = res.state;
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
  renderProfile();
};
$("adjustBtn").onclick = async () => { if (player.source) { await frame(player.source, player.frame); renderProfile(); } };

function renderProfile() {
  $("choices").innerHTML = "";
  $("title").textContent = L(PROFILE.title);
  $("body").textContent = "";
  $("profile").hidden = false;
  $("nameLabel").textContent = L(PROFILE.nameLabel);
  $("nameInput").placeholder = L(PROFILE.namePlaceholder);
  $("slotImg").hidden = !player.photo;
  $("slotPlus").hidden = !!player.photo;
  if (player.photo) $("slotImg").src = player.photo.big;
  $("uploadText").textContent = L(player.photo ? PROFILE.uploadChange : PROFILE.upload);
  $("adjustBtn").hidden = !player.photo;
  $("adjustBtn").textContent = L(PROFILE.adjust);
  $("uploadErr").textContent = L(PROFILE.uploadErr);
  addButton(L(PROFILE.start), () => { player.name = $("nameInput").value.trim(); phase = "phone"; Link.send(profileMsg()); render(); });
  const start = $("choices").lastChild;
  const check = () => { start.disabled = !$("nameInput").value.trim(); };   // only the name is required
  $("nameInput").oninput = check;
  check();
}

function renderEnding() {
  const e = STORY.endings.find(x => x.id === endingId()) || STORY.endings[0];
  const lore = state.bond >= STORY.bondToUnlock ? STORY.loreUnlocked : STORY.loreClosed;
  $("storyLine").textContent = L(e.title) + "\n\n" + L(e.text) + "\n\n" + fill(french ? "{name}, voici l’état d’Echo à la fin : " : "{name}, here is Echo’s state at the end: ") + L(STORY.stages[stage()]) + "\n" + L(lore);
  $("storyLine").classList.add("long");
}

// Gauge: a flower in bloom on the left, a wilted one on the right, the bar between them (green -> orange -> red)
function updateGauge() {
  const v = Math.min(1, state.harass / Math.max(1, STORY.harassStage3));
  const color = `hsl(${130 - 130 * v}, 75%, 50%)`;
  $("gaugeFill").style.width = (v * 100) + "%";
  $("gaugeFill").style.background = color;
  $("gFlowerOpen").innerHTML = Flower.svg(1, 30);
  $("gFlowerWilt").innerHTML = Flower.wilted(34);
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

state = newState();
beatIndex = 0;
finished = false;
Scene.init($("scene"));
render();

// Decorative glowing lights drifting up the background.
for (let i = 0; i < 12; i++) {
  const f = document.createElement("span");
  f.className = "flower";
  f.style.left = Math.random() * 100 + "vw";
  f.style.width = f.style.height = (8 + Math.random() * 14) + "px";
  f.style.animationDelay = (-Math.random() * 14) + "s";
  f.style.animationDuration = (10 + Math.random() * 10) + "s";
  f.style.setProperty("--c", ["#ff4fc3", "#4df0ff", "#8a5cff"][i % 3]);
  document.body.appendChild(f);
}

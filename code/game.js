// Echo — text-and-choice prototype. Only the player makes choices.
// French by default; add ?lang=en to the address for English
let french = new URLSearchParams(location.search).get("lang") !== "en";
let state, beatIndex, finished;
const newState = () => ({ harass: 0, passive: 0, help: 0, bond: 0, flags: {}, extra: [], talked: {}, delayed: [] });
let phase = "title", introIndex = 0; // title | intro | profile | phone | world | dialog | ending
let player = { name: "", avatar: null, photo: null }; // avatar: a colour, or "photo" (a cyberpunk portrait)

const $ = id => document.getElementById(id);
// {name} in any text becomes the player’s name, to make the story personal
const profileMsg = () => ({ type: "profile", name: player.name, avatar: player.avatar === "photo" ? null : player.avatar, photo: player.avatar === "photo" && player.photo ? player.photo.small : null, french });
const fill = s => String(s).replace(/\{name\}/g, (typeof player !== "undefined" && player.name) || "");
const L = t => fill(french ? t.fr : t.en);

function restart() {
  state = newState();
  activeEnc = null; lastSnap = null;
  Nexus.reset();
  beatIndex = 0;
  finished = false;
  phase = "world";
  Scene.setBeat(STORY.beats[0].id);
  Scene.reset();
  render();
  maybeStartBeat();
}

// When the player is in the place where the next scene happens, the scene starts.
function maybeStartBeat() {
  if (phase !== "world" || !Scene.atBeat()) return;
  const idx = beatIndex;
  setTimeout(() => {
    if (phase === "world" && beatIndex === idx && Scene.atBeat()) {
      phase = "dialog";
      fireDelayed(idx);                       // an old choice comes back
      if (idx === STORY.beats.length - 1) lastSnap = { state: JSON.parse(JSON.stringify(state)), beatIndex: idx };   // to try the last scene again
      render();
      Nexus.beat(STORY.beats[idx].id); // the scene starts: messages arrive on the phone
    }
  }, 700);
}
Scene.onEnter = () => { syncPhone(); maybeStartBeat(); };

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

function addButton(label, onClick) {
  const b = document.createElement("button");
  b.textContent = label;
  b.onclick = onClick;
  $("choices").appendChild(b);
}

function render() {
  renderScreen();
  syncPhone();
}

function renderScreen() {
  $("choices").innerHTML = "";
  $("prompt").textContent = "";
  $("profile").hidden = true;
  $("titleScreen").hidden = phase !== "title";
  if (phase !== "intro") $("introBg").hidden = true;   // only the introduction pages that have an image show it
  document.body.classList.toggle("on-title", phase === "title");
  if (phase === "title") renderTitle();
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.french = french;
  Scene.stage = stage();
  Scene.refresh();
  const inGame = phase === "world" || phase === "dialog" || phase === "ending";
  const needPhone = phase === "phone" || (inGame && !Link.connected);   // no phone, no game: the screen only displays
  $("main").hidden = phase === "title" || phase === "world" || phase === "phone" || needPhone;
  $("phoneScreen").hidden = !needPhone;
  if (needPhone) renderPhoneStep();
  document.body.classList.toggle("vn", phase === "dialog");
  document.body.classList.toggle("await-phone", phase === "dialog" && Link.connected);   // the scene darkens while the player answers on the phone
  updateGauge();
  updateJournal();

  if (phase === "title") return;
  if (phase === "intro") return renderIntro();
  if (phase === "profile") return renderProfile();
  if (phase === "phone") return;

  if (phase === "world") return;
  if (finished) return renderEnding();

  if (activeEnc) {   // an optional conversation
    $("title").textContent = L(activeEnc.title);
    $("body").textContent = L(encText(activeEnc));
    return;
  }
  const beat = STORY.beats[beatIndex];
  // "alone" variant: shown when the player is not close enough to Echo (Altaya stays closed)
  const alone = beat.alone && state.bond < STORY.bondToUnlock;
  if (alone) state.flags["alone_" + beat.id] = true;
  const text = alone ? beat.alone.text : beat.text;
  $("title").textContent = L(beat.title);
  let body = L(text);
  (beat.notes || []).forEach(n => { if (noteApplies(n)) body += "\n\n" + L(n.text); });
  $("body").textContent = body;
  // the questions and the buttons are on the phone: the computer only tells the story
}

// ---- The phone is the controller: choices, moving between places, "Continue", "Play again" ----
// A choice made "for fun" can come back later: a message, a line in the journal (the "later" part of a choice)
function fireDelayed(idx) {
  state.delayed.forEach(d => {
    if (d.done || d.at > idx) return;
    d.done = true;
    if (d.later.journal) state.extra.push({ beat: Math.max(0, idx - 1), text: d.later.journal });
    if (d.later.msg && Link.connected) {
      const m = d.later.msg;
      setTimeout(() => Link.send({ type: "msg", thread: m.t, threadName: NEXUS.threads[m.t], from: m.from, fr: fill(m.fr), en: fill(m.en), feel: "normal" }), 5000);
    }
  });
}

function applyChoice(c, journalBeat) {
  if (c.later) state.delayed.push({ at: beatIndex + c.later.after, later: c.later, done: false });
  const before = state.bond >= STORY.bondToUnlock;
  for (const k of ["harass", "passive", "help", "bond"]) state[k] += c[k] || 0;
  if (c.flag) state.flags[c.flag] = true;
  if (c.help > 0) Nexus.cold(c.help); // helping Echo: the others answer coldly
  if (c.journal) state.extra.push({ beat: journalBeat, text: c.journal });
  if (!before && state.bond >= STORY.bondToUnlock) toast(french ? "Un nouveau lieu est accessible : Altaya" : "A new place is now open: Altaya");
}
function choose(c) { applyChoice(c, beatIndex); next(); }

const Q_ENC = { fr: "Que fais-tu, {name} ?", en: "What do you do, {name}?" };

// ---- Free time: optional conversations ("Talk to …") in the places where someone is ----
let activeEnc = null;        // the conversation in progress
const beatIdx = id => STORY.beats.findIndex(b => b.id === id);
const mood = () => state.bond >= STORY.bondToUnlock ? "open" : (state.harass > state.help ? "wary" : "neutral");
const encText = e => e.text[e.text[mood()] ? mood() : "neutral"];
const whoName = w => ({ echo: "Echo", kovasko: "Kovasko", clarisse: "Clarisse" }[w]);

function encountersHere() {
  if (phase !== "world" || finished) return [];
  const here = Scene.info().id;
  return ENCOUNTERS.filter(e => e.place === here && !state.talked[e.id] && beatIndex > beatIdx(e.after));
}

function startEncounter(id) {
  const e = encountersHere().find(x => x.id === id);
  if (!e) return;
  activeEnc = e; phase = "dialog";
  render();
}

function finishEncounter() {
  state.talked[activeEnc.id] = true;
  activeEnc = null; phase = "world";
  render();
  maybeStartBeat();
}

let lastSnap = null;   // the state at the start of the last scene (a second chance after an ending that is not "Echo stays")

function retryLastScene() {
  if (!lastSnap) return;
  state = JSON.parse(JSON.stringify(lastSnap.state));
  beatIndex = lastSnap.beatIndex; finished = false; phase = "dialog";
  Nexus.reset(); Nexus.beat(STORY.beats[beatIndex].id);
  render();
}

let pending = null;   // what the phone may answer right now: { token, kind: "choice" | "continue" | "restart", choices }
let sentSig = null;   // the last state sent (to send only what changed)

function phoneState() {
  pending = null;
  const empty = { fr: "", en: "" };
  if (phase === "dialog" && activeEnc) {
    const e = activeEnc, token = "e:" + e.id;
    pending = { token, kind: "encounter", choices: e.choices };
    return { mode: "choose", token, place: Scene.info().place, prompt: { fr: fill(Q_ENC.fr), en: fill(Q_ENC.en) },
      choices: e.choices.map(c => ({ fr: fill(c.label.fr), en: fill(c.label.en) })) };
  }
  if (phase === "world") {
    const i = Scene.info();
    const talk = encountersHere().map(e => ({ id: e.id, label: { fr: "Parler à " + whoName(e.who), en: "Talk to " + whoName(e.who) } }));
    if (i.atGoal && !talk.length) return { mode: "wait", place: i.place };   // the scene is about to start here: no need to move
    return { mode: "move", place: i.place, goal: i.atGoal ? null : i.goal, exits: i.atGoal ? [] : i.exits, talk };
  }
  if (phase === "dialog" && !finished) {
    const beat = STORY.beats[beatIndex], place = Scene.info().place;
    const alone = beat.alone && state.bond < STORY.bondToUnlock;
    const choices = alone ? (beat.alone.choices || []) : beat.choices;
    const token = "b" + beatIndex;
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
    return { mode: "choose", token: "end", place: Scene.info().place, prompt: empty, choices };
  }
  return { mode: "wait" };
}

function syncPhone() {
  const s = phoneState();
  if (!Link.connected) return;
  const sig = JSON.stringify(s);
  if (sig === sentSig) return;
  sentSig = sig;
  Link.send({ type: "state", ...s });
}

// The phone answered
Link.onMessage = m => {
  if (m.type === "go") {                                      // walk to another place
    if (phase !== "world" || Scene.moving) return;
    if (Scene.info().exits.some(x => x.to === m.to)) Scene.go(m.to);
    return;
  }
  if (m.type === "talk") { startEncounter(m.id); return; }
  if (m.type !== "choose" || !pending || m.token !== pending.token) return;
  const p = pending; pending = null;
  if (p.kind === "choice") { const c = p.choices[m.index]; if (c) choose(c); }
  else if (p.kind === "encounter") { const c = p.choices[m.index]; if (c) { applyChoice(c, Math.max(0, beatIndex - 1)); finishEncounter(); } }
  else if (p.kind === "continue") next();
  else if (p.kind === "restart") { if (m.index === 1) retryLastScene(); else restart(); }
};

const noteApplies = n => (n.flag && state.flags[n.flag]) || (n.bondMin !== undefined && state.bond >= n.bondMin) || (n.bondMax !== undefined && state.bond <= n.bondMax);

function renderTitle() {
  $("gameName").textContent = TITLE.name;
  $("tagline").textContent = L(TITLE.tagline);
  $("playBtn").textContent = L(TITLE.play);
  $("credits").textContent = TITLE.credits;
}

function renderIntro() {
  const page = INTRO[introIndex];
  $("introBg").style.backgroundImage = page.image ? `url(${page.image})` : "";
  $("introBg").hidden = !page.image;
  $("title").textContent = L(page.title);
  $("body").textContent = L(page.text);
  addButton(french ? "Suivant" : "Next", () => {
    introIndex++;
    if (introIndex >= INTRO.length) phase = "profile";
    render();
  });
}

// Head-and-shoulders silhouette in the avatar's colour (no emoji).
function silhouette(color) {
  return `<span class="sil" style="--c:${color}"><i></i><b></b></span>`;
}

// Choose a photo -> frame it (drag / zoom) -> it becomes a cyberpunk avatar
async function frame(img, previous) {
  const res = await Cropper.open(img, { title: L(PROFILE.cropTitle), hint: L(PROFILE.cropHint), ok: L(PROFILE.cropOk), cancel: L(PROFILE.cropCancel) }, previous);
  if (!res) return false;
  player.photo = Cyber.exportImage(img, res.crop);
  player.source = img; player.frame = res.state;
  player.avatar = "photo";
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
  $("choices").innerHTML = ""; // clicking an avatar redraws this screen: do not stack buttons
  $("title").textContent = L(PROFILE.title);
  $("body").textContent = "";
  $("profile").hidden = false;
  $("nameLabel").textContent = L(PROFILE.nameLabel);
  $("nameInput").placeholder = L(PROFILE.namePlaceholder);
  $("avatarLabel").textContent = L(PROFILE.avatarLabel);
  // the avatar is one big round slot: upload a photo (it becomes cyberpunk); without a photo, a plain default avatar is used
  $("slotImg").hidden = !player.photo;
  $("slotPlus").hidden = !!player.photo;
  if (player.photo) $("slotImg").src = player.photo.big;
  $("uploadText").textContent = L(player.photo ? PROFILE.uploadChange : PROFILE.upload);
  $("adjustBtn").hidden = !player.photo;
  $("adjustBtn").textContent = L(PROFILE.adjust);
  $("uploadNote").textContent = L(PROFILE.uploadNote);
  $("uploadErr").textContent = L(PROFILE.uploadErr);
  addButton(L(PROFILE.start), () => {
    player.name = $("nameInput").value.trim();
    if (!player.photo) player.avatar = PROFILE.defaultAvatar; // no photo: a plain default avatar
    startPhoneStep();
  });
  const start = $("choices").lastChild;
  const check = () => { start.disabled = !$("nameInput").value.trim(); }; // only the name is required
  $("nameInput").oninput = check;
  check();
}

// The phone: a 3D phone opening Nexus on screen, then a QR code to connect the real phone.
let noServer = false;
async function startPhoneStep() {
  const info = await Link.start();
  phase = "phone";
  noServer = !info;
  $("qr").innerHTML = "";
  if (info) {
    new QRCode($("qr"), { text: info.url, width: 200, height: 200, colorDark: "#0a0a1c", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    $("qrRoom").textContent = info.url.replace(/^https?:\/\//, "");
  }
  render();
}

function renderPhoneStep() {
  $("callLabel").textContent = french ? "Ouverture…" : "Opening…";
  $("qr").hidden = noServer; $("qrRoom").hidden = noServer;
  $("qrText").textContent = noServer
    ? (french ? "Le jeu a besoin du serveur. Lance « npm start » dans le dossier server, puis ouvre http://localhost:3000." : "The game needs the server. Run “npm start” in the server folder, then open http://localhost:3000.")
    : phase === "phone"
      ? (french ? "Scanne pour ouvrir Nexus sur ton téléphone." : "Scan to open Nexus on your phone.")
      : (french ? "Ton téléphone s’est déconnecté. Scanne le QR code pour reprendre." : "Your phone disconnected. Scan the QR code to continue.");
}

Link.onPeer = connected => {
  if (connected) {
    Link.send(profileMsg());
    updateJournal.sig = null; updateJournal();
    sentSig = null;                                  // a phone (re)connected: send it the whole state again
    if (phase === "phone") setTimeout(() => { if (phase === "phone") restart(); }, 1800);
    else render();
  } else {
    sentSig = null; render();                        // the phone left: the game waits for it
  }
};

function toast(text) {
  const t = $("toast");
  t.textContent = text; t.hidden = false;
  clearTimeout(toast.id); toast.id = setTimeout(() => { t.hidden = true; }, 6000);
}

function next() {
  beatIndex++;
  if (beatIndex >= STORY.beats.length) { finished = true; phase = "ending"; }
  else { phase = "world"; Scene.setBeat(STORY.beats[beatIndex].id); }
  render();
  maybeStartBeat();
}

function renderEnding() {
  const e = STORY.endings.find(x => x.id === endingId()) || STORY.endings[0];
  $("title").textContent = L(e.title);
  $("body").textContent = L(e.text);
  const lore = state.bond >= STORY.bondToUnlock ? STORY.loreUnlocked : STORY.loreClosed;
  $("prompt").textContent = fill(french ? "{name}, voici l’état d’Echo à la fin : " : "{name}, here is Echo’s state at the end: ") + L(STORY.stages[stage()]) + "\n" + L(lore);
  $("prompt").style.whiteSpace = "pre-line";
}

// Gauge: no label, just green -> orange -> red and a smiley.
function updateGauge() {
  const v = Math.min(1, state.harass / Math.max(1, STORY.harassStage3));
  const hue = 130 - 130 * v; // green (130) to red (0), passes through orange
  const color = `hsl(${hue}, 75%, 50%)`;
  $("gaugeFill").style.width = (v * 100) + "%";
  $("gaugeFill").style.background = color;
  $("face").textContent = [":)", ":|", ":(", ">:("][stage()];
  $("face").style.color = color;
}

// The journal is already written: one entry per scene reached so far.
function updateJournal() {
  const last = finished ? STORY.beats.length - 1 : (phase === "dialog" ? beatIndex : beatIndex - 1);
  const entries = [];
  // one entry per scene: what you did and how it felt (not the thought before the choice), so the journal stays short
  STORY.beats.slice(0, last + 1).forEach((b, i) => {
    if (b.alone && state.flags["alone_" + b.id]) entries.push(b.alone.journal || b.journal);
    else state.extra.filter(x => x.beat === i).forEach(x => entries.push(x.text));
  });
  // the journal lives on the phone
  const sig = entries.length + "|" + french;
  if (sig !== updateJournal.sig && Link.connected) {
    updateJournal.sig = sig;
    Link.send({ type: "journal", entries: entries.map(t => ({ fr: fill(t.fr), en: fill(t.en) })) });
  }
}

$("playBtn").onclick = () => { phase = "intro"; render(); };

state = newState();
beatIndex = 0;
finished = false;
Scene.current = "toit"; // the title page shows the rooftop
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

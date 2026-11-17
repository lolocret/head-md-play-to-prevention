// Echo — text-and-choice prototype. Only the player makes choices.
let french = true;
let state, beatIndex, finished;
const newState = () => ({ harass: 0, passive: 0, help: 0, bond: 0, flags: {}, extra: [] });
let phase = "title", introIndex = 0; // title | intro | profile | phone | world | dialog | ending
let player = { name: "", avatar: null };

const $ = id => document.getElementById(id);
const L = t => (french ? t.fr : t.en);

function restart() {
  state = newState();
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
      phase = "dialog"; render();
      Nexus.beat(STORY.beats[idx].id); // the scene starts: messages arrive on the phone
    }
  }, 700);
}
Scene.onEnter = maybeStartBeat;

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
  $("choices").innerHTML = "";
  $("prompt").textContent = "";
  $("profile").hidden = true;
  $("titleScreen").hidden = phase !== "title";
  document.body.classList.toggle("on-title", phase === "title");
  if (phase === "title") renderTitle();
  $("me").hidden = phase === "title" || phase === "intro" || phase === "profile";
  Scene.unlocked.altaya = state.bond >= STORY.bondToUnlock;
  Scene.french = french;
  Scene.stage = stage();
  Scene.refresh();
  $("main").hidden = phase === "title" || phase === "world" || phase === "phone";
  $("phoneScreen").hidden = phase !== "phone";
  if (phase === "phone") renderPhoneStep();
  document.body.classList.toggle("vn", phase === "dialog");
  $("goal").hidden = phase !== "world";
  if (phase === "world") $("goal").textContent = (french ? "Va à : " : "Go to: ") + Scene.goalLabel() +
    (french ? "  (clique sur la flèche rose)" : "  (click the pink arrow)");
  updateGauge();
  updateJournal();

  if (phase === "title") return;
  if (phase === "intro") return renderIntro();
  if (phase === "profile") return renderProfile();
  if (phase === "phone") return;

  if (phase === "world") return;
  if (finished) return renderEnding();

  const beat = STORY.beats[beatIndex];
  // "alone" variant: shown when the player is not close enough to Echo (Altaya stays closed)
  const alone = beat.alone && state.bond < STORY.bondToUnlock;
  const text = alone ? beat.alone.text : beat.text;
  const choices = alone ? (beat.alone.choices || []) : beat.choices;
  $("title").textContent = L(beat.title);
  let body = L(text);
  (beat.notes || []).forEach(n => { if (state.flags[n.flag]) body += "\n\n" + L(n.text); });
  $("body").textContent = body;
  const hasChoices = choices && choices.length > 0;
  $("prompt").textContent = hasChoices && beat.prompt ? L(beat.prompt) : "";

  if (hasChoices) {
    choices.forEach(c => addButton(L(c.label), () => {
      const before = state.bond >= STORY.bondToUnlock;
      for (const k of ["harass", "passive", "help", "bond"]) state[k] += c[k] || 0;
      if (c.flag) state.flags[c.flag] = true;
      if (c.help > 0) Nexus.cold(c.help); // helping Echo: the others answer coldly
      if (c.journal) state.extra.push({ beat: beatIndex, text: c.journal });
      if (!before && state.bond >= STORY.bondToUnlock) toast(french ? "Un nouveau lieu est accessible : Altaya" : "A new place is now open: Altaya");
      next();
    }));
  } else {
    addButton(french ? "Continuer" : "Continue", next);
  }
}

function renderTitle() {
  $("gameName").textContent = TITLE.name;
  $("tagline").textContent = L(TITLE.tagline);
  $("playBtn").textContent = L(TITLE.play);
  $("credits").textContent = TITLE.credits;
}

function renderIntro() {
  const page = INTRO[introIndex];
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

function renderProfile() {
  $("choices").innerHTML = ""; // clicking an avatar redraws this screen: do not stack buttons
  $("title").textContent = L(PROFILE.title);
  $("body").textContent = "";
  $("profile").hidden = false;
  $("nameLabel").textContent = L(PROFILE.nameLabel);
  $("nameInput").placeholder = L(PROFILE.namePlaceholder);
  $("avatarLabel").textContent = L(PROFILE.avatarLabel);
  $("avatars").innerHTML = "";
  PROFILE.avatars.forEach(a => {
    const b = document.createElement("button");
    b.className = "avatar" + (player.avatar === a ? " selected" : "");
    b.innerHTML = silhouette(a);
    b.onclick = () => { player.avatar = a; renderProfile(); };
    $("avatars").appendChild(b);
  });
  addButton(L(PROFILE.start), () => {
    player.name = $("nameInput").value.trim();
    startPhoneStep();
  });
  const start = $("choices").lastChild;
  const check = () => { start.disabled = !($("nameInput").value.trim() && player.avatar); };
  $("nameInput").oninput = check;
  check();
}

// The phone: a 3D phone opening Nexus on screen, then a QR code to connect the real phone.
async function startPhoneStep() {
  const info = await Link.start();
  if (!info) { restart(); return; }                 // no server: play without a phone
  phase = "phone";
  $("qr").innerHTML = "";
  new QRCode($("qr"), { text: info.url, width: 200, height: 200, colorDark: "#0a0a1c", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  $("qrRoom").textContent = info.url.replace(/^https?:\/\//, "");
  render();
}

function renderPhoneStep() {
  $("callLabel").textContent = french ? "Ouverture…" : "Opening…";
  $("qrText").textContent = french ? "Scanne pour ouvrir Nexus sur ton téléphone." : "Scan to open Nexus on your phone.";
  $("soloBtn").textContent = french ? "Jouer sans téléphone" : "Play without a phone";
}

Link.onPeer = connected => {
  if (connected) {
    Link.send({ type: "profile", name: player.name, avatar: player.avatar, french });
    updateJournal.sig = null; updateJournal();
    if (phase === "phone") setTimeout(() => { if (phase === "phone") restart(); }, 1800);
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
  $("prompt").textContent = (french ? "État d’Echo à la fin : " : "Echo’s state at the end: ") + L(STORY.stages[stage()]) + "\n" + L(lore);
  $("prompt").style.whiteSpace = "pre-line";
  addButton(french ? "Rejouer" : "Play again", restart);
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
  $("journalTitle").textContent = (french ? "Mon journal" : "My journal") + (player.name ? " — " + player.name : "");
  $("meAvatar").innerHTML = player.avatar ? silhouette(player.avatar) : "";
  $("meName").textContent = player.name;
  const last = finished ? STORY.beats.length - 1 : (phase === "dialog" ? beatIndex : beatIndex - 1);
  $("journalBody").innerHTML = "";
  const entries = [];
  STORY.beats.slice(0, last + 1).forEach((b, i) => {
    if (b.journal) entries.push(b.journal);
    state.extra.filter(x => x.beat === i).forEach(x => entries.push(x.text)); // what the choice cost you
  });
  entries.forEach(t => {
    const p = document.createElement("p");
    p.textContent = L(t);
    $("journalBody").appendChild(p);
  });
  // the same entries appear in the journal on the phone
  const sig = entries.length + "|" + french;
  if (sig !== updateJournal.sig && Link.connected) {
    updateJournal.sig = sig;
    Link.send({ type: "journal", entries: entries.map(t => ({ fr: t.fr, en: t.en })) });
  }
}

$("playBtn").onclick = () => { phase = "intro"; render(); };
$("lang").onclick = () => { french = !french; Link.send({ type: "profile", name: player.name, avatar: player.avatar, french }); render(); };
$("soloBtn").onclick = () => { restart(); };
$("journalBtn").onclick = () => { $("journal").hidden = !$("journal").hidden; };
$("journalClose").onclick = () => { $("journal").hidden = true; };
$("journal").onclick = e => { if (e.target.id === "journal") $("journal").hidden = true; };

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

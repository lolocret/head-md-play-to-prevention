// The places: a full-screen picture per place (images/<id>.png / .jpg / .webp). The story takes the player from place to place:
// there is nothing to walk or click here, the screen only displays.
const Scene = (() => {
  const PLACES = {
    couloir: { name: { fr: "Le couloir", en: "The hallway" }, sky: ["#1d2150", "#0c0e26"], glow: "#4df0ff" },
    classe: { name: { fr: "Classe 3B", en: "Class 3B" }, sky: ["#2a2560", "#171340"], glow: "#8a5cff" },
    toit: { name: { fr: "Le toit", en: "The roof" }, sky: ["#050a26", "#1a1245"], glow: "#ff4fc3" },
    serre: { name: { fr: "La Serre", en: "La Serre" }, sky: ["#0a2a2e", "#0c1a2a"], glow: "#7dffb2" },
    chambre: { name: { fr: "Chez toi", en: "At home" }, sky: ["#2a1838", "#150c20"], glow: "#ff4fc3" },
    altaya: { name: { fr: "Altaya", en: "Altaya" }, sky: ["#1a1030", "#0a0a1c"], glow: "#4df0ff" },
  };
  // Characters: shown only when images/characters/<id>.png exists.
  const CHARACTER_FILES = ["echo"];   // the pictures that exist in images/characters (add "kovasko", "clarisse", "student" when their pictures are added)
  const CHARS = { echo: { n: "Echo" }, kovasko: { n: "Kovasko" }, clarisse: { n: "Clarisse" }, student: { n: "" } };
  // Where each scene happens and who is there (x, y = feet position in %).
  const BEATS = {   // x = middle of the feet, y = feet, both in % of the picture: the feet always stand on the floor of the place
    arrival:        { place: "classe", npcs: [{ id: "kovasko", x: 66, y: 72 }, { id: "echo", x: 54, y: 78 }] },
    hello:          { place: "classe", npcs: [{ id: "echo", x: 54, y: 78 }, { id: "student", x: 66, y: 74 }] },
    lunch:          { place: "couloir", npcs: [{ id: "echo", x: 31, y: 78 }] },      // next to the bench
    evening:        { place: "chambre", npcs: [] },   // midnight: the player is at home with the phone
    nextday:        { place: "classe", npcs: [{ id: "kovasko", x: 62, y: 80 }] },
    kovasko_class:  { place: "classe", npcs: [{ id: "kovasko", x: 62, y: 80 }] },
    lesson:         { place: "classe", npcs: [{ id: "kovasko", x: 66, y: 72 }, { id: "clarisse", x: 54, y: 78 }] },   // Clarisse says it
    door:           { place: "toit", npcs: [{ id: "student", x: 36, y: 82 }, { id: "echo", x: 20, y: 80 }] },
    echo_roof:      { place: "toit", npcs: [{ id: "echo", x: 24, y: 80 }] },
    wipe:           { place: "couloir", npcs: [{ id: "echo", x: 52, y: 78 }] },
    labels:         { place: "couloir", npcs: [{ id: "clarisse", x: 68, y: 74 }, { id: "echo", x: 46, y: 78 }] },
    echo_hall:      { place: "toit", npcs: [{ id: "echo", x: 24, y: 80 }] },
    clarisse:       { place: "couloir", npcs: [{ id: "clarisse", x: 64, y: 78 }] },
    monday:         { place: "classe", npcs: [{ id: "echo", x: 48, y: 87 }] },
    clarisse_talk:  { place: "couloir", npcs: [{ id: "clarisse", x: 64, y: 78 }] },
    clarisse_hall:  { place: "couloir", npcs: [{ id: "clarisse", x: 64, y: 78 }] },
    turnoff:        { place: "serre", npcs: [] },       // Clarisse shares her plan in La Serre
    origins:        { place: "altaya", fallback: "couloir", npcs: [{ id: "echo", x: 38, y: 86 }] },
    echo_altaya:    { place: "altaya", npcs: [{ id: "echo", x: 38, y: 86 }] },
    night:          { place: "chambre", npcs: [] },
    night_echo:     { place: "chambre", npcs: [] },
    night_clarisse: { place: "chambre", npcs: [] },
    friday:         { place: "toit", npcs: [{ id: "echo", x: 16, y: 80 }, { id: "clarisse", x: 28, y: 80 }, { id: "student", x: 40, y: 82 }] },
  };


  const api = { characterFiles: CHARACTER_FILES, current: "couloir", unlocked: {}, french: true, stage: 0, bloom: 1, beatId: null, onEnter: () => {} };
  let el;

  // Where the current scene happens (Altaya is a closed place unless the bond with Echo is strong: then another place is used)
  const beatPlace = () => {
    const b = BEATS[api.beatId] || { place: "couloir" };
    return b.place === "altaya" && !api.unlocked.altaya ? (b.fallback || "couloir") : b.place;
  };

  function loadBackground(id, apply) {
    const light = Assets.url(`images/${id}.png`);   // the light copy loaded at the start
    if (light !== `images/${id}.png`) return apply(light);
    const exts = ["jpg", "png", "webp", "jpeg"];
    (function tryNext(i) {
      if (i >= exts.length) return apply(null);
      const img = new Image();
      img.onload = () => apply(`images/${id}.${exts[i]}`);
      img.onerror = () => tryNext(i + 1);
      img.src = `images/${id}.${exts[i]}`;
    })(0);
  }

  function render() {
    const p = PLACES[api.current];
    el.style.setProperty("--glow", p.glow);
    el.style.background = `radial-gradient(circle at 50% 30%, ${p.glow}33, transparent 60%), linear-gradient(${p.sky[0]}, ${p.sky[1]})`;
    el.innerHTML = "";
    const token = api.current;
    loadBackground(api.current, url => { if (token === api.current && url) el.style.background = `url(${url}) center/cover`; });
    const name = document.createElement("div"); name.className = "place-name";
    name.textContent = api.french ? p.name.fr : p.name.en; el.appendChild(name);
    const here = BEATS[api.beatId];
    if (here && beatPlace() === api.current) here.npcs.forEach(n => addSprite(n));
  }

  function addSprite(n) {
    if (!CHARACTER_FILES.includes(n.id)) return;   // no picture for this one: nothing to load (and no 404 in the console)
    const c = CHARS[n.id], token = api.current, src = `images/characters/${n.id}.png`;
    const show = img => {
      if (token !== api.current) return;
      const d = document.createElement("div");
      d.className = "sprite" + (n.id === "echo" ? " echo stage" + Math.min(api.stage, 3) : "");
      d.style.cssText = `left:${n.x}%;top:${n.y}%`;   // the feet stand on the floor of the picture
      img.className = "fig-img";
      d.appendChild(img);
      if (c.n) { const l = document.createElement("small"); l.textContent = c.n; d.appendChild(l); }
      el.appendChild(d);
    };
    const ready = Assets.img(src);
    if (ready) return show(ready.cloneNode());   // already loaded at the start: it appears at once
    const img = new Image();
    img.onload = () => show(img);
    img.src = src;
  }

  Object.assign(api, {
    init(e) { el = e; },
    refresh() { render(); },
    // go to another place (a short fade)
    go(id) {
      if (api.moving) return;
      api.moving = true;
      el.classList.add("fading");
      setTimeout(() => { api.current = id; api.moving = false; render(); el.classList.remove("fading"); api.onEnter(id); }, 300);
    },
    reset() { api.current = beatPlace(); render(); },
    setBeat(id) { api.beatId = id; render(); },
    atBeat() { return api.current === beatPlace(); },
    beatPlaceId() { return beatPlace(); },
    placeName() { return PLACES[api.current].name; },
  });
  return api;
})();

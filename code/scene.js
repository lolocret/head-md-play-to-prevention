// Street-View style scenes: a background image per place, arrows to walk to the next place.
// Put images in images/<id>.jpg (or .png / .webp); without one, a drawn fallback is shown.
const Scene = (() => {
  // rot: 0 = arrow points up (forward), 90 = right, 180 = back, 270 = left
  // needs: the arrow only appears once that place is unlocked (Altaya: bond with Echo).
  // Backgrounds: images/<id>.jpg (or .png / .webp).
  const PLACES = {
    couloir: { name: { fr: "Le couloir", en: "The hallway" }, sky: ["#1d2150", "#0c0e26"], glow: "#4df0ff",
      arrows: [{ to: "classe", x: 82, y: 74, rot: 90, label: { fr: "Classe 3B", en: "Class 3B" } },
               { to: "toit", x: 62, y: 66, rot: 0, label: { fr: "Monter au toit", en: "Go up to the roof" } },
               { to: "altaya", x: 16, y: 80, rot: 270, needs: "altaya", label: { fr: "Altaya", en: "Altaya" } },
               { to: "chambre", x: 50, y: 80, rot: 0, needs: "chambre", label: { fr: "Rentrer chez toi", en: "Go home" } }] },
    classe: { name: { fr: "Classe 3B", en: "Class 3B" }, sky: ["#2a2560", "#171340"], glow: "#8a5cff",
      arrows: [{ to: "couloir", x: 50, y: 88, rot: 180, label: { fr: "Retourner dans le couloir", en: "Back to the hallway" } }] },
    toit: { name: { fr: "Le toit", en: "The roof" }, sky: ["#050a26", "#1a1245"], glow: "#ff4fc3",
      arrows: [{ to: "serre", x: 86, y: 66, rot: 90, label: { fr: "La Serre", en: "La Serre" } },
               { to: "couloir", x: 50, y: 88, rot: 180, label: { fr: "Redescendre", en: "Go down" } }] },
    serre: { name: { fr: "La Serre", en: "La Serre" }, sky: ["#0a2a2e", "#0c1a2a"], glow: "#7dffb2",
      arrows: [{ to: "toit", x: 50, y: 88, rot: 180, label: { fr: "Retourner sur le toit", en: "Back to the roof" } }] },
    chambre: { name: { fr: "Chez toi", en: "At home" }, sky: ["#2a1838", "#150c20"], glow: "#ff4fc3",
      arrows: [{ to: "couloir", x: 50, y: 88, rot: 180, label: { fr: "Sortir", en: "Go out" } }] },
    altaya: { name: { fr: "Altaya", en: "Altaya" }, sky: ["#1a1030", "#0a0a1c"], glow: "#4df0ff",
      arrows: [{ to: "couloir", x: 50, y: 88, rot: 180, label: { fr: "Retourner dans le couloir", en: "Back to the hallway" } }] },
  };
  // Characters: shown only when images/characters/<id>.png exists.
  const CHARS = {
    echo: { n: "Echo" }, kovasko: { n: "Kovasko" }, clarisse: { n: "Clarisse" }, student: { n: "" },
  };
  // Where each story beat happens and who is there (x, y = feet position in %).
  const BEATS = {
    arrival: { place: "classe", npcs: [{ id: "kovasko", x: 68, y: 82 }, { id: "echo", x: 46, y: 90 }] },
    hello:   { place: "classe", npcs: [{ id: "echo", x: 46, y: 90 }, { id: "student", x: 28, y: 90 }] },
    evening: { place: "couloir", npcs: [] },
    nextday: { place: "classe", npcs: [{ id: "kovasko", x: 64, y: 82 }] },
    door:    { place: "toit", npcs: [{ id: "student", x: 80, y: 88 }, { id: "echo", x: 60, y: 92 }] },
    clarisse: { place: "couloir", npcs: [{ id: "clarisse", x: 66, y: 90 }] },
    turnoff: { place: "couloir", npcs: [] },
    origins: { place: "altaya", fallback: "couloir", npcs: [{ id: "echo", x: 50, y: 90 }] },
    lunch:   { place: "couloir", npcs: [{ id: "echo", x: 38, y: 92 }] },
    lesson:  { place: "classe", npcs: [{ id: "kovasko", x: 64, y: 82 }] },
    monday:  { place: "classe", npcs: [{ id: "echo", x: 46, y: 90 }] },
    night:   { place: "chambre", npcs: [] },
    friday:  { place: "toit", npcs: [{ id: "echo", x: 52, y: 92 }, { id: "clarisse", x: 74, y: 88 }, { id: "student", x: 88, y: 90 }] },
    labels:  { place: "couloir", npcs: [{ id: "clarisse", x: 66, y: 90 }, { id: "echo", x: 38, y: 92 }] },
  };

  const api = { current: "couloir", unlocked: {}, french: true, stage: 0, beatId: null, onEnter: () => {} };
  let el, bgImg;

  const beatPlace = () => {
    const b = BEATS[api.beatId] || { place: "couloir" };
    return b.place === "altaya" && !api.unlocked.altaya ? (b.fallback || "couloir") : b.place;
  };
  const visible = a => !a.needs || api.unlocked[a.needs];

  // First arrow of the shortest path to the place where the next scene happens.
  function nextStep(from, to) {
    if (from === to) return null;
    const queue = [[from, null]], seen = new Set([from]);
    while (queue.length) {
      const [p, first] = queue.shift();
      for (const a of PLACES[p].arrows.filter(visible)) {
        if (seen.has(a.to)) continue;
        const f = first || a.to;
        if (a.to === to) return f;
        seen.add(a.to); queue.push([a.to, f]);
      }
    }
    return null;
  }

  function loadBackground(id, apply) {
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
    loadBackground(api.current, url => {
      if (token !== api.current || !url) return;
      el.style.background = `url(${url}) center/cover`;
      el.querySelectorAll(".decor").forEach(d => d.remove()); // a real image replaces the drawn decor
    });

    const name = document.createElement("div"); name.className = "place-name";
    name.textContent = api.french ? p.name.fr : p.name.en; el.appendChild(name);

    const here = BEATS[api.beatId];
    if (here && beatPlace() === api.current) here.npcs.forEach(n => addSprite(n));
    // the arrows are not drawn here: the screen only displays, the player moves from the phone
  }

  // Characters appear only when you add images/characters/<id>.png (transparent PNG).
  function addSprite(n) {
    const c = CHARS[n.id], token = api.current;
    const img = new Image();
    img.onload = () => {
      if (token !== api.current) return;
      const d = document.createElement("div");
      d.className = "sprite" + (n.id === "echo" ? " echo stage" + Math.min(api.stage, 3) : "");
      d.style.cssText = `left:${n.x}%;top:${n.y}%`;
      img.className = "fig-img";
      d.appendChild(img);
      if (c.n) { const l = document.createElement("small"); l.textContent = c.n; d.appendChild(l); }
      el.appendChild(d);
    };
    img.src = `images/characters/${n.id}.png`;
  }

  Object.assign(api, {
    init(e) { el = e; render(); },
    refresh() { render(); },
    go(id) {
      if (api.moving) return;
      api.moving = true;
      el.classList.add("fading");
      setTimeout(() => { api.current = id; api.moving = false; render(); el.classList.remove("fading"); api.onEnter(id); }, 300);
    },
    // start where the first scene happens
    reset() { api.current = beatPlace(); render(); },
    setBeat(id) { api.beatId = id; api.unlocked.chambre = id === "night"; render(); },   // "Chez toi" opens only for the night scene
    atBeat() { return api.current === beatPlace(); },
    // What the phone shows: where we are, where to go next, and the ways out (the pink one leads to the next scene)
    info() {
      const p = PLACES[api.current], guide = nextStep(api.current, beatPlace());
      return { id: api.current, place: p.name, goal: PLACES[beatPlace()].name, atGoal: api.current === beatPlace(),
        exits: p.arrows.filter(visible).map(a => ({ to: a.to, label: a.label, rot: a.rot, guide: a.to === guide })) };
    },
    goalLabel() { const p = PLACES[beatPlace()]; return api.french ? p.name.fr : p.name.en; },
  });
  return api;
})();

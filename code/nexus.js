// Nexus: the all-in-one network of the future, as seen on the player's phone.
// Messages arrive on the phone while the story plays on the computer.
// { t: thread, from: sender (null = system), fr, en, at: delay in ms after the scene starts }
const NEXUS = {
  threads: {
    class: { fr: "3B", en: "3B" },
    humans: { fr: "Humains de la 3B uniquement", en: "Humans of 3B only" },
    private: { fr: "On harcèle personne", en: "We harass nobody" },
    friday: { fr: "Sortie vendredi", en: "Friday outing" },
    echo: { fr: "Echo", en: "Echo" },
  },
  beats: {
    arrival: [
      { t: "class", from: "Kovasko", fr: "Bienvenue à Echo dans notre classe !", en: "Welcome to Echo in our class!", at: 1500 },
    ],
    hello: [
    ],
    evening: [
      { t: "class", from: "Lucas", fr: "[vidéo] Echo dit bonjour", en: "[video] Echo says hello", image: "images/video-hello.png", key: "video", at: 1000 },
      { t: "class", from: "Sam", fr: "tes émotions c’est des fictions", en: "your emotions are fictions", at: 6000 },
      { t: "class", from: "Maé", fr: "[mème]", en: "[meme]", image: "images/meme-echo.png", key: "meme", at: 9000 },
      { t: "humans", from: null, fr: "Maé a créé le groupe « Humains de la 3B uniquement ». Echo n’en fait pas partie.", en: "Maé created the group “Humans of 3B only”. Echo is not part of it.", at: 14000 },
    ],
    lunch: [
    ],
    lesson: [
    ],
    monday: [
      { t: "humans", from: "Clarisse", fr: "Qui est avec nous cette semaine ?", en: "Who is with us this week?", at: 2500 },
    ],
    nextday: [
      { t: "humans", from: "Lucas", fr: "regarde sa tête, haha", en: "look at his face, haha", at: 5000 },
    ],
    door: [
    ],
    labels: [
      { t: "humans", from: "Inès", fr: "j’ai piraté son dos, regardez ce qui s’affiche", en: "I hacked its back, look what shows up", key: "insults", at: 1000 },
      { t: "humans", from: "Sam", fr: "tu peux pas comprendre, t’es pas humain", en: "you can’t understand, you’re not human", at: 11000 },
    ],
    turnoff: [
      { t: "private", from: null, fr: "Clarisse t’a ajouté·e au groupe « On harcèle personne ».", en: "Clarisse added you to the group “We harass nobody”.", at: 800 },
      { t: "private", from: "Clarisse", fr: "On harcèle personne, c’est juste une machine.", en: "We’re not harassing anyone, it’s just a machine.", at: 3000 },
      { t: "private", from: "Clarisse", fr: "{name}, t’es avec nous ou avec la machine ?", en: "{name}, are you with us or with the machine?", at: 6000 },
      { t: "private", from: "Clarisse", fr: "Vendredi après les cours, on l’éteint. Code : KIPE-SAFE007", en: "Friday after class, we switch it off. Code: KIPE-SAFE007", key: "plan", at: 11000 },
    ],
    night: [
      { t: "echo", from: "Echo", fr: "Je sais ce que veulent dire les mots qu’on m’a collés. Merci d’être là, {name}.", en: "I know what the words stuck on me mean. Thank you for being there, {name}.", key: "echo", at: 2000, if: { bondMin: 4 } },
    ],
    friday: [
      { t: "private", from: "Clarisse", fr: "16h30, sur le toit. Viens filmer, {name}.", en: "4:30 pm, on the roof. Come film, {name}.", at: 1500 },
    ],
  },
  // Questions that appear in the phone's journal at intense moments: the player writes her own answer.
  prompts: {
    evening: { at: 24000, fr: "Cette soirée me rappelle une scène déjà vécue. Qu’est-ce que je ressentais ?", en: "This night reminds me of a scene I’ve already lived. What was I feeling?" },
    labels: { at: 20000, fr: "Qu’est-ce que j’aurais voulu répondre à « t’es pas humain » ?", en: "What would I have wanted to answer to “you’re not human”?" },
    turnoff: { at: 18000, fr: "Une fois, je n’ai rien dit. Qu’est-ce qui m’a retenu·e ?", en: "Once, I said nothing. What held me back?" },
    friday: { at: 6000, fr: "Si je pouvais revenir en arrière, que ferais-je autrement ?", en: "If I could go back, what would I do differently?" },
  },
  // Cold answers after the player helps Echo: indifference, then being left out.
  cold: [
    { from: "Maé", fr: "ah ok, {name}.", en: "oh ok, {name}." },
    { from: "Lucas", fr: "pk tu fais ça, {name}", en: "why are you doing that, {name}" },
    { from: "Noa", fr: "personne t’a rien demandé, {name}", en: "nobody asked you, {name}" },
    { from: "Inès", fr: "{name}, c’est bon, on a compris", en: "{name}, ok, we get it" },
  ],
  left_out: { t: "friday", from: null, fr: "Tu as été retiré·e du groupe « Sortie vendredi ».", en: "You were removed from the group “Friday outing”." },
};

// The scenes played inside a conversation (the player acts in it): which thread opens. In them nothing is stretched or silenced.
const NEXUS_CHATS = { evening: "class", labels: "humans", turnoff: "private", night: "echo" };

// Pace: in the other scenes the messages are spread out (every delay is multiplied), so the player has time to read
const PACE = 2.6;

const Nexus = (() => {
  let timers = [];
  const send = (m, quiet) => Link.send({ type: "msg", thread: m.t, threadName: NEXUS.threads[m.t], from: m.from, fr: fill(m.fr), en: fill(m.en), image: m.image, key: m.key,
    quiet: !!quiet && m.from !== null && !m.feel, feel: m.feel || (m.from ? undefined : "group") });   // a system line (added / removed) is a group notification
  return {
    reset() { timers.forEach(clearTimeout); timers = []; },
    // The scene `id` starts: its messages arrive on the phone.
    beat(id) {
      const live = !!NEXUS_CHATS[id];
      // Only a scene played inside a conversation has messages: nothing pops up while the player reads the story
      (live ? NEXUS.beats[id] || [] : []).forEach((m, i) => {
        if (m.if && typeof state !== "undefined" && state.bond < m.if.bondMin) return;   // e.g. Echo only writes if the bond is strong
        // a quiet message just lands (a dot, no banner, no sound): only the first message of a scene and group events make noise
        timers.push(setTimeout(() => send(m, !live && i > 0), live ? m.at : m.at * PACE));
      });
      const p = NEXUS.prompts[id];
      if (p) timers.push(setTimeout(() => Link.send({ type: "prompt", id, fr: fill(p.fr), en: fill(p.en) }), p.at * PACE));
    },
    // The player helped Echo: a cold answer (in the conversation they are in), and sometimes being removed from a group.
    cold(level, thread) {
      const c = NEXUS.cold[Math.floor(Math.random() * NEXUS.cold.length)];
      timers.push(setTimeout(() => send({ ...c, t: thread || "class", feel: "cold" }, false), 3500));
      if (level >= 2) timers.push(setTimeout(() => send({ ...NEXUS.left_out, feel: "left_out" }, false), 9000));
    },
  };
})();

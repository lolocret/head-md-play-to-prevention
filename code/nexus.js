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
      { t: "class", from: "Sam", fr: "tes émotions c’est des fictions", en: "your emotions are fictions", at: 1000 },
      { t: "class", from: "Maé", fr: "[mème]", en: "[meme]", image: "images/meme-echo.png", key: "meme", at: 3500 },
      { t: "humans", from: null, fr: "Maé a créé le groupe « Humains de la 3B uniquement ». Echo n’en fait pas partie.", en: "Maé created the group “Humans of 3B only”. Echo is not part of it.", at: 6000 },
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
    ],
    turnoff: [
      { t: "private", from: null, fr: "Clarisse t’a ajouté·e au groupe « On harcèle personne ».", en: "Clarisse added you to the group “We harass nobody”.", at: 800 },
      { t: "private", from: "Clarisse", fr: "On harcèle personne, c’est juste une machine.", en: "We’re not harassing anyone, it’s just a machine.", at: 2800 },
      { t: "private", from: "Clarisse", fr: "{name}, t’es avec nous ou avec la machine ?", en: "{name}, are you with us or with the machine?", at: 5000 },
      { t: "private", from: "Clarisse", fr: "Vendredi après les cours, on l’éteint. Code : KIPE-SAFE007", en: "Friday after class, we switch it off. Code: KIPE-SAFE007", key: "plan", at: 7500 },
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
    labels: { at: 20000, fr: "Si j’avais pu répondre à Inès, qu’aurais-je dit ?", en: "If I could have answered Inès, what would I have said?" },
    turnoff: { at: 18000, fr: "Une fois, je n’ai rien dit. Qu’est-ce qui m’a retenu·e ?", en: "Once, I said nothing. What held me back?" },
    friday: { at: 6000, fr: "Si je pouvais revenir en arrière, que ferais-je autrement ?", en: "If I could go back, what would I do differently?" },
  },
  // What the others do after the player acts in a conversation. Keyed by the choice's number (and ":mock" / ":support" for the meme).
  // thread = the conversation the player is in. `quiet`: a confirmation line (no sound, no banner).
  after: {
    evening: {
      0: [{ from: "Maé", fr: "{name} a de l’humour", en: "{name} has a sense of humour", at: 1500 }],
      1: [{ from: null, quiet: true, fr: "Mème signalé. Réponse automatique : « Ce contenu respecte nos règles. »", en: "Meme reported. Automatic reply: “This content follows our rules.”", at: 600 },
          { from: "Lucas", fr: "t’as signalé un mème ? sérieux ?", en: "you reported a meme? seriously?", at: 3000 }],
      2: [{ from: null, quiet: true, fr: "Capture d’écran enregistrée.", en: "Screenshot saved.", at: 600 }],
      3: [{ from: "Inès", fr: "oh ça va, c’est une blague", en: "oh come on, it’s a joke", at: 1500 }, { from: "Sam", fr: "{name} fait sa morale", en: "{name} is lecturing us", at: 3200 }],
      4: [{ from: "Lucas", fr: "haha {name} a compris la blague", en: "haha {name} gets the joke", at: 1500 }],
      5: [{ from: null, quiet: true, fr: "Tu as quitté le groupe « 3B ».", en: "You left the group “3B”.", at: 600 }],
      "7:mock": [{ from: "Maé", fr: "ahahah celui-là est trop bien", en: "ahahah that one is so good", at: 1500 }, { from: "Lucas", fr: "{name} le roi des mèmes", en: "{name}, king of memes", at: 3200 }],
      "7:support": [{ from: "Inès", fr: "c’est quoi ce mème ?", en: "what is this meme?", at: 1500 }, { from: "Lucas", fr: "{name} fait de la morale en mème, lol", en: "{name} is moralizing in memes, lol", at: 3200 }],
    },
    labels: {
      0: [{ from: "Inès", fr: "ahah exactement", en: "ahah exactly", at: 1500 }, { from: "Clarisse", fr: "voleur de vie.", en: "life thief.", at: 3200 }],
      1: [{ from: null, quiet: true, fr: "Message envoyé à Echo.", en: "Message sent to Echo.", at: 600 }, { from: "Lucas", fr: "t’es avec la machine, {name} ?", en: "are you with the machine, {name}?", at: 3000 }],
      2: [{ from: null, quiet: true, fr: "Insultes signalées.", en: "Insults reported.", at: 600 }, { from: "Clarisse", fr: "{name}, tu fais quoi là ?", en: "{name}, what are you doing?", at: 3000 }],
    },
    turnoff: {
      0: [{ from: "Clarisse", fr: "Parfait. Rendez-vous vendredi, {name}.", en: "Perfect. See you Friday, {name}.", at: 1500 }, { from: "Lucas", fr: "bienvenue", en: "welcome", at: 3000 }],
      1: [{ from: null, quiet: true, fr: "Capture envoyée à M. Kovasko.", en: "Screenshot sent to Mr. Kovasko.", at: 600 }],
      2: [{ from: null, quiet: true, fr: "Message envoyé à Echo.", en: "Message sent to Echo.", at: 600 }],
      3: [{ from: null, quiet: true, fr: "Tu as quitté le groupe « On harcèle personne ».", en: "You left the group “We harass nobody”.", at: 600 }],
    },
    night: {
      0: [{ from: "Echo", fr: "Merci. Ça fait du bien de ne pas être seul·e.", en: "Thank you. It feels good not to be alone.", at: 2000 }],
      1: [{ from: null, quiet: true, fr: "Message envoyé à Clarisse.", en: "Message sent to Clarisse.", at: 600 }],
    },
  },
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
    // When the player has seen every message of a scene played in a conversation (the options appear then)
    readyAt(id) { return Math.max(0, ...(NEXUS.beats[id] || []).map(m => m.at)) + 1200; },
    // The player acted in the conversation `thread`: the others react (the same people, in the same place), then how long to stay
    after(id, key, thread) {
      const list = (NEXUS.after[id] && (NEXUS.after[id][key] || NEXUS.after[id][String(key).split(":")[0]])) || [];
      list.forEach(m => timers.push(setTimeout(() => Link.send({ type: "msg", thread, threadName: NEXUS.threads[thread], from: m.from, fr: fill(m.fr), en: fill(m.en), quiet: !!m.quiet, feel: m.from ? undefined : "normal" }), m.at)));
      return 2200 + Math.max(0, ...list.map(m => m.at));
    },
  };
})();

// Nexus: the all-in-one network of the future, as seen on the player's phone.
// Messages arrive on the phone while the story plays on the computer.
// { t: thread, from: sender (null = system), fr, en, at: delay in ms after the scene starts }
const NEXUS = {
  threads: {
    class: { fr: "3B", en: "3B" },
    humans: { fr: "Humains de la 3B uniquement", en: "Humans of 3B only" },
    private: { fr: "On harcèle personne", en: "We harass nobody" },
    friday: { fr: "Sortie vendredi", en: "Friday outing" },
  },
  beats: {
    arrival: [
      { t: "class", from: "Kovasko", fr: "Bienvenue à Echo dans notre classe !", en: "Welcome to Echo in our class!", at: 1500 },
      { t: "class", from: "Lucas", fr: "un hologramme en 3B, on a gagné quoi", en: "a hologram in 3B, what did we win", at: 6000 },
    ],
    hello: [
      { t: "class", from: "Maé", fr: "{name}, t’as vu sa main qui traverse", en: "{name}, did you see his hand go through", at: 2500 },
    ],
    evening: [
      { t: "class", from: "Lucas", fr: "[vidéo] Echo dit bonjour (la main traverse)", en: "[video] Echo says hello (the hand goes through)", at: 800 },
      { t: "class", from: "Inès", fr: "t’es même pas réel", en: "you’re not even real", at: 3500 },
      { t: "class", from: "Sam", fr: "tes émotions c’est des fictions", en: "your emotions are fictions", at: 8000 },
      { t: "class", from: "Maé", fr: "[mème] Echo qu’on traverse en boucle : « get out of here u’re not even real »", en: "[meme] Echo being walked through on a loop: “get out of here u’re not even real”", at: 14000 },
      { t: "humans", from: null, fr: "Maé a créé le groupe « Humains de la 3B uniquement ». Echo n’en fait pas partie.", en: "Maé created the group “Humans of 3B only”. Echo is not part of it.", at: 22000 },
    ],
    lunch: [
      { t: "class", from: "Maé", fr: "[photo] Echo, tout seul·e sur son banc", en: "[photo] Echo, all alone on the bench", at: 2500 },
    ],
    lesson: [
      { t: "class", from: "Sam", fr: "t’as vu la tête de Kovasko, il comprend rien", en: "did you see Kovasko’s face, he gets nothing", at: 3000 },
    ],
    monday: [
      { t: "humans", from: "Clarisse", fr: "Qui est avec nous cette semaine ?", en: "Who is with us this week?", at: 2500 },
    ],
    nextday: [
      { t: "class", from: "Kovasko", fr: "Bonjour à tous, pensez à rendre vos devoirs.", en: "Good morning everyone, remember to hand in your homework.", at: 1500 },
      { t: "humans", from: "Lucas", fr: "regarde sa tête, haha", en: "look at his face, haha", at: 5000 },
    ],
    door: [
      { t: "humans", from: "Noa", fr: "réservé aux vrais, lol", en: "reserved for the real ones, lol", at: 1500 },
    ],
    labels: [
      { t: "humans", from: "Inès", fr: "j’ai piraté son dos, regardez ce qui s’affiche", en: "I hacked its back, look what shows up", at: 1500 },
      { t: "humans", from: "Clarisse", fr: "voleur de vie.", en: "life thief.", at: 4000 },
      { t: "class", from: "Yaël", fr: "je vais pas bien en ce moment", en: "I’m not doing well right now", at: 9000 },
      { t: "class", from: "Echo", fr: "Je suis là. Tu veux en parler ?", en: "I’m here. Do you want to talk?", at: 12000 },
      { t: "class", from: "Sam", fr: "tu peux pas comprendre, t’es pas humain", en: "you can’t understand, you’re not human", at: 15500 },
    ],
    turnoff: [
      { t: "private", from: null, fr: "Clarisse t’a ajouté·e au groupe « On harcèle personne ».", en: "Clarisse added you to the group “We harass nobody”.", at: 1000 },
      { t: "private", from: "Clarisse", fr: "On harcèle personne, c’est juste une machine.", en: "We’re not harassing anyone, it’s just a machine.", at: 3500 },
      { t: "private", from: "Clarisse", fr: "{name}, t’es avec nous ou avec la machine ?", en: "{name}, are you with us or with the machine?", at: 7000 },
      { t: "private", from: "Lucas", fr: "{name}, si tu dis rien, tu approuves", en: "{name}, if you say nothing, you agree", at: 10000 },
      { t: "private", from: "Clarisse", fr: "Vendredi après les cours, on l’éteint. Code : KIPE-SAFE007", en: "Friday after class, we switch it off. Code: KIPE-SAFE007", at: 14000 },
    ],
    friday: [
      { t: "private", from: "Clarisse", fr: "16h30, sur le toit. Viens filmer, {name}.", en: "4:30 pm, on the roof. Come film, {name}.", at: 1500 },
    ],
  },
  // Questions that appear in the phone's journal at intense moments: the player writes her own answer.
  prompts: {
    evening: { at: 24000, fr: "Cette soirée me rappelle une scène que j’ai déjà vécue. Je ne sais plus laquelle. Qu’est-ce que je ressentais, à ce moment-là ?", en: "This night reminds me of a scene I’ve already lived. I don’t remember which one. What was I feeling back then?" },
    labels: { at: 20000, fr: "Quand quelqu’un a dit « tu peux pas comprendre, t’es pas humain », qu’est-ce que j’aurais voulu dire ?", en: "When someone said “you can’t understand, you’re not human”, what would I have wanted to say?" },
    turnoff: { at: 18000, fr: "« Si tu dis rien, tu approuves. » Est-ce que c’est vrai ? Une fois, je n’ai rien dit : qu’est-ce qui m’a retenu·e ?", en: "“If you say nothing, you agree.” Is that true? Once, I said nothing: what held me back?" },
    friday: { at: 6000, fr: "Si je pouvais revenir en arrière dans une situation, ce serait laquelle ? Qu’est-ce que je ferais autrement ?", en: "If I could go back to one situation, which would it be? What would I do differently?" },
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

// Pace: messages are spread out (every delay is multiplied), so the player has time to read the story
const PACE = 2.6;

const Nexus = (() => {
  let timers = [];
  // quiet = the message just lands in the conversation (a badge, no banner, no sound): only the first message of a scene and the group events make noise
  const push = (m, at, quiet) => timers.push(setTimeout(() => {
    Link.send({ type: "msg", thread: m.t, threadName: NEXUS.threads[m.t], from: m.from, fr: fill(m.fr), en: fill(m.en), quiet: !!quiet && m.from !== null && !m.feel, feel: m.feel || (m.from ? undefined : "group") });  // a system line (added to / removed from a group) is a group notification
  }, at * PACE));
  return {
    reset() { timers.forEach(clearTimeout); timers = []; },
    // The scene `id` starts: its messages arrive on the phone.
    beat(id) {
      (NEXUS.beats[id] || []).forEach((m, i) => push(m, m.at, i > 0));
      const p = NEXUS.prompts[id];
      if (p) timers.push(setTimeout(() => Link.send({ type: "prompt", id, fr: fill(p.fr), en: fill(p.en) }), p.at * PACE));
    },
    // The player helped Echo: a cold answer, and sometimes being removed from a group.
    cold(level) {
      const c = NEXUS.cold[Math.floor(Math.random() * NEXUS.cold.length)];
      push({ ...c, t: "class", feel: "cold" }, 4000);
      if (level >= 2) push({ ...NEXUS.left_out, feel: "left_out" }, 9000);
    },
  };
})();

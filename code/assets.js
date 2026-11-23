// Loads every picture of the game before it starts, so no scene ever shows an empty background.
// Each picture has a light copy in images/web/ (made by `npm start`, see server/optimize-images.js): it is used when it exists.
const Assets = (() => {
  const map = {};   // original path -> path actually loaded
  const web = p => p.replace(/^images\/([^/]+)\.(png|jpe?g|webp)$/i, "images/web/$1.jpg");
  const load = src => new Promise(res => {
    const img = new Image();
    img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => res(true));
    img.onerror = () => res(false);   // a missing picture is not an error: the place just has a plain background
    img.src = src;
  });
  async function one(p) {
    const w = web(p);
    if (w !== p && await load(w)) { map[p] = w; return; }
    await load(p);
  }
  return {
    url: p => map[p] || p,
    // list: picture paths. onProgress(0..1). Never waits more than 25 s.
    preload(list, onProgress) {
      const all = [...new Set(list)];
      let done = 0;
      const work = Promise.all(all.map(p => one(p).then(() => { done++; if (onProgress) onProgress(done / all.length); })));
      return Promise.race([work, new Promise(r => setTimeout(r, 25000))]);
    },
  };
})();

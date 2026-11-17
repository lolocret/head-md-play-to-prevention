// Turns a photo into a cyberpunk portrait, entirely in the browser (nothing is uploaded or saved):
// duotone neon colours, glowing cyan edges, red/blue split, scanlines and a few glitch bands.
const Cyber = (() => {
  const make = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const STOPS = [[0, [8, 4, 32]], [0.35, [70, 20, 160]], [0.62, [255, 79, 195]], [0.85, [77, 240, 255]], [1, [150, 250, 255]]];
  const ramp = Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    for (let k = 1; k < STOPS.length; k++) {
      if (t <= STOPS[k][0]) {
        const [t0, c0] = STOPS[k - 1], [t1, c1] = STOPS[k], f = (t - t0) / (t1 - t0);
        return c0.map((v, j) => Math.round(v + (c1[j] - v) * f));
      }
    }
    return STOPS[STOPS.length - 1][1];
  });

  // crop = { sx, sy, side } in source pixels (chosen by the player); default: a centred square, a bit toward the top (faces)
  function render(source, size = 256, crop) {
    const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
    const side = crop ? crop.side : Math.min(sw, sh), sx = crop ? crop.sx : (sw - side) / 2, sy = crop ? crop.sy : (sh - side) * 0.3;
    const base = make(size, size), ctx = base.getContext("2d");
    ctx.drawImage(source, sx, sy, side, side, 0, 0, size, size);
    const s = ctx.getImageData(0, 0, size, size).data, n = size * size;

    const lum = new Uint8Array(n);                                   // brightness with more contrast
    for (let i = 0; i < n; i++) {
      const l = (0.299 * s[i * 4] + 0.587 * s[i * 4 + 1] + 0.114 * s[i * 4 + 2]) / 255;
      lum[i] = Math.round(Math.pow(Math.min(1, Math.max(0, (l - 0.5) * 1.5 + 0.5)), 1.6) * 255); // darker mid-tones: bright walls do not blow out
    }
    const edge = new Float32Array(n);                                // Sobel edges
    for (let y = 1; y < size - 1; y++) for (let x = 1; x < size - 1; x++) {
      const i = y * size + x;
      const gx = -lum[i - size - 1] - 2 * lum[i - 1] - lum[i + size - 1] + lum[i - size + 1] + 2 * lum[i + 1] + lum[i + size + 1];
      const gy = -lum[i - size - 1] - 2 * lum[i - size] - lum[i - size + 1] + lum[i + size - 1] + 2 * lum[i + size] + lum[i + size + 1];
      edge[i] = Math.min(1, Math.hypot(gx, gy) / 255 * 1.6);
    }

    const out = ctx.createImageData(size, size), o = out.data, shift = Math.max(2, Math.round(size / 70));
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = y * size + x, xr = Math.max(0, x - shift), xb = Math.min(size - 1, x + shift);
      let r = ramp[lum[y * size + xr]][0], g = ramp[lum[i]][1], b = ramp[lum[y * size + xb]][2];
      const e = edge[i] * 0.85;                                      // glowing cyan edges
      r += (77 - r) * e; g += (240 - g) * e; b += (255 - b) * e;
      const k = y % 3 === 0 ? 0.86 : 1;                              // scanlines
      o[i * 4] = r * k; o[i * 4 + 1] = g * k; o[i * 4 + 2] = b * k; o[i * 4 + 3] = 255;
    }
    for (let band = 0; band < 3; band++) {                           // glitch bands: rows pushed sideways
      const y0 = Math.floor(Math.random() * (size - 12)), h = 3 + Math.floor(Math.random() * 7), dx = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.floor(Math.random() * 10));
      for (let y = y0; y < y0 + h; y++) {
        const row = o.slice(y * size * 4, (y + 1) * size * 4);
        for (let x = 0; x < size; x++) {
          const from = ((x - dx + size) % size) * 4, to = (y * size + x) * 4;
          o[to] = row[from]; o[to + 1] = row[from + 1]; o[to + 2] = row[from + 2];
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    const v = ctx.createRadialGradient(size / 2, size / 2, size * 0.35, size / 2, size / 2, size * 0.72);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(8,4,32,.9)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, size, size);
    return base;
  }

  // Loads the chosen file as an image (the address is freed with release())
  function load(file) {
    const url = URL.createObjectURL(file);
    return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => { URL.revokeObjectURL(url); rej(new Error("unreadable")); }; im.src = url; });
  }
  const release = img => { try { URL.revokeObjectURL(img.src); } catch (e) { /* nothing to free */ } };
  // -> { big, small } image addresses (small goes to the phone)
  const exportImage = (img, crop) => ({ big: render(img, 256, crop).toDataURL("image/jpeg", 0.9), small: render(img, 96, crop).toDataURL("image/jpeg", 0.85) });
  return { render, load, release, exportImage };
})();

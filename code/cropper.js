// A square frame to reposition and zoom a photo (drag, pinch, slider or wheel), like on WhatsApp.
const Cropper = (() => {
  const V = 300; // size of the frame on screen, in pixels

  // The part of the photo (in photo pixels) that is inside the frame.
  // zoom >= 1; (ox, oy) = how far the photo is moved from the centre, in screen pixels.
  function cropFromState(nw, nh, zoom, ox, oy) {
    const s = (V / Math.min(nw, nh)) * zoom;           // screen pixels per photo pixel
    const side = V / s;
    const cx = nw / 2 - ox / s, cy = nh / 2 - oy / s;
    return { sx: cx - side / 2, sy: cy - side / 2, side };
  }
  const limit = (nw, nh, zoom) => { const s = (V / Math.min(nw, nh)) * zoom; return { x: Math.max(0, (nw * s - V) / 2), y: Math.max(0, (nh * s - V) / 2) }; };
  const clamp = (v, m) => Math.max(-m, Math.min(m, v));

  // Opens the frame on `img`. Resolves { crop, state } when validated, or null when cancelled.
  function open(img, texts, previous) {
    return new Promise(resolve => {
      const root = document.getElementById("cropper"), view = document.getElementById("cropView"), pic = document.getElementById("cropImg");
      const zoomEl = document.getElementById("cropZoom"), ok = document.getElementById("cropOk"), cancel = document.getElementById("cropCancel");
      document.getElementById("cropTitle").textContent = texts.title;
      document.getElementById("cropHint").textContent = texts.hint;
      ok.textContent = texts.ok; cancel.textContent = texts.cancel;
      const nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
      let zoom = previous ? previous.zoom : 1, ox = previous ? previous.ox : 0, oy = previous ? previous.oy : 0;
      pic.src = img.src;

      const apply = () => {
        const lim = limit(nw, nh, zoom);
        ox = clamp(ox, lim.x); oy = clamp(oy, lim.y);
        const s = (V / Math.min(nw, nh)) * zoom;
        pic.style.width = nw * s + "px"; pic.style.height = nh * s + "px";
        pic.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
        zoomEl.value = zoom;
      };
      const setZoom = z => { zoom = Math.max(1, Math.min(4, z)); apply(); };

      const pointers = new Map(); let pinch = null;
      view.onpointerdown = e => { view.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); pinch = null; };
      view.onpointermove = e => {
        const p = pointers.get(e.pointerId); if (!p) return;
        if (pointers.size === 1) { ox += e.clientX - p.x; oy += e.clientY - p.y; }
        p.x = e.clientX; p.y = e.clientY;
        if (pointers.size === 2) {                           // pinch to zoom
          const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch) setZoom(zoom * d / pinch);
          pinch = d;
        } else apply();
      };
      const up = e => { pointers.delete(e.pointerId); pinch = null; };
      view.onpointerup = up; view.onpointercancel = up;
      view.onwheel = e => { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.08 : 0.92)); };
      zoomEl.oninput = () => setZoom(parseFloat(zoomEl.value));

      const close = result => { root.hidden = true; view.onpointerdown = view.onpointermove = view.onpointerup = view.onpointercancel = view.onwheel = null; resolve(result); };
      ok.onclick = () => close({ crop: cropFromState(nw, nh, zoom, ox, oy), state: { zoom, ox, oy } });
      cancel.onclick = () => close(null);
      root.hidden = false;
      apply();
    });
  }
  return { open, cropFromState };
})();

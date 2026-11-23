// Host side (the computer): connects to the relay server so a phone can join by QR code.
// The server is found by itself: the page's own address first, then localhost:3000 / 3001 (so it also works when the page is opened as a file or with Live Server).
// Without any server, the game simply plays without a phone.
const Link = (() => {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const api = { connected: false, room: null, onPeer: () => {}, onMessage: () => {} };
  let ws, closed = false;
  let serverOrigin = location.origin;   // where the relay server is

  function connect() {
    const u = new URL(serverOrigin);
    const proto = u.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${u.host}/?role=host&room=${api.room}`);
    ws.onmessage = e => {
      let m; try { m = JSON.parse(e.data); } catch (err) { return; }
      if (m.type === "peer" && m.role === "phone") { api.connected = m.connected; api.onPeer(m.connected); }
      else api.onMessage(m);
    };
    ws.onclose = () => { api.connected = false; if (!closed) setTimeout(connect, 1500); };
  }

  // Looks for the relay server: this page's own address, then the usual local ports.
  async function findServer() {
    const here = location.protocol === "file:" ? [] : [location.origin];
    for (const o of [...here, "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"]) {
      try {
        const r = await fetch(o + "/api/info");
        if (r.ok) return { origin: o, info: await r.json() };
      } catch (err) { /* not here, try the next one */ }
    }
    return null;
  }

  // Returns { room, url } to show as a QR code, or null when no server is available (solo mode).
  api.start = async () => {
    const found = await findServer();
    if (!found) return null;
    serverOrigin = found.origin;
    const info = found.info;
    let base = serverOrigin;
    // ?base=https://… makes the QR code point to a public address (a tunnel) while the computer stays on localhost.
    const forced = new URLSearchParams(location.search).get("base");
    if (forced && /^https:\/\/[a-z0-9.-]+$/i.test(forced)) base = forced;
    else if (["localhost", "127.0.0.1"].includes(new URL(serverOrigin).hostname)) {
      if (info.publicUrl) base = info.publicUrl;                             // a tunnel is open: phones can come from anywhere
      else if (info.ips.length) base = `http://${info.ips[0]}:${info.port}`;  // otherwise: the same Wi-Fi
    }
    if (!api.room) api.room = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
    closed = false;
    connect();
    return { room: api.room, url: `${base}/phone.html?room=${api.room}` };
  };
  api.send = m => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };
  return api;
})();

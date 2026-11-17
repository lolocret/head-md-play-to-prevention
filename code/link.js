// Host side (the computer): connects to the relay server so a phone can join by QR code.
// Without the server (page opened as a file), the game simply plays without a phone.
const Link = (() => {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const api = { connected: false, room: null, onPeer: () => {}, onMessage: () => {} };
  let ws, closed = false;

  function connect() {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${location.host}/?role=host&room=${api.room}`);
    ws.onmessage = e => {
      let m; try { m = JSON.parse(e.data); } catch (err) { return; }
      if (m.type === "peer" && m.role === "phone") { api.connected = m.connected; api.onPeer(m.connected); }
      else api.onMessage(m);
    };
    ws.onclose = () => { api.connected = false; if (!closed) setTimeout(connect, 1500); };
  }

  // Returns { room, url } to show as a QR code, or null when no server is available (solo mode).
  api.start = async () => {
    if (location.protocol === "file:") return null;
    let base = location.origin;
    // ?base=https://… makes the QR code point to a public address (a tunnel) while the computer stays on localhost.
    const forced = new URLSearchParams(location.search).get("base");
    if (forced && /^https:\/\/[a-z0-9.-]+$/i.test(forced)) {
      api.room = api.room || Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
      closed = false;
      connect();
      return { room: api.room, url: `${forced}/phone.html?room=${api.room}` };
    }
    try {
      const info = await (await fetch("/api/info")).json();
      if (["localhost", "127.0.0.1"].includes(location.hostname) && info.ips.length) base = `http://${info.ips[0]}:${info.port}`;
    } catch (err) { return null; }
    if (!api.room) api.room = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
    closed = false;
    connect();
    return { room: api.room, url: `${base}/phone.html?room=${api.room}` };
  };
  api.send = m => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };
  return api;
})();

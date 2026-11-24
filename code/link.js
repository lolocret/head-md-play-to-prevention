// The bridge between the two pages of the game, through the small server (a 4-letter room code):
//  - the SCREEN (the computer, opened as http://…/): it plays the story and shows the scene.
//  - the REMOTE (the phone, opened from the QR code as http://…/?room=ABCD): it shows Nexus and sends the player's answers.
// Same API on both sides: Link.send(m), Link.onMessage(m), Link.onPeer(connected).
const Link = (() => {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const params = new URLSearchParams(location.search);
  const role = params.get("room") ? "phone" : "host";
  const api = { role, connected: false, room: null, onPeer: () => {}, onMessage: () => {} };
  let ws, origin = location.origin;   // where the server is

  function connect() {
    const u = new URL(origin);
    ws = new WebSocket(`${u.protocol === "https:" ? "wss" : "ws"}://${u.host}/?role=${role}&room=${api.room}`);
    ws.onmessage = e => {
      let m; try { m = JSON.parse(e.data); } catch (err) { return; }
      if (m.type === "peer") { api.connected = m.connected; api.onPeer(m.connected); }
      else if (m.type === "error") { /* no screen yet: we keep trying */ }
      else api.onMessage(m);
    };
    ws.onclose = () => {
      if (api.connected) { api.connected = false; api.onPeer(false); }
      setTimeout(connect, 1500);
    };
  }

  // The server: this page's own address, then the usual local ports (so the screen also works when opened as a file).
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

  // The remote: joins the room of the screen.
  if (role === "phone") {
    api.room = params.get("room").toUpperCase();
    connect();
  }

  // The screen: opens a room. Returns { room, url } to show as a QR code, or null when there is no server.
  api.start = async () => {
    const found = await findServer();
    if (!found) return null;
    origin = found.origin;
    const info = found.info;
    let base = origin;
    // ?base=https://… makes the QR code point to a public address (a tunnel) while the computer stays on localhost.
    const forced = params.get("base");
    if (forced && /^https:\/\/[a-z0-9.-]+$/i.test(forced)) base = forced;
    else if (["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) {
      if (info.publicUrl) base = info.publicUrl;                             // a tunnel is open: the phone can be on any network
      else if (info.ips.length) base = `http://${info.ips[0]}:${info.port}`;  // otherwise: the same Wi-Fi
    }
    let room = null;
    try { room = sessionStorage.getItem("echo-room"); } catch (err) { /* optional */ }   // a reload of the screen keeps the same room
    if (!/^[A-Z0-9]{4}$/.test(room || "")) room = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
    try { sessionStorage.setItem("echo-room", room); } catch (err) { /* optional */ }
    api.room = room;
    connect();
    const lang = params.get("lang") === "en" ? "&lang=en" : "";
    return { room, url: `${base}/?room=${room}${lang}` };
  };

  api.send = m => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };
  return api;
})();

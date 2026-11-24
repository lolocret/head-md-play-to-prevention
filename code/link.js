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
  // Without the small server (e.g. the game published on GitHub Pages) the two pages talk directly (WebRTC), through a free public matchmaking service (PeerJS).
  let mode = null, peer = null, conn = null;   // mode: "ws" | "p2p"
  const PEER_PREFIX = "echo-play-prevention-";

  function connect() {
    if (mode === "p2p") return connectP2P();
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


  // Direct connection (no server). The computer registers "echo-…-ROOM"; the phone connects to it. Both retry if the link drops.
  function peerReady(c) {
    conn = c;
    c.on("open", () => { api.connected = true; api.onPeer(true); });
    c.on("data", m => { if (m && typeof m === "object") api.onMessage(m); });
    c.on("close", () => { if (conn === c) { conn = null; if (api.connected) { api.connected = false; api.onPeer(false); } if (role === "phone") setTimeout(connectP2P, 1500); } });
    c.on("error", () => {});
  }
  function connectP2P() {
    if (typeof Peer === "undefined") return;
    if (role === "phone") {
      if (conn && conn.open) return;
      try { if (peer) peer.destroy(); } catch (err) { /* already gone */ }
      peer = new Peer();
      peer.on("open", () => { const c = peer.connect(PEER_PREFIX + api.room, { serialization: "json", reliable: true }); peerReady(c); });
      peer.on("error", () => setTimeout(connectP2P, 1500));   // the screen is not there yet: keep trying
      peer.on("disconnected", () => { try { peer.reconnect(); } catch (err) { /* will retry */ } });
    } else {
      peer = new Peer(PEER_PREFIX + api.room);
      peer.on("connection", c => { try { if (conn) conn.close(); } catch (err) { /* replaced */ } peerReady(c); });   // one phone per room: the newest replaces the previous
      peer.on("error", e => { if (e && e.type === "unavailable-id") { try { sessionStorage.removeItem("echo-room"); } catch (err) { /* optional */ } location.reload(); } else setTimeout(() => { try { if (peer.disconnected && !peer.destroyed) peer.reconnect(); } catch (err) { /* will retry */ } }, 1500); });
      peer.on("disconnected", () => { try { peer.reconnect(); } catch (err) { /* will retry */ } });
    }
  }

  // The server: this page's own address, then the usual local ports (so the screen also works when opened as a file).
  async function findServer() {
    const here = location.protocol === "file:" ? [] : [location.origin];
    if (location.hostname.endsWith("github.io")) return null;   // a static page: there is no server to find
    const local = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname);   // a public page never probes the visitor's own machine
    for (const o of [...here, ...(local ? ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"] : [])]) {
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
    (location.hostname.endsWith("github.io") ? Promise.reject() : fetch(location.origin + "/api/info").then(r => { if (!r.ok) throw 0; mode = "ws"; })).catch(() => { mode = "p2p"; }).then(connect);
  }

  // The screen: opens a room. Returns { room, url } to show as a QR code, or null when there is no server.
  api.start = async () => {
    const found = await findServer();
    if (!found) {
      if (typeof Peer === "undefined" || location.protocol === "file:") return null;
      mode = "p2p";
      let room = null;
      try { room = sessionStorage.getItem("echo-room"); } catch (err) { /* optional */ }
      if (!/^[A-Z0-9]{4}$/.test(room || "")) room = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
      try { sessionStorage.setItem("echo-room", room); } catch (err) { /* optional */ }
      api.room = room;
      connect();
      const lang = params.get("lang") === "en" ? "&lang=en" : "";
      return { room, url: `${location.origin}${location.pathname.replace(/[^/]*$/, "")}?room=${room}${lang}` };
    }
    mode = "ws";
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

  api.debug = () => ({ mode, peerOpen: !!(peer && peer.open), peerId: peer && peer.id, conn: !!conn, connOpen: !!(conn && conn.open) });
  api.send = m => {
    if (mode === "p2p") { if (conn && conn.open) conn.send(m); }
    else if (ws && ws.readyState === 1) ws.send(JSON.stringify(m));
  };
  return api;
})();

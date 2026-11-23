// Serves the game (../code) and relays messages between a computer ("host") and a phone, by 4-letter room code.
// Run: cd server && npm install && npm start   then open http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { WebSocketServer } = require("ws");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "code");
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".json": "application/json", ".md": "text/plain; charset=utf-8",
};

function lanIPs() {
  return Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address);
}

// The address the phone should use. Set it yourself (PUBLIC_URL=https://...) or let the server open a free Cloudflare tunnel (TUNNEL=1, needs cloudflared).
let publicUrl = process.env.PUBLIC_URL || null;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/info") {
    // The page may be opened as a file or from another local port: let those (and only those) read this.
    const origin = req.headers.origin;
    const headers = { "content-type": "application/json" };
    if (origin === "null" || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "")) headers["access-control-allow-origin"] = origin;
    res.writeHead(200, headers);
    return res.end(JSON.stringify({ port: PORT, ips: lanIPs(), publicUrl }));
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.resolve(ROOT, "." + rel);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });   // always the latest files
    res.end(data);
  });
});

// rooms: code -> { host: ws, phone: ws }
const rooms = new Map();
const wss = new WebSocketServer({ server, maxPayload: 64 * 1024 });
const send = (ws, m) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };

wss.on("connection", (ws, req) => {
  const q = new URL(req.url, "http://localhost").searchParams;
  const role = q.get("role");
  const code = (q.get("room") || "").toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(code) || !["host", "phone"].includes(role)) return ws.close();

  let room = rooms.get(code);
  if (!room) {
    if (role === "phone") { send(ws, { type: "error", reason: "no-room" }); return ws.close(); }
    room = {}; rooms.set(code, room);
  }
  const other = role === "host" ? "phone" : "host";
  if (room[role]) room[role].close();
  room[role] = ws;
  send(room[other], { type: "peer", role, connected: true });
  if (room[other]) send(ws, { type: "peer", role: other, connected: true });

  ws.on("message", data => {
    const peer = room[other];
    if (peer && peer.readyState === 1) peer.send(data.toString());
  });
  ws.on("close", () => {
    if (room[role] !== ws) return;
    delete room[role];
    send(room[other], { type: "peer", role, connected: false });
    if (!room.host && !room.phone) rooms.delete(code);
  });
});

function startTunnel() {
  const t = spawn("cloudflared", ["tunnel", "--url", `http://localhost:${PORT}`], { stdio: ["ignore", "pipe", "pipe"] });
  const look = chunk => {
    const m = String(chunk).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (m && m[0] !== publicUrl) { publicUrl = m[0]; console.log(`\n  Tunnel ready: ${publicUrl}\n  The QR code now points to it (phones on any network can scan it).\n`); }
  };
  t.stdout.on("data", look); t.stderr.on("data", look);
  t.on("error", () => console.log("  cloudflared is not installed: no tunnel. Phones need the same Wi-Fi."));
  process.on("exit", () => t.kill());
  console.log("  Opening a tunnel...");
}

server.listen(PORT, () => {
  console.log(`Echo server on http://localhost:${PORT}`);
  lanIPs().forEach(ip => console.log(`  phones on the same Wi-Fi can reach http://${ip}:${PORT}`));
  if (process.env.TUNNEL) startTunnel();
});

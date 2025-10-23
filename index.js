import https from "https";
import express from "express";
import { PING_URLS, MIN_MINUTES, MAX_MINUTES, USER_AGENT } from "./config.js";

const app = express();

// Health endpoint — Render bu ile port açık olduğunu kontrol eder
app.get("/", (req, res) => {
  res.send("OK");
});

// Opsiyonel health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Render PORT env kullan
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server dinleniyor: http://localhost:${PORT} | Render PORT: ${process.env.PORT ? 'var' : 'yok'}`);
});

/* ---------- Ping Döngüsü ---------- */
function getRandomInterval() {
  const minutes = Math.floor(Math.random() * (MAX_MINUTES - MIN_MINUTES + 1)) + MIN_MINUTES;
  return minutes * 60 * 1000;
}

function pingSite(url) {
  https.get(url, {
    headers: { 'User-Agent': USER_AGENT }
  }, (res) => {
    console.log(`[${new Date().toISOString()}] Ping atıldı: ${url} -> Durum: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Ping hatası: ${url} -> ${err.message}`);
  });
}

function startPingCycle() {
  PING_URLS.forEach((url) => {
    const loop = () => {
      pingSite(url);
      setTimeout(loop, getRandomInterval());
    };
    loop();
  });
}

console.log("Ping servisi başlatılıyor...");
startPingCycle();

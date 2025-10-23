// index.js
import https from "https";
import { PING_URLS, MIN_MINUTES, MAX_MINUTES, USER_AGENT } from "./config.js";

// Rastgele 1–5 dakika arası süre döndürür (ms cinsinden)
function getRandomInterval() {
  const minutes = Math.floor(Math.random() * (MAX_MINUTES - MIN_MINUTES + 1)) + MIN_MINUTES;
  return minutes * 60 * 1000;
}

// Ping fonksiyonu
function pingSite(url) {
  https.get(url, {
    headers: {
      'User-Agent': USER_AGENT
    }
  }, (res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Ping atıldı: ${url} | Durum: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleTimeString()}] Ping hatası: ${url} | Hata: ${err.message}`);
  });
}

// Ping döngüsü
function startPingCycle() {
  PING_URLS.forEach((url) => {
    const loop = () => {
      pingSite(url);

      // Sonraki ping için rastgele aralık
      setTimeout(loop, getRandomInterval());
    };
    loop();
  });
}

console.log("Ping servisi başlatılıyor...");
startPingCycle();

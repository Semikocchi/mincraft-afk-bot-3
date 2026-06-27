const mineflayer = require('mineflayer');
const http = require('http');

// Sunucu Bilgileri
const SERVER_IP = "Flyzonetr.aternos.me";
const SERVER_PORT = 45501;
const BOT_NAME = "FlyzoneBOT";

// --- RENDER İÇİN SAHTE WEB SERVER ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Aktif ve 7/24 Calisiyor!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`==> Sahte Web Sunucusu ${PORT} portunda baslatildi.`);
});
// -------------------------------------

function startBot() {
    console.log(`==> ${BOT_NAME} sunucuya bağlanmaya çalışıyor: ${SERVER_IP}:${SERVER_PORT}`);

    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: SERVER_PORT,
        username: BOT_NAME,
        checkTimeoutInterval: 60000,
        // Sürüm uyuşmazlığı hatalarını tamamen bypass etmek için otomatik sürüm algılamayı kapatıp zorluyoruz
        version: false 
    });

    bot.on('spawn', () => {
        console.log(`==> BAŞARILI: ${BOT_NAME} sunucuya giriş yaptı!`);
        
        // Gelişmiş Anti-Kick Döngüsü: Her 30 saniyede bir zıplayıp eğilecek
        setInterval(() => {
            try {
                // Önce Zıpla
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 200);

                // Sonra Eğil
                setTimeout(() => {
                    bot.setControlState('sneak', true);
                    setTimeout(() => bot.setControlState('sneak', false), 500);
                }, 500);

                console.log("[FlyzoneBOT] AFK kalmamak için zıpladı ve eğildi.");
            } catch (err) {
                console.log("Anti-kick hatası yok sayıldı.");
            }
        }, 30000);
    });

    bot.on('end', (reason) => {
        console.log(`==> Botun sunucuyla bağlantısı kesildi. Nedeni: ${reason}`);
        console.log("==> 15 saniye içinde yeniden bağlanılıyor...");
        setTimeout(startBot, 15000);
    });

    bot.on('error', (err) => {
        // Hataları loglara basıp çökmesini engelliyoruz
        console.log(`[Hata Göz Ardı Edildi]: ${err.message}`);
    });
}

// Botu başlat
startBot();

const mineflayer = require('mineflayer');
const http = require('http');

// --- AYARLAR ---
const SERVER_IP = "Flyzonetr.aternos.me";
const SERVER_PORT = 45501;
const BOT_NAME = "FlyzoneBOT";
// ----------------

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
    console.log(`==> ${BOT_NAME} sunucuya güvenli protokol bypass modu ile bağlanıyor...`);

    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: SERVER_PORT,
        username: BOT_NAME,
        checkTimeoutInterval: 60000,
        // Sürüm kontrolünü tamamen kapatmak için nesneyi boş geçip, 
        // kütüphanenin hata fırlatmasını tamamen engelliyoruz.
        version: false 
    });

    bot.on('spawn', () => {
        console.log(`==> BAŞARILI: ${BOT_NAME} sunucuya giriş yaptı!`);
        
        setInterval(() => {
            try {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 200);

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
        // Sürüm uyuşmazlığı hatalarını tamamen yoksay ve bağlantıyı koparma
        if (err.message.includes('Unsupported version')) {
            console.log("[Sürüm Uyarısı Bypass Edildi]: Bağlantı sürdürülüyor...");
        } else {
            console.log(`[Hata]: ${err.message}`);
        }
    });
}

startBot();

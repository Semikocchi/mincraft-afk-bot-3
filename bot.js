const mineflayer = require('mineflayer');
const http = require('http');

// --- AYARLAR ---
const SERVER_IP = "Flyzonetr.aternos.me";
const SERVER_PORT = 45501;
const BOT_NAME = "FlyzoneBOT";
// İstediğin gibi sürümü 26.1.2 olarak ayarladım
const MINECRAFT_VERSION = "26.1.2"; 
// ---------------

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
    console.log(`==> ${BOT_NAME} sunucuya bağlanmaya çalışıyor: ${SERVER_IP}:${SERVER_PORT} (Sürüm: ${MINECRAFT_VERSION})`);

    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: SERVER_PORT,
        username: BOT_NAME,
        version: MINECRAFT_VERSION,
        checkTimeoutInterval: 60000
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
        console.log(`==> Botun sunucuyla bağlantısı kesildi. Nedeni: {reason}`);
        console.log("==> 15 saniye içinde yeniden bağlanılıyor...");
        setTimeout(startBot, 15000);
    });

    bot.on('error', (err) => {
        console.log(`[Hata]: ${err.message}`);
    });
}

startBot();

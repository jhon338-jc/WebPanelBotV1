let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Pergi ke pasar beli kerupuk\nKentang rebus pakai lada\nKalau kamu mau curhat\nBotku siap mendengarkan 🐱","Jalan-jalan ke Kota Tua\nJangan lupa beli asinan\nKalau mau tertawa\nRapat deh sama teman curhatan 😄","Naik delman ke pasar malam\nPulangnya bawa kue lapis\nJangan sedih jangan merem\nNanti subuh-kan tetap manis 🍬"]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*PANTUN*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['pantun']
export default handler

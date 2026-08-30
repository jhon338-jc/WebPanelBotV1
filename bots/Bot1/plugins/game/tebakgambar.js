let handler = async (m, { conn, text, args }) => {
try {
    const a = [['📱💬','WhatsApp'],['🐱🐟','Kucing makan ikan'],['☀️🏖️','Pantai'],['👻📱','HP hantu']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply('🖼️ *TEBAK GAMBAR*\n\n' + q[0] + '\n\nJawaban: *' + q[1] + '*')

} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebakgambar', 'tebakemoji']
export default handler

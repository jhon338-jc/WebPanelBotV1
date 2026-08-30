let handler = async (m, { conn, text, args }) => {
try {
    const a = ['Ya!','Tidak.','Mungkin saja.','Tentu saja, coba lagi!','Jangan dulu.','Iya, tapi jangan kaget.']
m.reply('🔮 *KOTAK AJAIB*\n\n' + a[Math.floor(Math.random() * a.length)])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kotakajaib', 'm8ball']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Kalau kamu sinar matahari, aku mau jadi yang paling lama terbakar. ☀️","Kamu itu kayak wifi, bikin aku selalu konek. 📶","Aku gamon gara-gara kamu. 💘"]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*GOMBALAN*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['gombalan']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Jangan menunggu sempurna untuk mulai. Mulai saja, lalu jadikan sempurna.","Rejeki itu dijemput, bukan dicari. Tetap semangat! 💪","Orang sukses bukan yang tidak pernah gagal, tapi yang tidak pernah berhenti mencoba."]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*QUOTE*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['quote']
export default handler

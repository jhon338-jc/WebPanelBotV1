let handler = async (m, { conn, text, args }) => {
try {
    const a = ['semangat','sukses','bahagia','berkah','hebat','kuat','rejeki','berani']
m.reply('📖 *Kata hari ini*: *' + a[Math.floor(Math.random()*a.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['randomkata', 'kataacak']
export default handler

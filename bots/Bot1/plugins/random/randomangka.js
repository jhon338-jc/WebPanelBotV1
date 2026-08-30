let handler = async (m, { conn, text, args }) => {
try {
    m.reply('🔢 *Angka acak*: ' + Math.floor(Math.random() * 1001))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['randomangka', 'angkaacak']
export default handler

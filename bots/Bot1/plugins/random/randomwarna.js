let handler = async (m, { conn, text, args }) => {
try {
    const c = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase()
m.reply('🎨 *Warna acak*: ' + c) 
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['randomwarna', 'warnaacak']
export default handler

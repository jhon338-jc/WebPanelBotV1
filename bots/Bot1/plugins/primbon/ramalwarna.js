let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Merah','penuh semangat & berani bertindak'],['Ungu','misterius, spiritual, kreatif'],['Biru','tenang, jujur, terpercaya'],['Hijau','seimbang & penuh empati'],['Kuning','optimis, ceria, cerdas'],['Hitam','tegas, elegan, misterius']]
const q = a[Math.floor(Math.random()*a.length)]
m.reply('🎨 *WARNA FAVORITMU*\n\n' + q[0] + ' artinya kamu ' + q[1])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramalwarna']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const d = [["Doa Sebelum Makan","Allahumma barik lana fima razaqtana wa qina adzaban-nar."],["Doa Sesudah Makan","Alhamdulillahilladzi at-amana wa saqana wa ja-alana muslimin."],["Doa Masuk Rumah","Allahumma inni as-aluka khayral-mawlaji wa khayral-makhraji."],["Doa Keluar Rumah","Bismillah tawakkaltu alallah la haula wala quwwata illa billah."],["Doa Belajar","Allahumma infa-ni bima allamtani wa allimni ma yanfa-uni."],["Doa Kedua Orangtua","Rabbirhamhuma kama rabbayani shaghira."]][Math.floor(Math.random()*6)]
    m.reply(['📿 *DAFTAR DOA*', '', '📕 *' + d[0] + '*', '"' + d[1] + '"', '', 'Ketik .doa untuk doa acak lainnya'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['doa', 'kumpulandoa']
export default handler

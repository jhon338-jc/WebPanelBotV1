let handler = async (m, { conn, text, args }) => {
try {
    const daftar = [['Apa ibu kota Indonesia?','Jakarta'],['1+1 = ?','2'],['Planet terdekat matahari?','Merkurius'],['Warna bendera Indonesia?','Merah Putih'],['Berapa kaki kucing?','4']]
const q = daftar[Math.floor(Math.random() * daftar.length)]
m.reply(['❓ *KUIS*', '', q[0], '', 'Jawaban: *' + q[1] + '*'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kuis', 'k']
export default handler

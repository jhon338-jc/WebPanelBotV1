let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Kata? Contodoh: .sinonim pintar')
const m1 = { pintar: 'cerdas, pandai, cerdik', kaya: 'makmur, hartawan', marah: 'geram, kesal', senang: 'gembira, bahagia', cepat: 'gesit, cepat-cepat' }
m.reply('📘 *SINONIM*\n\n' + text + ' = ' + (m1[text.toLowerCase()] || 'belum diketahui, coba kata lain'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['sinonim', 'persamaan']
export default handler

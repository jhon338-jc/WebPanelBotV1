let handler = async (m, { conn, text, args }) => {
try {
    
    const k = (text || '').toLowerCase()
    const map = { air: 'kemakmuran & ketenangan hati', jatuh: 'rasa khawatir / kehilangan kendali', gigi: 'perubahan besar, keluarga atau karir', rumah: 'kondisi batin kamu', uang: 'energi positif & rezeki mengalir', terbang: 'ambisi tinggi & kebebasan', mati: 'akhir dari satu fase, bukan kematian fisik', ular: 'kebijaksanaan atau tantangan tersembunyi' }
    if (!k) return m.reply('Tulis kata kunci mimpi, contoh: .artimimpi air')
    const kata = Object.keys(map).find(x => k.includes(x))
    m.reply('🌙 *TAFSIR MIMPI*\n\n' + (kata ? 'Mimpi tentang *' + kata + '* artinya ' + map[kata] : 'Kamu bisa pakai kata: air, jatuh, gigi, rumah, uang, terbang, ular, mati'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['artimimpi', 'tafsirmimpi']
export default handler

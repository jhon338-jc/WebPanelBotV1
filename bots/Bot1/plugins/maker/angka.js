let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .angka 2026')
    const map = { 0: 'nol', 1: 'satu', 2: 'dua', 3: 'tiga', 4: 'empat', 5: 'lima', 6: 'enam', 7: 'tujuh', 8: 'delapan', 9: 'sembilan' }
    const s = ('' + text).split('')
    m.reply('🔢 *' + text + '*\n\n' + s.map(d => map[d] || d).join(' '))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['angkake', 'kataangka']
export default handler

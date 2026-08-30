let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .kalkulator 8 * 7')
    const expr = text.replace(/x/gi, '*').replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.')
    if (!/^[0-9+*/.() -]+$/.test(expr)) return m.reply('⚠️ Hanya angka & operator +,-,*,/')
    const hasil = Function('return (' + expr + ')')()
    m.reply('🧮 ' + expr + ' = *' + hasil + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kalkulator', 'calc']
export default handler

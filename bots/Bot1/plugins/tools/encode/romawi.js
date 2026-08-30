let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .romawi 2026')
    const n = parseInt(text)
    if (isNaN(n) || n < 1 || n > 3999) return m.reply('Angka 1-3999!')
    const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
    let s = '', x = n
    for (const [v, r] of map) { while (x >= v) { s += r; x -= v } }
    m.reply('🏛️ *ROMawi*\n\n' + n + ' = *' + s + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['romawi', 'roman']
export default handler

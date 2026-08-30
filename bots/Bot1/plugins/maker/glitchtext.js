let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .glitch Jhon')
    const g = '▓░▒█|/\\<>_'
    let out = ''
    for (const c of text) out += c + (Math.random() < 0.4 ? g[Math.floor(Math.random() * g.length)] : '')
    m.reply('👾 *Glitch*\n' + out)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['glitchtext', 'glitch']
export default handler

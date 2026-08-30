let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Contoh: .terjemah hello world\n(otomatis) atau .terjemah id Hello')
    const { translate } = await import('../../lib/apis.js')
    let hasil
    if (args[0] === 'id') hasil = await translate(text.split(' ').slice(1).join(' '), 'id')
    else hasil = await translate(text, 'en')
    m.reply('🌐 *Terjemahan*\n\n' + hasil)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['terjemah', 'translate']
export default handler

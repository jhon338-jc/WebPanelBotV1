let handler = async (m, { conn, text, args }) => {
try {
    let u = '', g = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map(b => b.toString(16).padStart(2,'0')).join('')
m.reply('🆔 UUID: *' + g(9) + '-' + g(4) + '-' + g(4) + '-' + g(4) + '-' + g(12) + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['uuid', 'genid']
export default handler

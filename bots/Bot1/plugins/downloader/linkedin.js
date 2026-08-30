let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan URL LinkedIn video!')
    m.reply('💼 LinkedIn: ' + text)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['linkedin', 'linkedinvideo']
export default handler

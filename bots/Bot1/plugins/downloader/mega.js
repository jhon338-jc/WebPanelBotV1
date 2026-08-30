let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan link MEGA!')
    m.reply('📁 MEGA: ' + text + '\n\nFile besar, pastikan RAM cukup.')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['mega', 'megaload']
export default handler

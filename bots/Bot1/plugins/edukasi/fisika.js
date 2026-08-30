let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['⚡ *FISIKA DASAR*', '', 'Kecepatan: v = s/t', 'Gaya: F = m × a', 'Hukum Newton II, momentum: p = m × v', 'Energi kinetik: Ek = ½mv²'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['fisika']
export default handler

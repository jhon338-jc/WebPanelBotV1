let handler = async (m, { conn, text, args }) => {
try {
    m.reply('🌀 *HANGMAN*\n\nMulai baru: .hangman start\nTebak huruf: .hangman a\n\n(Beta - mode lokal)')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['hangman', 'gantungan']
export default handler

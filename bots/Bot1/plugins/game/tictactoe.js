let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['⚔️ *TIC TAC TOE*', '', 'Ketik: .ttt posisi (1-9)', '1 2 3', '4 5 6', '7 8 9'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tictactoe', 'ttt']
export default handler

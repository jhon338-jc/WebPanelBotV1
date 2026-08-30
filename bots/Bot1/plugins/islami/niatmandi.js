let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🚿 *NIAT MANDI WAJIB*', '', 'Nawaitul ghusla liraf-il hadatsil akbari fardhal lillaahi ta-aala.', '', 'Artinya: Aku niat mandi besar untuk menghilangkan hadats besar, fardhu karena Allah Taala.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['niatmandi', 'niatmandijunub']
export default handler

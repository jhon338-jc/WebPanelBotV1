let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['💧 *NIAT WUDHU*', '', 'Nawaitul wudhuu-a liraf-il hadatsil asghari fardhal lillaahi ta-aala.', '', 'Artinya: Aku niat berwudhu untuk menghilangkan hadats kecil, fardhu karena Allah Taala.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['niatwudhu']
export default handler

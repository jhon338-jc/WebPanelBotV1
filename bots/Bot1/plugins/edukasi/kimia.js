let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🧪 *KIMIA*', '', 'H2O = Air', 'NaCl = Garam', 'CO2 = Karbon dioksida', 'O2 = Oksigen', 'H2SO4 = Asam sulfat'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['kimia']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🌙 *ISTIGHFAR*', '', 'Astaghfirullahal Adziim alladzi laa ilaaha illa huwal hayyul qayyuum wa atuubu ilaih', '', '(diulang 3x)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['istighfar']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Proklamasi','17 Agustus 1945'],['Sumpah Pemuda','28 Oktober 1928'],['Hari Kemerdekaan','17 Agustus'],['G30S PKI','30 September 1965']]
const q = a[Math.floor(Math.random()*a.length)]
m.reply('🏛️ *SEJARAH*\n\n' + q[0] + ' = *' + q[1] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['sejarah']
export default handler

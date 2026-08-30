let handler = async (m, { conn, text, args }) => {
try {
    const a = [['"Cinta yang tulus hanya untukmu"', 'Lagu cinta Indonesia'],['"Aku tak ingin kau pergi meninggalkan aku"', 'Balada galau'],['"Senyummu, canda tawamu, mengisi hariku"', 'Lagu romantis']]
const q = a[Math.floor(Math.random() * a.length)]
m.reply(['🎵 *TEBAK LIRIK*', '', q[0], '', 'Judulnya apa? (Hint: ' + q[1] + ')'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['tebaklirik']
export default handler

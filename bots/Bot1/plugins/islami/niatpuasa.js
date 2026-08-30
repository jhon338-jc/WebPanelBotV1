let handler = async (m, { conn, text, args }) => {
try {
    
    m.reply(['🌙 *NIAT PUASA RAMADHAN*', '', 'Nawaitu shauma ghadin an adaa-i fardhi syahri ramadhaana haadzihis-sanati lillaahi ta-aala.', '', 'Artinya: Aku berniat puasa esok hari untuk menjalankan fardhu bulan Ramadhan tahun ini karena Allah Taala.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['niatpuasa', 'niatramadhan']
export default handler

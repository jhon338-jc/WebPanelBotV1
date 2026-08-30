let handler = async (m, { conn, text, args }) => {
try {
    const juta = Math.floor(Math.random() * 900) + 1
m.reply(['💸 *RAMAL RIZKI*', '', 'Potensi rezeki kamu bulan ini: *Rp' + juta.toLocaleString('id-ID') + ' juta*', '', 'Yakin & jangan lupa sedekah ya!'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekharta', 'cekrezeki']
export default handler

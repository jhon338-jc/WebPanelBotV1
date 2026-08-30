let handler = async (m, { conn, text, args }) => {
try {
    m.reply(['🧭 *KIBLAT*', '', 'Arah kiblat dari Indonesia: *295° (barat laut)*', '', 'Gunakan Qibla finder atau kompas HP untuk akurasi maksimal.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekkiblat', 'kiblat']
export default handler

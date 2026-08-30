let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Judul lagu? Contoh: .chord Ku Tak Bahagia')
    const up = s => s.split(' ').map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : w).join(' ')
    m.reply(['🎸 *CHORD: ' + up(text) + '*', '', 'C  G  Am  F', 'Intro: C G Am F', 'Reff: C  G  Am  F  C  G', '', '(Gunakan aplikasi chord untuk versi lengkap)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['chord', 'kunci']
export default handler

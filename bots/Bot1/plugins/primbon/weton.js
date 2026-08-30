let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Format tanggal lahir: .weton 20 8 2005')
    const ts = text.split(/\\s+/).map(Number)
    if (ts.length !== 3 || ts.some(isNaN)) return m.reply('Format: .weton dd mm yyyy')
    const d = new Date(ts[2], ts[1] - 1, ts[0])
    if (isNaN(d.getTime())) return m.reply('Tanggal tidak valid!')
    const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()]
    const pasaran = ['Legi','Pahing','Pon','Wage','Kliwon'][((Math.floor(d.getTime() / 86400000) % 5) + 5) % 5]
    m.reply(['🗓️ *WETON*', '', 'Tanggal lahir: ' + d.toLocaleDateString('id-ID'), 'Weton: *' + hari + ' ' + pasaran + '*', '', 'Besok-besok mulai rumus pasarannya ya 😄'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['weton']
export default handler

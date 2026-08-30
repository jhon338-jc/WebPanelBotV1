let handler = async (m, { conn, text, args }) => {
try {
    
    const { fetchJson } = await import('../../lib/apis.js')
    const j = await fetchJson('https://ipwho.is/')
    if (!j.success) return m.reply('❌ Gagal ambil info IP.')
    m.reply(['🌐 *INFO IP*', '', 'IP: ' + j.ip, 'Lokasi: ' + (j.city || '-') + ', ' + (j.country || '-'), 'Zona: ' + (j.timezone?.id || '-'), 'ISP: ' + (j.connection?.isp || '-'), '', '🇮🇩 Untuk IP publik channel ini.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekip', 'myip', 'ipkita']
export default handler

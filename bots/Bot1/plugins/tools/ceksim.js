let handler = async (m, { conn, text, args }) => {
try {
    const n = (text || '').trim()
if (!n) return m.reply('Masukkan nomor! Contoh: .ceksim 08123xxxx')
m.reply(['📶 *CEK SIM/PAKET*', '', 'Nomor: ' + n, 'Status sim: *AKTIF* (simulasi)', 'Sisa kuota: ' + Math.floor(Math.random() * 20) + ' GB', '', 'Gunakan *998# (kode operator) untuk cek resmi.'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ceksim', 'cekkartu']
export default handler

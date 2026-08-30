let handler = async (m, { conn, text, args }) => {
try {
    
    const n = (text || '').replace(/\\D/g, '')
    if (n.length < 9) return m.reply('Masukkan nomor!\nContoh: .ceknohp 0812xxxx')
    const aw = n.slice(0, 4)
    let provider = 'Provider umum'
    const m1 = ['0811','0812','0813','0821','0822','0823','0851','0852','0853']
    const m2 = ['0831','0832','0833','0893','0896','0897','0898','0899']
    if (m1.includes(aw)) provider = 'Telkomsel (Simpati/Loop)'
    else if (m2.includes(aw)) provider = 'Telkomsel (By.U)'
    else if (['0855','0856','0857','0858'].includes(aw)) provider = 'Indosat (IM3)'
    else if (['0814','0815','0816','0855','0856','0857','0858'].includes(aw)) provider = 'Indosat'
    else if (['0817','0818','0819','0859'].includes(aw)) provider = 'XL / Axis'
    else if (['0895','0898'].includes(aw)) provider = 'Three (3)'
    else if (['0857','0858'].includes(aw)) provider = 'Indosat'
    m.reply('📱 *CEK NOMOR*\n\nNomor: ' + n + '\nProvider: *' + provider + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ceknohp', 'ceknomor']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const z = [['Capricorn','01-20','02-18'],['Aquarius','01-21','02-18'],['Pisces','02-19','03-20'],['Aries','03-21','04-19'],['Taurus','04-20','05-20'],['Gemini','05-21','06-20'],['Cancer','06-21','07-22'],['Leo','07-23','08-22'],['Virgo','08-23','09-22'],['Libra','09-23','10-22'],['Scorpio','10-23','11-21'],['Sagittarius','11-22','12-21'],['Capricorn','12-22','12-31']]
    const sifat = { Aries: 'Pemberani, energik', Taurus: 'Sabarr, setia', Gemini: 'Komunikatif, cerdas', Cancer: 'Peka, penyayang', Leo: 'Percaya diri, karismatik', Virgo: 'Teliti, perfeksionis', Libra: 'Rapi, adil', Scorpio: 'Misterius, setia', Sagittarius: 'Optimis, bebas', Capricorn: 'Disiplin, ambisius', Aquarius: 'Cerdas, unik', Pisces: 'Imaginatif, empatik' }
    const today = new Date()
    const mm = today.getMonth() + 1, dd = today.getDate()
    const cari = z.filter(x => { const [a, b] = /^(\\d+)-(\\d+)$/.exec(x[1]).slice(1, 3).map(Number); const [c, d] = /^(\\d+)-(\\d+)$/.exec(x[2]).slice(1, 3).map(Number); return (mm * 100 + dd) >= (a * 100 + b) && (mm * 100 + dd) <= (c * 100 + d) })
    const nama = cari[0] ? cari[0][0] : 'Capricorn'
    m.reply(['♈ *ZODIAK KAMU*', '', 'Zodiak: *' + nama + '*', 'Sifat: ' + (sifat[nama] || '-'), '', 'Tanggal lahir diurutkan normal ya 😉'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekzodiak', 'zodiak']
export default handler

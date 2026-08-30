let handler = async (m, { conn, text, args }) => {
try {
    const a = ['Programmer','Wiraswasta','Designer','Guru','Pebisnis','Chef','Atlet','Politikus']
const b = ['tahun ini membuat terobosan','butuh fokus 3 bulan ke depan','peluang besar di bidang teknologi','sukses setelah ganti lingkungan']
m.reply('💼 *RAMAL KARIR*\n\nKecocokan: *' + a[Math.floor(Math.random()*a.length)] + '*\nCatatan: ' + b[Math.floor(Math.random()*b.length)])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ramalkarir']
export default handler

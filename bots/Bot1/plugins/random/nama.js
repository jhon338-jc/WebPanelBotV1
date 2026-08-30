let handler = async (m, { conn, text, args }) => {
try {
    const d = ['Andi','Budi','Cici','Dedi','Eka','Fajar','Gilang','Hana','Intan','Johan','Kirana','Lina']
const b = ['Saputra','Pratama','Ramadhan','Puspita','Lestari','Hidayat','Wijaya']
m.reply('👤 Nama ide: *' + d[Math.floor(Math.random()*d.length)] + ' ' + b[Math.floor(Math.random()*b.length)] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['nama', 'randomnama']
export default handler

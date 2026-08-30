let handler = async (m, { conn, text, args }) => {
try {
    const a = [['Jangan copas, pahami', 'Baca kode orang'],['Naming yang jelas', 'var harga, bukan h'],['Jarang berkomentar', 'Commit yang baik'],['Debug pakai console', 'Mulai kecil lalu naik']]
const q = a[Math.floor(Math.random()*a.length)]
m.reply('💻 *TIP CODING*\n\n' + q[0] + ': ' + q[1])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['coding', 'tipsprograming']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Kenapa matematika sedih? Karena punya banyak masalah. 🤓","Aku jualan kendaraan, tiap buyer datang, ehh malah pergi. 🚗","Tidur itu obat, makanya banyak orang ketiduran pas ulangan. 💤"]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*LELUCON*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['lelucon', 'jokes']
export default handler

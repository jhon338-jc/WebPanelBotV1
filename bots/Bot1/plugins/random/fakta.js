let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Gurita punya 9 otak: 1 di kepala, 8 di tentakel.","Madu tidak pernah basi, arkeolog menemukan madu 3000 tahun masih enak.","Bebek selalu berjalan dalam formasi. 🦆"]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*FAKTA UNIK*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['fakta', 'fact']
export default handler

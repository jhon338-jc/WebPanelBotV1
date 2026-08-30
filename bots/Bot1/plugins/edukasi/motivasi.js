let handler = async (m, { conn, text, args }) => {
try {
    const a = ['Mimpi besar dimulai dari langkah kecil.','Gagal bukan akhir, tapi bahan bakar.','Fokus pada progres, bukan kesempurnaan.','Konsistensi > bakat.','Jadilah versi terbaik besok dari hari ini.']
m.reply('🔥 *MOTIVASI*\n\n' + a[Math.floor(Math.random()*a.length)])
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['motivasi']
export default handler

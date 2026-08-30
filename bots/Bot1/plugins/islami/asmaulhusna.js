let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Ar-Rahman : Yang Maha Pengasih","Ar-Rahim : Yang Maha Penyayang","Al-Malik : Yang Maha Merajai","Al-Quddus : Yang Maha Suci","As-Salam : Yang Maha Sejahtera","Al-Mu'min : Yang Maha Memberi Keamanan","Al-Muhaymin : Yang Maha Memelihara","Al-Aziz : Yang Maha Perkasa","Al-Jabbar : Yang Maha Kuasa","Al-Mutakabbir : Yang Maha Megah"]
    m.reply(['✨ *ASMAUL HUSNA*', '', a[Math.floor(Math.random()*a.length)]].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['asmaulhusna', 'asmal']
export default handler

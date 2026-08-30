let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Subhanallah (33x)","Alhamdulillah (33x)","Allahu Akbar (33x)","Laa ilaaha illallah","Astaghfirullahal adzim","La haula wala quwwata illa billah"]
    m.reply(['📿 *DZIKIR*', '', a[Math.floor(Math.random()*a.length)]].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['dzikir', 'wirid']
export default handler

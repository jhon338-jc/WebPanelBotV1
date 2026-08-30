let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Allahumma sholli ala sayyidina Muhammad (10x)","Shollallahu ala Muhammad (10x)","Ya rabbi sholli ala Muhammad"]
    m.reply(['🕌 *SHOLAWAT*', '', a[Math.floor(Math.random()*a.length)]].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['sholawat', 'sholawatan']
export default handler

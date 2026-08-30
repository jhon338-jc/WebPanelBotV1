let handler = async (m, { conn, text, args }) => {
try {
    
    const surat = [['Al-Fatihah', 'Segala puji bagi Allah, Tuhan semesta alam'], ['Al-Ikhlas', 'Qul huwallahu ahad, Allahus shamad'], ['Al-Falaq', 'Qul a-udzu birabbil falaq min syarri ma khalaq'], ['An-Nas', 'Qul a-udzu birabbinnas malikin nas']]
    const p = surat[Math.floor(Math.random()*surat.length)]
    m.reply(['📖 *SURAT ' + p[0] + '*', '', '"' + p[1] + '..."'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['suratpendek', 'suratpilihan']
export default handler

let handler = async (m, { conn, text, args }) => {
try {
    
    const a = ["Hidup seperti naik sepeda: biar seimbang, kamu harus terus melaju.","Berhenti membuktikan diri ke orang yang tak pernah mau percaya.","Kesabaran itu pahit, tapi buahnya manis."]
    const t = a[Math.floor(Math.random() * a.length)]
    m.reply('*KATA BIJAK*\n\n' + t)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['katabijak']
export default handler

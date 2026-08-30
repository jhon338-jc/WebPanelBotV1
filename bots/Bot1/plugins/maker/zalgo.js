let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .zalgo Jhon')
const z = '̷̸̀᷃͆᷄᷈'
const zl = [...z]
let out = '' ; let n = 0
for (const c of text) { out += c ; n = 1 + Math.floor(Math.random() * 3) ; for (let i = 0; i < n; i++) out += zl[Math.floor(Math.random() * zl.length)] }
m.reply('👁️ ' + out + ' 👁️')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['zalgo']
export default handler

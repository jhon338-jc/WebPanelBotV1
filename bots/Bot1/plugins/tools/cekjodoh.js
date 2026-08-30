let handler = async (m, { conn, text, args }) => {
try {
    
    if (args.length < 2) return m.reply('Contoh: .cekjodoh Andi Sari')
    const p = Math.floor(Math.random() * 101)
    const emo = p > 80 ? '💘' : p > 50 ? '💕' : '💔'
    m.reply(['💞 *CEK JODOH*', '', args[0] + ' & ' + args[1], 'Kecocokan: *' + p + '%* ' + emo, '', 'Hubungannya ' + (p > 80 ? 'sangat mendukung! 🎉' : 'perlu usaha ekstra 😌')].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekjodoh', 'ramaljodoh']
export default handler

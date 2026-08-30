let handler = async (m, { conn, text, args }) => {
try {
    const p = (text || '').toLowerCase()
if (!['batu', 'gunting', 'kertas'].includes(p)) return m.reply('Pilih: .rps batu | .rps gunting | .rps kertas')
const bot = ['batu','gunting','kertas'][Math.floor(Math.random() * 3)]
const beat = { batu: 'gunting', gunting: 'kertas', kertas: 'batu' }
let res
if (p === bot) res = '🤝 Seri!'
else if (beat[p] === bot) res = '🏆 Kamu menang!'
else res = '🤖 Bot menang!'
m.reply('✊✌️✋ *SUIT*\n\nKamu: *' + p + '*\nBot: *' + bot + '*\n\n' + res)
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['rps', 'suit']
export default handler

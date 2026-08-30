let handler = async (m, { conn, text, args }) => {
try {
    const s = () => { const ops = ['🍒','🍋','🔔','⭐','7️⃣','💎']; return ops[Math.floor(Math.random() * ops.length)] }
const a = s(), b = s(), c = s()
const win = a === b && b === c
m.reply('🎰 *SLOT MACHINE*\n\n[' + a + '] [' + b + '] [' + c + ']\n\n' + (win ? '🎉 *JACKPOT!* 🎉' : 'Coba lagi! 😆'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['slot', 'slots']
export default handler

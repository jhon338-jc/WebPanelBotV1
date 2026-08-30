let handler = async (m, { conn, text, args }) => {
try {
    if (!text) return m.reply('Contoh: .emojitext Jhon')
const m1 = { a:'🅰',b:'🅱',c:'©',d:'🅳',e:'📧',f:'🎏',g:'🌀',h:'♓',i:'ℹ',j:'🤙',k:'🎋',l:'👢',m:'Ⓜ',n:'♑',o:'Ⓞ',p:'🅿',q:'🚯',r:'☢',s:'Ⓢ',t:'🌴',u:'Ⓤ',v:'🆅',w:'〽',x:'❌',y:'✦',z:'🆉' }
m.reply('✨ ' + [...text.toLowerCase()].map(c => m1[c] || c).join(''))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['emojitex', 'emojitext']
export default handler

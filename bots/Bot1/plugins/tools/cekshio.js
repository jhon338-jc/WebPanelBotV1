let handler = async (m, { conn, text, args }) => {
try {
    
    const y = parseInt((text || String(new Date().getFullYear())).trim()) || new Date().getFullYear()
    const shio = ['Tikus','Kerbau','Macan','Kelinci','Naga','Ular','Kuda','Kambing','Monyet','Ayam','Anjing','Babi']
    m.reply('🐅 *SHIO*\n\nTahun ' + y + ' = Shio *' + shio[((y - 4) % 12 + 12) % 12] + '*')
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekshio', 'shio']
export default handler

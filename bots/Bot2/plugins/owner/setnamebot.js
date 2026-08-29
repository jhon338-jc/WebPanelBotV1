let handler = async (m, { conn, text }) => {
    if (!m.isOwner) return m.reply('❌ Khusus Owner!')
    if (!text) return m.reply('⚠️ Masukkan nama!\n\nContoh: .setnamebot Nama Baru')

    try {
        await conn.updateProfileName(text)
        m.reply(`✅ Nama bot diubah menjadi: *${text}*`)
    } catch (e) {
        console.error(e)
        m.reply('❌ Gagal update nama!')
    }
}

handler.command = ['setnamebot', 'setbotname']
handler.owner = true

export default handler


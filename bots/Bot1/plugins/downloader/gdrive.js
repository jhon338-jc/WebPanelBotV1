let handler = async (m, { conn, text, args }) => {
try {
    
    if (!text) return m.reply('Masukkan link Google Drive!')
    const id = (text.match(/[\w-]{25,}/) || [])[0]
    if (!id) return m.reply('⚠️ Link Google Drive tidak valid.')
    m.reply(['☁️ *Google Drive*', '', 'File ID: ' + id, '', 'Downloading di proses...'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['gdrive', 'gd', 'googledrive']
export default handler

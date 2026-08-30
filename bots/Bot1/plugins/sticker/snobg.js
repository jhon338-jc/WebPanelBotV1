import * as JimpModule from 'jimp'
const Jimp = JimpModule.Jimp || JimpModule.default
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        let buffer
        if (m.quoted) buffer = await m.quoted.download()
        else buffer = await m.download()
        if (!buffer) return m.reply('⚠️ Reply / kirim gambar dulu!')
        let image = await Jimp.read(buffer)
        image.contain(512, 512)
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]
    if (r > 235 && g > 235 && b > 235) this.bitmap.data[idx + 3] = 0
})
image.background(0x00000000)
        let pngPath = `${os.tmpdir()}/tmp_s_${Date.now()}.png`
        let webpPath = `${os.tmpdir()}/tmp_s_${Date.now()}.webp`
        await image.writeAsync(pngPath)
        execSync(`convert ${pngPath} -define webp:lossless=true ${webpPath}`)
        let stickerBuffer = fs.readFileSync(webpPath)
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        fs.unlinkSync(pngPath)
        fs.unlinkSync(webpPath)
        setTimeout(async () => { if (!m.isButtonResponse) await conn.sendMessage(m.chat, { delete: m.key }) }, 1000)
    } catch (e) {
        console.error(e)
        conn.sendMessage(m.chat, { text: '❌ Gagal membuat stiker!' })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}
handler.command = ['snobg', 'nobg']
export default handler

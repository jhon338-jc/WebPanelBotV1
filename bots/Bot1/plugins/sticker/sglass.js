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
image.gaussian(2)
image.brightness(0.1)
image.background(0x112233aa)
        let pngPath = `${os.tmpdir()}/tmp_s_${Date.now()}.png`
        let webpPath = `${os.tmpdir()}/tmp_s_${Date.now()}.webp`
        await image.writeAsync(pngPath)
        execSync(`convert ${pngPath} -define webp:lossless=true ${webpPath}`)
        let stickerBuffer = fs.readFileSync(webpPath)
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        fs.unlinkSync(pngPath)
        fs.unlinkSync(webpPath)
        setTimeout(async () => { await conn.sendMessage(m.chat, { delete: m.key }) }, 1000)
    } catch (e) {
        console.error(e)
        conn.sendMessage(m.chat, { text: '❌ Gagal membuat stiker!' })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}
handler.command = ['sglass', 'stikerglass']
export default handler

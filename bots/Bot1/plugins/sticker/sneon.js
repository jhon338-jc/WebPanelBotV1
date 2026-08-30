import * as JimpModule from 'jimp'
const Jimp = JimpModule.Jimp || JimpModule.default
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ Masukkan teks!\n\nContoh: .sneon Jhon338')
    try {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
        const image = new Jimp(512, 512, 0xffff00ff)
        const tw = Jimp.measureText(font, text)
        image.print(font, (512 - tw) / 2, 200, text)
        let pngPath = `${os.tmpdir()}/tmp_t_${Date.now()}.png`
        let webpPath = `${os.tmpdir()}/tmp_t_${Date.now()}.webp`
        await image.writeAsync(pngPath)
        execSync(`convert ${pngPath} -define webp:lossless=true ${webpPath}`)
        await conn.sendMessage(m.chat, { sticker: fs.readFileSync(webpPath) }, { quoted: m })
        fs.unlinkSync(pngPath)
        fs.unlinkSync(webpPath)
    } catch (e) {
        console.error(e)
        m.reply('❌ Gagal!')
    }
}
handler.command = ['sneon', 'stikerneon']
export default handler

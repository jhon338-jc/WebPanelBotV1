let handler = async (m, { conn, text, args }) => {
try {
    
    const n = text || 'anonymous'
    const khodam = ['Macan Putih','Naga Hijau','Kucing Jail','Harimau Bangku','Buaya Darat','Burung Hantu','Gurame Mas','Singa Betina','Elang Hitam','Ular Kobra']
    const vibes = ['sangat melindungi pemiliknya','paling galak di kelasnya','suka caper tapi jujur','sering begadang menjaga rumput','pinter ngemal makanan']
    const a = khodam[Math.floor(Math.random() * khodam.length)]
    const b = vibes[Math.floor(Math.random() * vibes.length)]
    m.reply(['🐉 *CEK KHODAM*', '', 'Nama: ' + n, 'Khodam: *' + a + '*', 'Sifat: ' + b, '', '(Buat seru-seruan ya 😄)'].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['cekkhodam', 'khodam']
export default handler

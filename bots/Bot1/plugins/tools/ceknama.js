let handler = async (m, { conn, text, args }) => {
try {
    
    const n = (text || '').toLowerCase().replace(/[^a-z]/gi, '')
    if (!n) return m.reply('Masukkan nama!\nContoh: .ceknama Jhon')
    const map = { a: 'Ambisi besar & percaya diri', b: 'Baik hati & penyabar', c: 'Cerdas & kreatif', d: 'Disiplin & pekerja keras', e: 'Emosional tapi hangat', f: 'Fokus & setia', g: 'Gigih suka tantangan', h: 'Humoris & ramah', i: 'Intuitif & peka', j: 'Jujur & tanggung jawab', k: 'Karismatik & supel', l: 'Lembut & perhatian', m: 'Mandiri & berwibawa', n: 'Loyal & tenang', o: 'Optimis & ceria', p: 'Pemberani & petualang', q: 'Cerdik & analitis', r: 'Romantis & hangat', s: 'Supel & komunikatif', t: 'Tangguh & teguh', u: 'Unik & mandiri', v: 'Visioner & inovatif', w: 'Berwawasan luas', x: 'X-factor & karismatik', y: 'Penuh semangat', z: 'Antusias' }
    const lines = [...new Set(n.split(''))].map(ch => '• ' + ch.toUpperCase() + ' : ' + (map[ch] || 'Sisi misterius'))
    m.reply(['🔤 *ARTI NAMA: ' + text.toUpperCase() + '*', '', ...lines].join('\n'))
} catch (e) {
    console.error(e)
    m.reply('❌ Error! Coba lagi.')
}
}
handler.command = ['ceknama', 'artinama']
export default handler

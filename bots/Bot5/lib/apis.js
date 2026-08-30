// ============================================================
//  Helper API / fungsi umum untuk plugin (Termux-friendly)
//  - Pakai fetch (bawaan Node), tanpa native lib berat.
//  - Semua endpoint public, multi-fallback, selalu catch error.
// ============================================================

const UA = 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'

export function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null
    return arr[Math.floor(Math.random() * arr.length)]
}

export async function fetchJson(url, opts = {}) {
    const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept': 'application/json', ...(opts.headers || {}) },
        method: opts.method || 'GET',
        body: opts.body,
        ...(opts.signal ? { signal: opts.signal } : {})
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

export async function getBuffer(url) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length === 0) throw new Error('Empty buffer')
    return buf
}

// Coba beberapa endpoint sampai ada yang sukses
export async function tryEndpoints(builder) {
    let lastErr = null
    for (const ep of builder()) {
        try {
            const r = await ep()
            if (r) return r
        } catch (e) { lastErr = e }
    }
    throw lastErr || new Error('Semua endpoint gagal')
}

// ---------------- Downloader ----------------

export const scrapTiktok = url => fetchJson(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`)
    .then(j => {
        try {
            return {
                title: j.data?.title,
                author: j.data?.author?.nickname,
                avatar: j.data?.author?.avatar,
                play: j.data?.play || j.data?.hdplay || j.data?.watermark || '',
                audio: j.data?.music || ''
            }
        } catch (e) { throw new Error('Format TikTok tidak diketahui') }
    })

export const scrapIg = url => tryEndpoints(() => [
    () => fetchJson(`https://v3.saveig.app/api/ajaxSearch?q=${encodeURIComponent(url)}&t=media&lang=id`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(j => ({ list: j.data || [] })),
    () => fetchJson(`https://igdownloader.app/api/ajaxSearch?q=${encodeURIComponent(url)}&t=media`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest', Referer: 'https://igdownloader.app/' }
    }).then(j => ({ list: j.data || [] }))
])

export const scrapFb = url => tryEndpoints(() => [
    () => fetchJson(`https://v3.saveig.app/api/ajaxSearch?q=${encodeURIComponent(url)}&t=media&lang=id`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(j => ({ list: j.data || [] }))
])

export const scrapYt = url => tryEndpoints(() => [
    () => fetchJson(`https://api.ryzendesu.vip/api/downloader/youtube?url=${encodeURIComponent(url)}`, { method: 'POST' }),
    () => fetchJson(`https://widipe.com/download/ytdl?url=${encodeURIComponent(url)}`, { method: 'POST' }),
    () => fetchJson(`https://api.kadekapu.com/api/dowloader/yt?url=${encodeURIComponent(url)}`, { method: 'POST' })
])

export const ytThumb = url => {
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)
    if (!m) throw new Error('URL YouTube tidak valid')
    return `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`
}

export const ytId = url => (url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1]

export const searchAudio = q => tryEndpoints(() => [
    () => fetchJson(`https://api.ryzendesu.vip/api/search/spotify?query=${encodeURIComponent(q)}`),
    () => fetchJson(`https://api.chatnio.net/music?query=${encodeURIComponent(q)}`)
])

// ---------------- AI Chat ----------------
const AI_ENDPOINTS = [
    q => fetchJson(`https://api.ryzendesu.vip/api/ai/gpt4?text=${encodeURIComponent(q)}`).then(j => j.response || j.reply || j.message || j.result?.response || null),
    q => fetchJson(`https://widipe.com/openai?text=${encodeURIComponent(q)}`, { method: 'POST' }).then(j => j.result?.response || j.response || null),
    q => fetchJson(`https://api.bluebot.pw/api/v2/gpt?message=${encodeURIComponent(q)}`).then(j => j.response || j.result || null)
]

export async function aiChat(q) {
    let lastErr = null
    for (const ep of AI_ENDPOINTS) {
        try {
            const r = await ep(q)
            if (r && typeof r === 'string' && r.length > 1) return r
        } catch (e) { lastErr = e }
    }
    throw lastErr || new Error('AI tidak merespon')
}

// ---------------- Translate / Wiki / Cuaca ----------------
export const translate = (text, target = 'id') => tryEndpoints(() => [
    () => fetchJson(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${target === 'id' ? 'en|id' : 'id|en'}`)
        .then(j => { if (j.responseStatus !== 200) throw new Error('mymemory gagal'); return j.responseData.translatedText }),
    () => fetchJson(`https://lingva.ml/api/v1/${target === 'id' ? 'en/id' : 'id/en'}/${encodeURIComponent(text)}`)
        .then(j => j.translation)
])

export const wikiSummary = q => fetchJson(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`)
    .then(j => ({ title: j.title, extract: j.extract, thumb: j.thumbnail?.source || null }))

export const cuaca = kota => fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`)
    .then(async j => {
        const r = j.results?.[0]
        if (!r) throw new Error(`Kota ${kota} tidak ditemukan`)
        const w = await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current_weather=true&timezone=auto`)
        return { kota: r.name, temp: w.current_weather?.temperature, wind: w.current_weather?.windspeed, code: w.current_weather?.weathercode, time: w.current_weather?.time }
    })

export const gempa = () => fetchJson('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
    .then(j => {
        const g = j.Infogempa?.gempa
        return g ? { waktu: g.Waktu, magnitude: g.Magnitude, lokasi: g.Lokasi, potensi: g.Potensi, kedalaman: g.Kedalaman, koordinat: g.Coordinates } : null
    })

// ---------------- Random image / anime ----------------
export const randomImage = async kind => {
    const map = {
        waifu: 'https://api.waifu.pics/sfw/waifu',
        neko: 'https://api.waifu.pics/sfw/neko',
        shinobu: 'https://api.waifu.pics/sfw/shinobu',
        megumin: 'https://api.waifu.pics/sfw/megumin',
        awoo: 'https://api.waifu.pics/sfw/awoo',
        husbu: 'https://api.waifu.pics/sfw/waifu'
    }
    const url = map[kind] || map.waifu
    return getBuffer(url)
}

export const randomJoke = () => {
    const jokes = [
        'Kenapa matematika selalu sedih? Karena banyak masalah. 🤓',
        'Aku beli buku anti galau, pas dibuka isinya cuma tanda seru (!).',
        'Kenapa komputer kedinginan? Karena lupa nutup Windows-nya. 🖥️',
        'Guru bilang: besok ulangan. Murid: sebelum ulangan, kita makan dulu ya bu. 🍜',
        'Kenapa payung tak pernah menangis? Karena selalu ada pelindung di atasnya. ☂️'
    ]
    return pickRandom(jokes)
}

export const randomFact = () => {
    const facts = [
        'Kuning telur gak bisa dipisahkan dari putihnya setelah matang.',
        'Madu tidak pernah basi, para arkeolog pernah temukan madu 3000 tahun masih enak.',
        'Cumi-cumi punya 3 jantung.',
        'Siput bisa tidur sampai 3 tahun. 🐌',
        'Bebek gemuk selalu berteriak setelah hujan, bukan karena senang tapi karena ritual. 🦆'
    ]
    return pickRandom(facts)
}

// ---------------- Data lokal (Islami, primbon, edukasi) ----------------
export const doaLIST = [
    { nama: "Doa Sebelum Makan", ayat: "Allahumma barik lana fima razaqtana wa qina 'adzaban-nar." },
    { nama: "Doa Sesudah Makan", ayat: "Alhamdulillahilladzi at'amana wa saqana wa ja'alana muslimin." },
    { nama: "Doa Masuk Rumah", ayat: "Allahumma inni as-aluka khayral-mawlaji wa khayral-makhraji." },
    { nama: "Doa Keluar Rumah", ayat: "Bismillah, tawakkaltu 'alallah, la hawla wala quwwata illa billah." },
    { nama: "Doa Belajar", ayat: "Allahumma infa'ni bima 'allamtani wa 'allimni ma yanfa'uni." },
    { nama: "Doa Orangtua", ayat: "Rabbirhamhuma kama rabbayani shaghira." }
]

export const asmaulHusnaLIST = [
    'Ar-Rahman (Yang Maha Pengasih)',
    'Ar-Rahim (Yang Maha Penyayang)',
    'Al-Malik (Yang Maha Merajai)',
    'Al-Quddus (Yang Maha Suci)',
    'As-Salam (Yang Maha Sejahtera)',
    'Al-Mu\'min (Yang Maha Memberi Keamanan)',
    'Al-Muhaymin (Yang Maha Memelihara)',
    'Al-Aziz (Yang Maha Perkasa)',
    'Al-Jabbar (Yang Maha Kuasa)',
    'Al-Mutakabbir (Yang Maha Megah)'
]

export const artiNamaMap = {
    a: 'Ambisi besar & percaya diri', b: 'Baik hati & penyabar', c: 'Cerdas & kreatif',
    d: 'Disiplin & pekerja keras', e: 'Emosional tapi hangat', f: 'Fokus & setia',
    g: 'Gigih & suka tantangan', h: 'Humoris & ramah', i: 'Intuitif & peka',
    j: 'Jujur & bertanggung jawab', k: 'Karismatik & supel', l: 'Lembut & perhatian',
    m: 'Mandiri & berwibawa', n: 'Loyal & tenang', o: 'Optimis & ceria',
    p: 'Pemberani & petualang', q: 'Cerdik & analitis', r: 'Romantis & hangat',
    s: 'Supel & komunikatif', t: 'Tangguh & teguh', u: 'Unik & mandiri',
    v: 'Visioner & inovatif', w: 'Berwawasan luas', x: 'X-factor & karismatik',
    y: 'Penuh semangat', z: 'Zealous / antusias'
}

export const zodiakLIST = [
    { nama: 'Aries', 'tanggal': '21 Mar - 19 Apr', sifat: 'Pemberani, energik, pemimpin alami' },
    { nama: 'Taurus', 'tanggal': '20 Apr - 20 Mei', sifat: 'Sabarr, setia, suka kenyamanan' },
    { nama: 'Gemini', 'tanggal': '21 Mei - 20 Jun', sifat: 'Komunikatif, cerdas, mudah bosan' },
    { nama: 'Cancer', 'tanggal': '21 Jun - 22 Jul', sifat: 'Peka, penyayang, protektif' },
    { nama: 'Leo', 'tanggal': '23 Jul - 22 Agu', sifat: 'Percaya diri, dermawan, karismatik' },
    { nama: 'Virgo', 'tanggal': '23 Agu - 22 Sep', sifat: 'Teliti, analitis, perfeksionis' },
    { nama: 'Libra', 'tanggal': '23 Sep - 22 Okt', sifat: 'Rapi, adil, suka harmoni' },
    { nama: 'Scorpio', 'tanggal': '23 Okt - 21 Nov', sifat: 'Misterius, kuat, setia' },
    { nama: 'Sagittarius', 'tanggal': '22 Nov - 21 Des', sifat: 'Optimis, bebas, filosofis' },
    { nama: 'Capricorn', 'tanggal': '22 Des - 19 Jan', sifat: 'Ambisi, disiplin, sabar' },
    { nama: 'Aquarius', 'tanggal': '20 Jan - 18 Feb', sifat: 'Cerdas, unik, humanis' },
    { nama: 'Pisces', 'tanggal': '19 Feb - 20 Mar', sifat: 'Imaginatif, empatik, artistik' }
]

export const shioLIST = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi']

export const artiMimpiMap = {
    air: 'Tanda kemakmuran & ketenangan hati',
    jatuh: 'Ada rasa khawatir atau kehilangan kendali',
    gigi: 'Pertanda perubahan besar, bisa keluarga atau karir',
    rumah: 'Mencerminkan kondisi batin kamu',
    uang: 'Ada energi positif & rezeki mengalir',
    berkata_melihat: 'Dukunglah sesama, ada kebaikan menunggu',
    terbang: 'Ambisi tinggi & keinginan bebas',
    mati: 'Bukan kematian fisik, tapi akhir dari satu fase'
}

// Simbol cuaca (weathercode open-meteo)
export const weatherText = code => {
    const m = {
        0: '☀️ Cerah', 1: '🌤️ Cerah berawan', 2: '⛅ Sedikit berawan', 3: '☁️ Berawan',
        45: '🌫️ Kabut', 48: '🌫️ Kabut beku', 51: '🌦️ Gerimis ringan', 61: '🌧️ Hujan ringan',
        63: '🌧️ Hujan', 71: '🌨️ Salju ringan', 80: '🌦️ Hujan gerimis', 95: '⛈️ Badai petir'
    }
    return m[code] || `Kode ${code}`
}
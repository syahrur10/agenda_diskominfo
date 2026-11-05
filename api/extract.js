// Serverless function: membaca surat (PDF/gambar) dengan Claude dan mengembalikan data agenda + saran disposisi.
const PEOPLE = ['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan','Ridho Risadianto','Chandra Dwi','Danan Nurdiansyah','Lina Munfaroh'];
const JENIS = ['Rapat','Workshop','Seminar','Webinar','Sosialisasi','Undangan','Lainnya'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan metode POST.' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY belum diatur. Isi di file .env.local (lokal) atau Environment Variables (Vercel), lalu jalankan ulang.' });

  const { data, mediaType } = req.body || {};
  if (!data || !mediaType) return res.status(400).json({ error: 'File surat tidak ditemukan.' });

  const isPdf = mediaType === 'application/pdf';
  const filePart = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: mediaType, data } }
    : { type: 'image', source: { type: 'base64', media_type: mediaType, data } };

  const prompt = `Kamu adalah asisten persuratan Dinas Komunikasi dan Informatika (Diskominfo) Kota Semarang.
Baca surat undangan/pemberitahuan pada lampiran, lalu ekstrak informasi agenda kegiatannya.
Balas HANYA dengan satu objek JSON valid (tanpa markdown) dengan kunci:
{
 "judul": "nama kegiatan singkat dan jelas",
 "jenis": salah satu dari ${JSON.stringify(JENIS)},
 "nomorSurat": "nomor surat atau kosong",
 "asalSurat": "instansi pengirim",
 "perihal": "perihal surat",
 "tglMulai": "YYYY-MM-DD",
 "tglSelesai": "YYYY-MM-DD atau kosong jika satu hari",
 "jamMulai": "HH:MM (24 jam) atau kosong",
 "jamSelesai": "HH:MM atau kosong",
 "tempat": "lokasi, atau 'Zoom Meeting' / 'Google Meet' bila daring",
 "link": "tautan rapat daring jika ada, kalau tidak kosong",
 "penyelenggara": "penyelenggara kegiatan",
 "keterangan": "ringkasan 1-3 kalimat, termasuk kode rapat/passcode/dress code/hal yang perlu disiapkan bila ada",
 "disposisi": array nama yang disarankan menerima disposisi, hanya dari ${JSON.stringify(PEOPLE)},
 "alasanDisposisi": "satu kalimat alasan saran disposisi"
}
Aturan: jangan mengarang. Jika informasi tidak ada di surat, isi string kosong. Tahun mengacu pada isi surat. Tanggal hari ini ${new Date().toISOString().slice(0,10)}.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: [filePart, { type: 'text', text: prompt }] }],
      }),
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || 'Permintaan ke AI gagal.' });
    const text = (j.content || []).map(c => c.text || '').join('');
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return res.status(502).json({ error: 'AI tidak mengembalikan data yang bisa dibaca.' });
    const out = JSON.parse(m[0]);
    out.disposisi = (out.disposisi || []).filter(n => PEOPLE.includes(n));
    if (!JENIS.includes(out.jenis)) out.jenis = 'Lainnya';
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: 'Gagal memproses surat: ' + e.message });
  }
};

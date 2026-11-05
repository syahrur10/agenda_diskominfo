(() => {
'use strict';
const PEOPLE = ['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan','Ridho Risadianto','Chandra Dwi','Danan Nurdiansyah','Lina Munfaroh'];
const AV_COLORS = ['#2f5fd0','#7b3fc4','#0f8a6d','#d98200','#c62839','#6a4fd6','#2a9d4a','#c2185b'];
const JENIS = ['Rapat','Workshop','Seminar','Webinar','Sosialisasi','Undangan','Lainnya'];
const JCOLOR = {Rapat:'#2f5fd0',Workshop:'#c2185b',Seminar:'#7b3fc4',Webinar:'#0f8a6d',Sosialisasi:'#d2691e',Undangan:'#9a6b00',Lainnya:'#5b6472'};
const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const KEY = 'agenda-diskominfo-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC = { pin:'<svg viewBox="0 0 24 24"><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6zM12 14v7"/></svg>', x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' };
let first = true;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const SEED = [
 {judul:'Persiapan Pengumuman Finalis Cyberfrontier 2026',jenis:'Rapat',tglMulai:'2026-11-03',jamMulai:'13:00',jamSelesai:'14:00',tempat:'Google Meet',link:'https://meet.google.com/pqp-ihkc-wdp',penyelenggara:'Diskominfo',disposisi:PEOPLE.slice(0,8)},
 {judul:'Cyber Frontier: Beyond The Attack - Lomba Hacking 2026',jenis:'Workshop',tglMulai:'2026-11-09',tglSelesai:'2026-11-10',jamMulai:'08:00',jamSelesai:'17:00',tempat:'Diskominfo - Gets Premiere',penyelenggara:'Diskominfo',disposisi:['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan']},
 {judul:'Kegiatan Sharing Session dan Communication Check Ke-4 Gov-CSIRT',jenis:'Seminar',tglMulai:'2026-11-04',jamMulai:'08:00',jamSelesai:'16:00',tempat:'Zoom Meeting (via teleconference)',penyelenggara:'Badan Siber dan Sandi Negara',disposisi:['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan']},
 {judul:'Technical Meeting Dewan Juri Cyber Frontier 2026',jenis:'Rapat',tglMulai:'2026-10-29',jamMulai:'13:00',jamSelesai:'14:00',tempat:'Google Meet',link:'https://meet.google.com/abc-defg-hij',penyelenggara:'Diskominfo',disposisi:['Arif Kurnia','Ridho Risadianto','Chandra Dwi']},
 {judul:'Sosialisasi Pemanfaatan Aplikasi SDG\'s dan Kartu Pelajar/Kartu Trans Semarang',jenis:'Sosialisasi',tglMulai:'2026-10-29',jamMulai:'09:00',jamSelesai:'10:00',tempat:'SMP 19 Semarang',penyelenggara:'Dinas Komunikasi, Informatika, Statistik dan Persandian',disposisi:['Arif Kurnia','Chandra Dwi','Danan Nurdiansyah','Lina Munfaroh']},
 {judul:'Webinar Sandikamimania Series #77',jenis:'Webinar',tglMulai:'2026-10-29',jamMulai:'07:30',jamSelesai:'12:00',tempat:'Menyesuaikan (Video conference)',penyelenggara:'Dinas Komunikasi dan Informatika Provinsi Jawa Tengah',disposisi:['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan']},
 {judul:'Gelar Wicara Sobatkami Digitalks #35, Tahun 2026 dengan tema Deepfake & Hoaks',jenis:'Webinar',tglMulai:'2026-10-28',jamMulai:'13:00',jamSelesai:'14:00',tempat:'Daring',link:'https://zoom.us/j/000',penyelenggara:'Bidang Persandian dan Telekomunikasi',disposisi:['Arif Kurnia','Michael Anandya','Rahmat Adi','Anggito Bustan']},
 {judul:'Kick Off Meeting kajian PDP Kota Semarang',jenis:'Rapat',tglMulai:'2026-10-28',jamMulai:'09:00',jamSelesai:'10:00',tempat:'Google Meet',link:'https://meet.google.com/xyz-uvwx-rst',penyelenggara:'Diskominfo Semarang',disposisi:['Arif Kurnia','Michael Anandya']},
].map(a => ({id: uid(), nomorSurat:'', keterangan: a.link ? 'Tautan rapat: ' + a.link : '', tglSelesai:'', link:'', pinned:false, ...a}));

let items = load();
const S = { q:'', sort:'new', view:'grid', nav:'all', jenis:null };

function load(){ try { const r = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(r)) return r; } catch(e){} return SEED; }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(items)); } catch(e){} }

/* helpers */
const pd = s => { if(!s) return null; const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const fmtDate = s => { const d = pd(s); return d ? `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}` : '—'; };
const fmtRange = a => a.tglSelesai && a.tglSelesai !== a.tglMulai ? `${fmtDate(a.tglMulai)} – ${fmtDate(a.tglSelesai)}` : fmtDate(a.tglMulai);
const fmtTime = a => a.jamMulai ? a.jamMulai + (a.jamSelesai ? ' – ' + a.jamSelesai : '') + ' WIB' : '—';
const isOnline = a => !!a.link || /meet|zoom|daring|online|video ?conference|teleconference|teams/i.test(a.tempat || '');
const initial = n => n.trim()[0].toUpperCase();
const color = n => AV_COLORS[[...n].reduce((s,c) => s + c.charCodeAt(0), 0) % AV_COLORS.length];
const avatar = n => `<span class="av" style="--a:${color(n)}" title="${esc(n)}">${esc(initial(n))}</span>`;
const chip = n => `<span class="chip" style="--a:${color(n)}">${avatar(n)}${esc(n)}</span>`;
const inWeek = a => { const t = pd(todayStr()), d = pd(a.tglMulai); const s = new Date(t); s.setDate(t.getDate() - ((t.getDay()+6)%7)); const e = new Date(s); e.setDate(s.getDate()+6); return d >= s && d <= e; };
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); };

/* filtering */
function filtered(){
  const q = S.q.toLowerCase(), t = todayStr();
  let r = items.filter(a => {
    if (S.nav === 'today' && !(a.tglMulai <= t && (a.tglSelesai || a.tglMulai) >= t)) return false;
    if (S.nav === 'week' && !inWeek(a)) return false;
    if (S.nav === 'pin' && !a.pinned) return false;
    if (S.jenis && a.jenis !== S.jenis) return false;
    if (q && ![a.judul,a.tempat,a.penyelenggara,a.jenis,a.nomorSurat,(a.disposisi||[]).join(' ')].join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
  const key = a => a.tglMulai + (a.jamMulai || '');
  if (S.sort === 'new') r.sort((a,b) => key(b).localeCompare(key(a)));
  if (S.sort === 'old') r.sort((a,b) => key(a).localeCompare(key(b)));
  if (S.sort === 'soon') r.sort((a,b) => { const fa = a.tglMulai >= t, fb = b.tglMulai >= t; return fa !== fb ? (fa ? -1 : 1) : fa ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a)); });
  return r;
}

/* render */
function render(){
  const t = todayStr();
  const navs = [['all','Semua agenda',items.length],['today','Hari ini',items.filter(a => a.tglMulai <= t && (a.tglSelesai||a.tglMulai) >= t).length],['week','Minggu ini',items.filter(inWeek).length],['pin','Disematkan',items.filter(a=>a.pinned).length]];
  $('#nav').innerHTML = navs.map(([k,l,n]) => `<button data-nav="${k}" class="${S.nav===k&&!S.jenis?'on':''}"><span>${l}</span><span class="n">${n}</span></button>`).join('');
  $('#cats').innerHTML = JENIS.map(j => `<button data-jenis="${j}" class="${S.jenis===j?'on':''}"><span><i class="dot" style="background:${JCOLOR[j]}"></i>${j}</span><span class="n">${items.filter(a=>a.jenis===j).length}</span></button>`).join('');
  const label = navs.find(n => n[0] === S.nav)[1];
  $('#pageTitle').textContent = S.jenis || label;

  const upcoming = items.filter(a => (a.tglSelesai||a.tglMulai) >= t).length;
  $('#stats').innerHTML = [['Total agenda',items.length,''],['Akan datang',upcoming,'hl'],['Minggu ini',items.filter(inWeek).length,''],['Rapat daring',items.filter(isOnline).length,'']]
    .map(([l,n,c]) => `<div class="stat ${c}"><b data-n="${n}">${n}</b><span>${l}</span></div>`).join('');

  const r = filtered();
  $('#count').textContent = `${r.length} agenda ditampilkan`;
  const el = $('#list'); el.className = (S.view === 'grid' ? 'grid' : 'table') + (first ? ' intro' : '');
  el.innerHTML = r.length ? r.map(card).join('') : `<div class="empty"><strong>Belum ada agenda yang cocok</strong>Ubah kata kunci pencarian, atau tambahkan agenda baru dari surat undangan.</div>`;
  if (!r.length) el.className = '';
  if (first) { first = false; countUp(); }
  renderHero();
}
function countUp(){ document.querySelectorAll('.stat b').forEach(b => { const n = +b.dataset.n, s0 = performance.now(); (function f(x){ const p = Math.min((x - s0) / 900, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(s0); }); }
function renderHero(){
  const t = todayStr(), now = new Date(), k = a => a.tglMulai + (a.jamMulai || '');
  const nx = items.filter(a => (a.tglSelesai || a.tglMulai) >= t).sort((a,b) => k(a).localeCompare(k(b)))[0];
  const h = now.getHours(), g = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  $('#hero').innerHTML = `<div class="hl"><p>${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}</p><div class="clock" id="clock"></div><h2>${g}, Tim Diskominfo</h2></div>
  <div class="hn"><small>Agenda berikutnya</small>${nx ? `<strong>${esc(nx.judul)}</strong><span>${esc(fmtRange(nx))} · ${esc(fmtTime(nx))}</span><button class="btn ghost" data-open="${nx.id}">Lihat detail</button>` : '<strong>Belum ada agenda mendatang</strong>'}</div>`;
  tick();
}
function tick(){ const c = $('#clock'); if (c) c.textContent = new Date().toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit',second:'2-digit'}).replaceAll('.', ':'); }
setInterval(tick, 1000);
function card(a, i){
  const d = a.disposisi || [], st = pd(a.tglMulai), en = pd(a.tglSelesai);
  const multi = en && a.tglSelesai !== a.tglMulai;
  return `<article class="card" data-id="${a.id}" style="--c:${JCOLOR[a.jenis] || JCOLOR.Lainnya};--i:${i}" tabindex="0">
    <div class="dt"><b>${st ? st.getDate() : '–'}</b><span>${st ? BULAN[st.getMonth()] : ''}</span><em>${st ? HARI[st.getDay()].slice(0,3) : ''}</em></div>
    <div class="cb">
      <div class="row1"><span class="tag">${esc(a.jenis)}</span>${isOnline(a)?'<span class="tag on"><i class="live"></i>Daring</span>':''}<span class="sp"></span><button class="pinb ${a.pinned?'on':''}" data-pin="${a.id}" aria-label="Sematkan">${IC.pin}</button></div>
      <h3>${esc(a.judul)}</h3>
      <div class="meta">
        <div><i>Jam</i><span>${esc(fmtTime(a))}</span></div>
        <div><i>Tempat</i><span>${esc(a.tempat || '—')}</span></div>
        <div><i>Oleh</i><span>${esc(a.penyelenggara || '—')}</span></div>
      </div>
      <div class="foot">${d.length ? `<div class="avs">${d.slice(0,4).map(avatar).join('')}${d.length>4?`<span class="av more">+${d.length-4}</span>`:''}</div>` : '<span class="noDisp">Belum ada disposisi</span>'}${multi?`<span class="rng">s.d. ${en.getDate()} ${BULAN[en.getMonth()]}</span>`:''}</div>
    </div>
  </article>`;
}

/* detail */
function openDetail(id){
  const a = items.find(x => x.id === id); if (!a) return;
  const dlg = $('#dlgDetail');
  dlg.innerHTML = `
  <header class="dh"><div style="flex:1"><div class="row1"><span class="tag" style="--c:${JCOLOR[a.jenis]}">${esc(a.jenis)}</span>${isOnline(a)?'<span class="tag on">Daring</span>':''}</div><h2>${esc(a.judul)}</h2></div><button class="icon-btn" data-close aria-label="Tutup">${IC.x}</button></header>
  <div class="db">
    ${a.link ? `<div class="meet"><div><small>Rapat daring terdeteksi</small><code>${esc(a.link)}</code></div><a href="${esc(a.link)}" target="_blank" rel="noopener">Gabung rapat</a></div>` : ''}
    <div class="sec"><h4>Waktu dan tempat</h4><div class="kv">
      <div><small>Tanggal mulai</small><b>${esc(fmtDate(a.tglMulai))}</b></div><div><small>Tanggal selesai</small><b>${a.tglSelesai ? esc(fmtDate(a.tglSelesai)) : '—'}</b></div>
      <div><small>Jam</small><b>${esc(fmtTime(a))}</b></div><div><small>Tempat</small><b>${esc(a.tempat || '—')}</b></div></div></div>
    <div class="sec"><h4>Detail acara</h4><div class="kv">
      <div><small>Penyelenggara</small><b>${esc(a.penyelenggara || '—')}</b></div><div><small>Nomor surat</small><b>${esc(a.nomorSurat || '—')}</b></div></div></div>
    ${a.keterangan ? `<div class="sec"><h4>Keterangan</h4><div class="note">${esc(a.keterangan)}</div></div>` : ''}
    <div class="sec"><h4>Disposisi</h4>${(a.disposisi||[]).length ? `<div class="chips">${a.disposisi.map(chip).join('')}</div>` : '<span class="noDisp">Belum ada disposisi.</span>'}</div>
  </div>
  <footer class="df"><button class="btn" data-copy="${a.id}">Salin</button><button class="btn" data-cal="${a.id}">Kalender</button><span class="sp"></span>
    <button class="btn" data-edit="${a.id}">Ubah</button><button class="btn danger" data-del="${a.id}">Hapus</button><button class="btn primary" data-close>Tutup</button></footer>`;
  dlg.showModal();
}
function copyText(a){
  return `*${a.judul}*\nTanggal: ${fmtRange(a)}\nJam: ${fmtTime(a)}\nTempat: ${a.tempat || '-'}${a.link ? '\nTautan: ' + a.link : ''}\nPenyelenggara: ${a.penyelenggara || '-'}\n\nDisposisi: ${(a.disposisi||[]).join(', ') || '-'}`;
}
function calUrl(a){
  const f = (d,t) => d.replaceAll('-','') + 'T' + (t||'08:00').replace(':','') + '00';
  const p = new URLSearchParams({action:'TEMPLATE',text:a.judul,dates:`${f(a.tglMulai,a.jamMulai)}/${f(a.tglSelesai||a.tglMulai,a.jamSelesai||a.jamMulai||'09:00')}`,location:a.tempat||'',details:(a.keterangan||'')+(a.link?'\n'+a.link:''),ctz:'Asia/Jakarta'});
  return 'https://calendar.google.com/calendar/render?' + p;
}

/* form */
let editId = null;
function openForm(id, pre){
  editId = id;
  const a = id ? items.find(x => x.id === id) : { jenis:'Rapat', tglMulai: todayStr(), disposisi:[], ...(pre||{}) };
  const f = $('#form');
  $('#formTitle').textContent = id ? 'Ubah agenda' : 'Tambah agenda';
  f.jenis.innerHTML = JENIS.map(j => `<option ${j===a.jenis?'selected':''}>${j}</option>`).join('');
  ['judul','nomorSurat','tglMulai','tglSelesai','jamMulai','jamSelesai','tempat','penyelenggara','link','keterangan'].forEach(k => f[k].value = a[k] || '');
  $('#pickDisp').innerHTML = '<label class="all"><input type="checkbox" id="pickAll"><span class="chip all-chip">Semua</span></label>' + PEOPLE.map(n => `<label><input type="checkbox" value="${esc(n)}" ${(a.disposisi||[]).includes(n)?'checked':''}><span class="chip" style="--a:${color(n)}">${avatar(n)}${esc(n)}</span></label>`).join(''); syncAll();
  const note = $('#aiNote');
  if (pre && pre._ai) { note.hidden = false; note.innerHTML = `<b>Dibaca oleh AI dari surat${pre.asalSurat ? ' ' + esc(pre.asalSurat) : ''}</b>${pre.alasanDisposisi ? esc(pre.alasanDisposisi) + ' ' : ''}Periksa kembali data di bawah sebelum menyimpan.`; }
  else note.hidden = true;
  $('#dlgForm').showModal();
}
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, o = {};
  ['judul','jenis','nomorSurat','tglMulai','tglSelesai','jamMulai','jamSelesai','tempat','penyelenggara','link','keterangan'].forEach(k => o[k] = f[k].value.trim());
  o.disposisi = [...$('#pickDisp').querySelectorAll('input:checked:not(#pickAll)')].map(i => i.value);
  if (editId) { Object.assign(items.find(x => x.id === editId), o); toast('Agenda diperbarui'); }
  else { items.unshift({ id: uid(), pinned:false, ...o }); toast('Agenda ditambahkan'); }
  save(); $('#dlgForm').close(); render();
});

/* AI */
const dlgAI = $('#dlgAI'), status = $('#aiStatus');
function setStatus(html, err){ status.hidden = false; status.className = 'ai-status' + (err ? ' err' : ''); status.innerHTML = html; }
async function readFile(file){
  if (!/^(application\/pdf|image\/(png|jpe?g|webp))$/.test(file.type)) return setStatus('Format belum didukung. Gunakan PDF, JPG, PNG, atau WebP.', true);
  if (file.size > 4 * 1024 * 1024) return setStatus('Ukuran file lebih dari 4 MB. Kompres atau potong halaman surat terlebih dahulu.', true);
  setStatus(`<div class="scan"><i></i></div><span>AI sedang membaca “${esc(file.name)}”…</span>`);
  try {
    const data = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result.split(',')[1]); r.onerror = no; r.readAsDataURL(file); });
    const res = await fetch('/api/extract', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ data, mediaType: file.type }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || 'Server tidak merespons. Pastikan aplikasi sudah di-deploy di Vercel.');
    dlgAI.close(); status.hidden = true;
    openForm(null, { ...j, _ai:true });
  } catch (e) { setStatus(esc(e.message), true); }
}
$('#file').addEventListener('change', e => e.target.files[0] && readFile(e.target.files[0]));
const drop = $('#drop');
['dragover','dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => e.dataTransfer.files[0] && readFile(e.dataTransfer.files[0]));

/* export */
function exportCSV(){
  const cols = ['judul','jenis','nomorSurat','tglMulai','tglSelesai','jamMulai','jamSelesai','tempat','penyelenggara','link','keterangan','disposisi'];
  const rows = filtered().map(a => cols.map(c => `"${String(c==='disposisi' ? (a.disposisi||[]).join('; ') : a[c] || '').replaceAll('"','""')}"`).join(','));
  const blob = new Blob(['\ufeff' + cols.join(',') + '\n' + rows.join('\n')], { type:'text/csv;charset=utf-8' });
  const l = document.createElement('a'); l.href = URL.createObjectURL(blob); l.download = `agenda-diskominfo-${todayStr()}.csv`; l.click();
}

/* events */
document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-close]')) return t.closest('dialog').close();
  const pin = t.closest('[data-pin]'); if (pin) { e.stopPropagation(); const a = items.find(x => x.id === pin.dataset.pin); a.pinned = !a.pinned; save(); return render(); }
  const nav = t.closest('[data-nav]'); if (nav) { S.nav = nav.dataset.nav; S.jenis = null; $('#side').classList.remove('open'); return render(); }
  const jn = t.closest('[data-jenis]'); if (jn) { S.jenis = S.jenis === jn.dataset.jenis ? null : jn.dataset.jenis; S.nav = 'all'; $('#side').classList.remove('open'); return render(); }
  const ed = t.closest('[data-edit]'); if (ed) { $('#dlgDetail').close(); return openForm(ed.dataset.edit); }
  const del = t.closest('[data-del]'); if (del) { if (confirm('Hapus agenda ini? Tindakan ini tidak bisa dibatalkan.')) { items = items.filter(x => x.id !== del.dataset.del); save(); $('#dlgDetail').close(); render(); toast('Agenda dihapus'); } return; }
  const cp = t.closest('[data-copy]'); if (cp) { navigator.clipboard.writeText(copyText(items.find(x => x.id === cp.dataset.copy))).then(() => toast('Teks agenda disalin')); return; }
  const cal = t.closest('[data-cal]'); if (cal) return window.open(calUrl(items.find(x => x.id === cal.dataset.cal)), '_blank');
  const op = t.closest('[data-open]'); if (op) return openDetail(op.dataset.open);
  const c = t.closest('.card'); if (c) return openDetail(c.dataset.id);
  if (t.tagName === 'DIALOG') t.close();
});
$('#list').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('card')) openDetail(e.target.dataset.id); });
$('#q').addEventListener('input', e => { S.q = e.target.value; render(); });
$('#fSort').addEventListener('change', e => { S.sort = e.target.value; render(); });
document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => { S.view = b.dataset.v; document.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); render(); }));
$('#btnAdd').onclick = () => openForm(null);
$('#btnAI').onclick = () => { $('#side').classList.remove('open'); status.hidden = true; $('#file').value = ''; dlgAI.showModal(); };
$('#btnExport').onclick = exportCSV;
$('#btnMenu').onclick = () => $('#side').classList.toggle('open');
const picks = () => [...document.querySelectorAll('#pickDisp input:not(#pickAll)')];
function syncAll(){ const a = $('#pickAll'); if (a) a.checked = picks().every(i => i.checked); }
$('#pickDisp').addEventListener('change', e => { if (e.target.id === 'pickAll') picks().forEach(i => i.checked = e.target.checked); else syncAll(); });
render();
})();

# PRD GEMBIRA — Rebuild Platform Belajar Interaktif Anak

Versi 1.0 (Draft) · 8 Oktober 2026 · Sumber analisis: `gembira_pkm_kc_prototype_3.html`

## 1. Ringkasan Eksekutif

GEMBIRA (tagline: 'Tanpa Buku, Asyik Bermain!') adalah platform belajar interaktif berbasis permainan untuk anak usia dini (PAUD) dan SD. Prototipe saat ini berupa satu file HTML yang sudah menunjukkan konsep produknya: peta petualangan, dua game, 8 modul materi, koin, leaderboard, dan laporan untuk orang tua. Namun seluruh data hanya tersimpan di localStorage browser, sehingga klaim 'sinkronisasi cloud antar perangkat' belum benar-benar terjadi, dan sebagian besar modul masih berupa satu soal contoh.

Dokumen ini mendefinisikan kebutuhan untuk membangun ulang GEMBIRA sebagai aplikasi web modern (PWA) dengan akun nyata, database terpusat, mesin game yang mudah diperluas, bank soal yang dikelola lewat CMS, leaderboard yang aman untuk anak, dan dashboard orang tua yang berbasis akurasi, bukan sekadar jumlah sesi.

Prinsip rebuild: (1) pertahankan identitas dan alur yang sudah bagus; (2) ganti semua yang masih simulasi dengan implementasi nyata; (3) anak adalah pengguna utama, tetapi orang tua adalah pemilik akun dan data; (4) privasi anak dirancang sejak awal.

## 2. Analisis Prototipe Saat Ini

### 2.1 Yang sudah ada dan dipertahankan

- Lima area navigasi: Peta, Game, Materi, Leaderboard, Laporan Ortu (navbar di desktop, bottom bar di mobile).
- Identitas visual: font Poppins; palet gempink, gemyellow, gemblue, gemgreen, gempurple, gemdark, gemorange; sudut membulat besar; animasi floating; latar pola titik.
- Dua game: Letus Balon (penjumlahan 1–12, timer 45 detik, 4 pilihan) dan Tebak Kata (4 kata: apel, kucing, matahari, mobil).
- 8 modul usia dini: Warna, Geometri, Hitung Hewan, Dongeng Moral, Suara Satwa, Hitung Buah, Memori Kartu, Emosi.
- Koin: balon +5 per benar dan +50 saat selesai; kata +10 per benar dan +30 saat selesai; modul +15 per benar. Leaderboard top 10 berdasarkan koin. Efek suara sintetis lewat Web Audio.
- Dashboard orang tua dengan tiga bidang (Matematika, Warna & Bentuk, Bahasa) dan teks diagnostik otomatis.

### 2.2 Temuan yang menjadi alasan rebuild

**Fungsional**

- Sinkron cloud masih simulasi: data hanya di localStorage, dan event `storage` hanya menyinkronkan tab di browser yang sama. Badge 'Shared Storage Active' menyesatkan.
- Login tanpa verifikasi: siapa pun dapat mengetik email orang lain lalu mengubah nama dan avatar akun itu.
- Empat modul (Suara Satwa, Hitung Buah, Memori Kartu, Emosi) menampilkan layar yang sama ('Modul Interaktif Pilihan'). Modul lain hanya 1 soal, dan Dongeng hanya punya satu pilihan yang selalu benar.
- Hitungan sesi tidak akurat: modul menambah sesi saat dibuka (bukan saat selesai); balon dan tebak kata menambah hitungan di setiap jawaban benar lalu menambah lagi saat selesai.
- Koin bisa di-farming: jawaban benar yang sama pada modul dapat diklik berulang untuk +15 setiap kali.
- Diagnostik hanya membandingkan jumlah sesi. Jawaban salah tidak dicatat sehingga tidak ada akurasi, dan bar progres hanyalah sesi × 25%.
- Konten: soal APEL memakai petunjuk '\_ P P L E' (ejaan Inggris); pilihan pengecoh selalu A, E, T, M; hanya 4 soal dan urutannya tetap.
- 'Juara Minggu Ini' tidak punya reset mingguan. Timer balon tetap berjalan ketika pengguna pindah menu.

**Keamanan dan privasi**

- Leaderboard menampilkan email orang tua kepada semua pengguna.
- Nama dan email dimasukkan ke HTML lewat `innerHTML` tanpa sanitasi, sehingga berisiko XSS begitu data benar-benar dibagikan antar pengguna.
- Tidak ada persetujuan orang tua, kebijakan privasi, atau cara menghapus data.

**UX dan aksesibilitas**

- Anak PAUD belum bisa membaca, tetapi semua instruksi berupa teks; tidak ada narasi suara.
- Viewport mengunci zoom (`user-scalable=no`); tidak ada opsi mematikan suara atau animasi; timer tanpa mode santai.
- Emoji dipakai sebagai ilustrasi sehingga tampilannya berbeda di tiap perangkat.

**Teknis**

- Satu file ±1.100 baris dengan JS global dan HTML dalam string. Tailwind dan FontAwesome dari CDN (tidak bisa offline; Tailwind CDN tidak untuk produksi). Tidak ada build, test, atau pemisahan modul.

## 3. Tujuan, Non-Tujuan, dan Metrik

### Tujuan

1. Akun nyata dan data tersinkron antar perangkat.
2. Mesin game modular: game baru ditambah tanpa mengubah inti aplikasi.
3. Bank soal dikelola lewat CMS dan dipetakan ke domain kemampuan serta capaian pembelajaran.
4. Laporan orang tua berbasis akurasi dan tren, dengan saran tindak lanjut.
5. Aman untuk anak: leaderboard tanpa data pribadi, persetujuan orang tua, kepatuhan UU PDP.
6. Nyaman di HP Android kelas menengah dan koneksi tidak stabil (PWA, offline).

### Non-tujuan (rilis awal)

- Bukan pengganti kurikulum dan tidak menerbitkan nilai rapor.
- Tidak ada chat atau konten buatan pengguna antar anak.
- Tidak ada iklan atau pelacak pihak ketiga.
- Aplikasi native di toko aplikasi (dipertimbangkan v2 lewat wrapper).
- Bukan diagnosis klinis (disleksia, diskalkulia, dan sejenisnya); laporan hanya indikator belajar.

### Metrik keberhasilan (target awal, divalidasi saat pilot)

- Sesi selesai per anak aktif per minggu ≥ 4; completion rate sesi ≥ 80%.
- Retensi hari ke-7 ≥ 30%.
- ≥ 50% orang tua aktif membuka dashboard minimal sekali seminggu.
- Crash-free sessions ≥ 99,5%; LCP p75 ≤ 2,5 detik pada Android 4G.
- Skor kepuasan orang tua/guru (SUS) ≥ 70; penilaian anak (skala wajah) ≥ 4 dari 5.

## 4. Pengguna dan Persona

- **Anak (4–12 tahun)** — dibagi per band usia: PAUD (4–6), SD kelas 1–2 (Fase A), kelas 3–4 (Fase B), kelas 5–6 (Fase C). Butuh instruksi suara, tombol besar, umpan balik positif, sesi pendek 3–5 menit, tanpa hukuman.
- **Orang tua/wali** — pemilik akun; membuat profil anak, memantau progres, mengatur batas bermain. Butuh laporan yang mudah dipahami dan kontrol privasi.
- **Guru (v2)** — membuat kelas dengan kode undangan dan memantau banyak siswa.
- **Admin/editor konten** — mengelola bank soal, aset, dan publikasi.

## 5. Lingkup dan Prioritas

- **P0 (MVP, rilis pilot):** akun orang tua + profil anak + parent gate, peta petualangan, mesin game, Letus Balon, Tebak Kata, 8 modul yang sungguh dapat dimainkan, koin server-side, leaderboard mingguan aman, dashboard orang tua berbasis akurasi, CMS soal dasar, voice-over, PWA + offline dasar, persetujuan dan kebijakan privasi.
- **P1:** tingkat kesulitan adaptif, toko avatar dan lencana, batas waktu bermain harian, email ringkasan mingguan, ekspor laporan PDF, analitik produk.
- **P2:** Mode Kelas untuk guru, wrapper Android (Capacitor), bahasa tambahan, game baru, rekomendasi aktivitas offline yang lebih kaya, langganan sekolah.

## 6. Kebutuhan Fungsional

### 6.1 Akun, Profil, dan Parent Gate (P0)

- **FR-ACC-01** — Orang tua mendaftar/masuk dengan email + kata sandi, magic link, atau Google; email terverifikasi sebelum data anak disimpan.
- **FR-ACC-02** — Orang tua membuat 1–4 profil anak: nama panggilan, avatar (4 avatar prototipe diperluas), band usia, tahun lahir opsional.
- **FR-ACC-03** — Anak berganti profil lewat pemilih profil tanpa mengetik email (menggantikan modal 'Masuk Akun' yang meminta email dan nama).
- **FR-ACC-04** — Area Laporan Ortu, pengaturan, dan ganti akun dilindungi parent gate (PIN 4 digit atau soal hitung untuk dewasa).
- **FR-ACC-05** — Persetujuan eksplisit orang tua dicatat dengan versi dan waktu.
- **FR-ACC-06** — Orang tua dapat mengekspor dan menghapus seluruh data anak; penghapusan permanen paling lambat 30 hari.
- **FR-ACC-07** — Sesi login persisten per perangkat; ada opsi keluar dari semua perangkat.

### 6.2 Peta Petualangan dan Navigasi (P0)

- **FR-NAV-01** — Lima area navigasi dipertahankan; Ortu berada di balik parent gate.
- **FR-NAV-02** — Peta menampilkan pulau (Angka, Huruf, Usia Dini, dan seterusnya) dengan status progres, bintang 1–3 per game, dan tombol 'Lanjutkan' ke game terakhir.
- **FR-NAV-03** — Sapaan personal 'Halo, {nama panggilan}!' dan saldo koin selalu terlihat.
- **FR-NAV-04** — Setiap game punya URL yang bisa di-deep-link (misalnya /play/letus-balon).

### 6.3 Mesin Game dan Sesi (P0)

- **FR-GAME-01** — Semua game mengikuti kontrak yang sama: ambil soal, tampilkan, terima jawaban, beri umpan balik, ringkasan sesi. Game baru berarti komponen baru + konfigurasi, bukan perubahan inti.
- **FR-GAME-02** — Satu sesi 5–10 soal (Letus Balon berbasis waktu, dengan mode santai tanpa timer). Sesi berstatus berjalan, selesai, atau ditinggalkan; hitungan sesi hanya bertambah ketika selesai.
- **FR-GAME-03** — Setiap jawaban, benar maupun salah, dicatat sebagai attempt: soal, jawaban, benar/salah, waktu respons.
- **FR-GAME-04** — Soal diacak dari bank sesuai band usia dan kesulitan; pengecoh dibangkitkan dari data; tidak ada soal berulang dalam satu sesi.
- **FR-GAME-05** — Umpan balik selalu positif dan mendidik: jawaban salah memberi petunjuk dan kesempatan mencoba lagi, tanpa suara atau visual yang menghukum.
- **FR-GAME-06** — Anak bisa jeda atau keluar kapan saja; timer berhenti saat tab tidak aktif atau pengguna pindah halaman.
- **FR-GAME-07** — Layar ringkasan: skor, bintang, koin didapat, tombol 'Main lagi' dan 'Ke peta'.

### 6.4 Katalog Game dan Materi (P0)

- **Letus Balon Matematika** — penjumlahan dan pengurangan, level mengikuti band usia (perkalian dasar kelas 3+ di P1), 4 pilihan jawaban, mode waktu 45 detik dan mode santai.
- **Tebak Kata** — bank ≥ 100 kata Indonesia terkategori (hewan, buah, benda, alam); huruf hilang dibangkitkan dari data; ejaan baku (memperbaiki kasus APEL); ilustrasi + audio pelafalan.
- **M1 Mengenal Warna** — mencocokkan objek dengan warna; warna primer dan sekunder.
- **M2 Bentuk Geometri** — lingkaran, segitiga, persegi, bintang, dan lainnya; mode seret-dan-letakkan.
- **M3 Hitung Hewan Melompat** — berhitung 1–10 dengan irama/ketukan.
- **M4 Dongeng Nilai Moral** — cerita bercabang (jujur, tolong-menolong, berbagi) dengan beberapa pilihan; umpan balik menjelaskan nilainya, bukan sekadar benar/salah.
- **M5 Tebak Suara Satwa** — rekaman suara asli, pilih hewan, fakta singkat.
- **M6 Hitung Buah Segar** — kuantitas 1–10, lebih banyak/lebih sedikit.
- **M7 Memori Kartu** — papan kartu balik 2×2 sampai 4×4; langkah dicatat.
- **M8 Emosi dan Perasaan** — mengenali ekspresi (senang, sedih, marah, takut, tenang) dan mencocokkannya dengan situasi.
- **FR-CNT-01** — Semua instruksi memiliki voice-over Bahasa Indonesia dengan tombol putar ulang, agar anak yang belum lancar membaca tetap bisa bermain.
- **FR-CNT-02** — Setiap soal berlabel domain, band usia, kesulitan, dan kode Capaian Pembelajaran (Kurikulum Merdeka) yang relevan sebagai dasar laporan.

### 6.5 Koin dan Reward

- **FR-COIN-01 (P0)** — Koin dihitung server dari event attempt dan sesi; klien tidak pernah mengirim jumlah koin.
- **FR-COIN-02 (P0)** — Nilai awal mengikuti prototipe dan dapat dikonfigurasi (+5 balon, +10 kata, +15 modul per jawaban benar; bonus selesai +50 balon, +30 kata).
- **FR-COIN-03 (P0)** — Anti-farming: koin per soal hanya sekali per sesi, ada batas koin harian yang dapat diatur, bonus penyelesaian hanya bila sesi selesai.
- **FR-COIN-04 (P0)** — Semua perubahan saldo tercatat di ledger (alasan, sesi, waktu) agar dapat diaudit.
- **FR-COIN-05 (P1)** — Koin dapat ditukar item avatar/tema; lencana untuk streak harian dan pencapaian.

### 6.6 Leaderboard (P0)

- **FR-LB-01** — Peringkat mingguan berdasarkan koin yang diperoleh pada minggu itu; reset Senin 00:00 WIB; arsip minggu lalu tersedia.
- **FR-LB-02** — Hanya menampilkan nama panggilan, avatar, koin, dan jumlah sesi. Tidak pernah menampilkan email, nama lengkap, atau lokasi.
- **FR-LB-03** — Cakupan 'Kelompok' (lewat kode undangan) dan 'Semua' (opt-in orang tua). Default: kelompok sendiri.
- **FR-LB-04** — Top 10 plus posisi anak sendiri; pembaruan mendekati real-time (≤ 5 detik) lewat Realtime atau polling.
- **FR-LB-05** — Nama panggilan difilter dari kata tidak pantas dan semua keluaran disanitasi.

### 6.7 Dashboard Orang Tua dan Diagnostik (P0)

- **FR-DASH-01** — Ringkasan: total koin, sesi selesai (7 hari dan total), waktu bermain, streak hari.
- **FR-DASH-02** — Domain kemampuan: Numerasi, Literasi dan Kata, Warna dan Bentuk, Sosial-Emosional dan Karakter, Pengetahuan Alam (hewan), Memori (memperluas 3 bidang di prototipe).
- **FR-DASH-03** — Skor domain = akurasi pada 20 attempt terakhir, disertai tren (naik, turun, stabil) dan rata-rata waktu respons.
- **FR-DASH-04** — Aturan teks: 'Unggul' bila akurasi ≥ 80%, 'Perlu perhatian' bila < 60%, selainnya 'Berkembang'. Dengan kurang dari 10 attempt tampil 'Data belum cukup', bukan kesimpulan.
- **FR-DASH-05** — Setiap 'Perlu perhatian' disertai 1–2 saran aktivitas offline sederhana di rumah.
- **FR-DASH-06** — Ada pernyataan jelas bahwa laporan bukan diagnosis klinis.
- **FR-DASH-07** — Pengaturan: batas waktu bermain harian, mode santai default, suara, kelola profil dan persetujuan.
- **FR-DASH-08 (P1)** — Ringkasan mingguan via email dan ekspor PDF.

### 6.8 Admin dan CMS Konten (P0 dasar)

- **FR-CMS-01** — Peran admin/editor dengan login terpisah dari akun orang tua.
- **FR-CMS-02** — CRUD soal dan aset (gambar, audio) per game; alur draft, review, published; soal berversi.
- **FR-CMS-03** — Impor soal massal via CSV dan pratinjau soal persis seperti tampilan anak.
- **FR-CMS-04** — Panel sederhana: soal yang paling sering salah, waktu respons, soal yang perlu direvisi.

### 6.9 Audio, Aksesibilitas, dan Offline

- **FR-A11Y-01** — Tombol suara; efek sintetis prototipe dipertahankan sebagai fallback, ditambah musik latar lembut opsional.
- **FR-A11Y-02** — Menghormati `prefers-reduced-motion`; pembatasan zoom dihapus.
- **FR-A11Y-03** — Target sentuh ≥ 48 px, kontras teks minimal AA, semua gambar punya teks alternatif.
- **FR-OFF-01** — PWA dapat dipasang; aset dan soal terbaru di-cache sehingga game dapat dimainkan offline.
- **FR-OFF-02** — Attempt dan sesi offline masuk antrean lokal (IndexedDB) dan disinkronkan secara idempoten saat daring; server menang untuk saldo koin.

## 7. Kebutuhan Non-Fungsional

- **Performa:** JS awal ≤ 200 KB gzip; LCP p75 ≤ 2,5 detik di Android kelas menengah/4G; animasi mulus; API p95 ≤ 300 ms.
- **Skala:** desain awal untuk 5.000 anak aktif dan 200 permintaan/detik puncak, mudah dinaikkan.
- **Ketersediaan dan pemulihan:** ≥ 99,5% per bulan; backup harian; RPO ≤ 24 jam, RTO ≤ 4 jam.
- **Kompatibilitas:** Chrome/Edge Android 10+ (utama), Safari iOS 15+, Chrome desktop; lebar layar mulai 360 px; portrait dan landscape.
- **Keamanan:** HTTPS, otorisasi tingkat baris (RLS), validasi input di server, rate limit, proteksi XSS/CSRF, secret di environment, pemindaian dependensi, log audit aksi admin.
- **Kualitas:** TypeScript strict, lint, test unit untuk logika koin dan diagnostik (≥ 80%), test e2e alur kritis (daftar, main, koin, dashboard).
- **Observabilitas:** pemantauan error, metrik performa, log terstruktur.
- **Lokalisasi:** Bahasa Indonesia default; struktur i18n siap untuk bahasa lain.

## 8. Arsitektur dan Tech Stack

### 8.1 Rekomendasi

Pertimbangan: tim kecil, perlu cepat sampai pilot, Tailwind sudah dipakai di prototipe, target utama Android, dan butuh data relasional serta realtime.

- **Frontend:** Next.js (App Router) + React + TypeScript. Tailwind CSS dengan token warna prototipe di konfigurasi tema. Framer Motion untuk animasi, Zustand untuk state sesi game, TanStack Query untuk data server, lucide-react untuk ikon (bukan CDN).
- **PWA dan offline:** service worker (Serwist) + IndexedDB (Dexie) untuk antrean attempt.
- **Audio:** Howler.js untuk voice-over dan rekaman; Web Audio sintetis tetap untuk efek.
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security, Realtime, Storage) pada region Singapura. Logika koin dan diagnostik berupa fungsi Postgres atau Route Handler Next.js yang dapat diuji.
- **Admin/CMS:** rute /admin di aplikasi yang sama dengan kontrol peran.
- **Deploy dan operasi:** Vercel + Supabase, CI/CD GitHub Actions, Sentry untuk error, analitik produk ramah privasi tanpa pelacak iklan.
- **Testing:** Vitest + Testing Library, Playwright untuk e2e.

### 8.2 Alternatif yang dipertimbangkan

- **Backend kustom (NestJS + PostgreSQL + Prisma + Redis untuk leaderboard):** kontrol penuh dan bisa dihosting di dalam negeri bila dibutuhkan, tetapi pengembangan lebih lama. Cocok bila tim lebih kuat di backend atau ada tuntutan residensi data.
- **Vite + React SPA dengan API terpisah:** frontend lebih sederhana, tetapi kehilangan routing, SSR, dan optimasi bawaan Next.js.
- **React Native/Expo atau Flutter:** pengalaman native, tetapi menambah basis kode padahal versi web tetap diperlukan; ditunda ke v2 (wrapper Capacitor lebih murah).
- **Phaser/PixiJS:** hanya untuk game berfisika di P2; game MVP cukup komponen React dan animasi CSS/Framer Motion.

### 8.3 Struktur kode

- `app/` — rute: area anak (peta, game, materi, peringkat), area orang tua (dashboard, pengaturan), admin, auth.
- `games/{slug}/` — komponen game dan manifest (id, domain, band usia, aturan koin).
- `lib/` — engine sesi, koin, dan diagnostik sebagai fungsi murni yang mudah diuji; klien API; antrean offline.
- `db/` — migrasi dan seed (soal dari prototipe menjadi seed awal).

### 8.4 Alur data kritis

Anak menjawab, klien langsung menampilkan umpan balik, lalu attempt dikirim (atau masuk antrean offline) dengan `client_event_id`. Server memvalidasi, menyimpan, dan menghitung koin ke ledger. Saldo dan leaderboard diperbarui, snapshot kemampuan dihitung ulang secara asinkron, dan dashboard membaca snapshot tersebut.

## 9. Model Data (Entitas Utama)

- **parent** — id, email, pin_hash, consent_version, consent_at, created_at.
- **child_profile** — id, parent_id, nickname, avatar_id, age_band, birth_year (opsional), coins_balance, daily_limit_min, archived_at.
- **game** — id, slug, title, domain, min_age_band, config.
- **question** — id, game_id, domain, cp_code, age_band, difficulty, type, payload (JSON), media, status, version.
- **session** — id, child_id, game_id, started_at, ended_at, status, score, stars, coins_earned, device_id.
- **attempt** — id, session_id, question_id, answer, is_correct, response_ms, client_event_id (unik), created_at.
- **coin_ledger** — id, child_id, session_id, delta, reason, created_at.
- **skill_snapshot** — child_id, domain, accuracy, attempts_count, avg_ms, trend, computed_at.
- **leaderboard_group** dan **group_member**; **weekly_score** (view terjadwal tanpa data pribadi).
- P1: badge, child_badge, avatar_item, child_item. Pendukung: consent_log, audit_log.

Prinsip minimisasi data: tidak menyimpan nama lengkap, tanggal lahir penuh, foto, atau lokasi anak.

## 10. Garis Besar API

- `POST /auth/*` — daftar, masuk, keluar.
- `GET/POST /children`, `PATCH/DELETE /children/:id`.
- `GET /games/:slug/questions?band=&n=` — ambil soal.
- `POST /sessions`, `POST /sessions/:id/attempts` (idempoten), `POST /sessions/:id/complete`.
- `GET /children/:id/summary` — koin, streak, progres peta.
- `GET /children/:id/skills` — snapshot domain dan teks diagnostik.
- `GET /leaderboard?scope=group|all&week=`.
- `POST /me/export`, `DELETE /me` — ekspor dan hapus data.
- `/admin/questions`, `/admin/assets` — CMS.

Kontrak ini menjadi acuan, terlepas dari apakah diimplementasikan sebagai RPC atau Route Handler.

## 11. Panduan UX/UI

- Pertahankan merek: Poppins, palet prototipe, kartu membulat, avatar/maskot, dan tagline.
- Bangun sistem desain kecil (tombol besar, kartu, modal, toast umpan balik) dengan token warna dan radius di tema Tailwind.
- Ganti emoji dengan ilustrasi konsisten untuk konten utama; emoji boleh tetap untuk avatar sampai set ilustrasi siap.
- Anak mencapai game dalam maksimal 2 ketukan dari beranda; teks sesingkat mungkin, selalu didampingi ikon dan suara.
- Area orang tua visual dan tenang, terpisah jelas dari area anak.
- Wireframe dan prototipe Figma disiapkan sebelum implementasi.

## 12. Privasi, Keamanan, dan Kepatuhan

- UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi mengatur bahwa pemrosesan data anak dilakukan secara khusus dan memerlukan persetujuan orang tua/wali. Rancangan ini menerapkan persetujuan eksplisit, minimisasi data, serta hak ekspor dan hapus. Disarankan ditinjau ahli hukum sebelum rilis publik; dokumen ini bukan nasihat hukum.
- Tidak ada iklan, pelacak pihak ketiga, atau fitur sosial bebas antar anak.
- Leaderboard membaca dari view khusus tanpa kolom pribadi; data kontak orang tua dipisahkan dari data permainan anak lewat kebijakan akses.
- Kebijakan privasi dan syarat layanan dalam Bahasa Indonesia yang mudah dipahami.
- Prosedur penanganan insiden kebocoran data dan backup terenkripsi.
- Setiap soal ditinjau secara pedagogis oleh guru PAUD/SD sebelum dipublikasikan.

## 13. Rencana Rilis (Estimasi: 2–3 Developer + 1 Desainer)

- **Fase 0, Discovery dan desain (±2 minggu):** validasi persona, wireframe, sistem desain, bank soal awal dari prototipe.
- **Fase 1, Fondasi (±3 minggu):** repo, CI/CD, auth, profil anak, parent gate, skema DB, komponen dasar.
- **Fase 2, Mesin game (±3 minggu):** kontrak game, sesi dan attempt, koin server, Letus Balon dan Tebak Kata versi baru.
- **Fase 3, Modul dan konten (±4 minggu):** 8 modul, voice-over, CMS dasar, seed soal.
- **Fase 4, Laporan dan peringkat (±3 minggu):** snapshot kemampuan, dashboard orang tua, leaderboard mingguan.
- **Fase 5, PWA, hardening, pilot (±3 minggu):** offline, performa, keamanan, uji coba dengan ±30–50 anak di 1–2 sekolah atau komunitas, lalu perbaikan.

Total ±18 minggu sampai pilot. Ini estimasi kasar dan perlu disesuaikan dengan ukuran serta keahlian tim.

## 14. Risiko dan Mitigasi

- **Konten terlalu sedikit, anak cepat bosan** — CMS dan impor CSV sejak awal; target ≥ 30 soal per game sebelum pilot.
- **Produksi ilustrasi dan audio lambat** — prioritaskan voice-over; emoji sebagai fallback sementara.
- **Game terlalu sulit atau tidak menarik** — uji dengan anak sejak Fase 2; mode santai; kesulitan adaptif di P1.
- **Kepatuhan data anak** — privasi sejak desain, minimisasi data, tinjauan hukum.
- **Ketergantungan pada satu vendor BaaS** — skema SQL standar, logika bisnis di fungsi yang bisa dipindah, ekspor database berkala.
- **Koneksi buruk** — PWA offline dan payload kecil.
- **Scope creep** — disiplin P0/P1/P2; perubahan lingkup lewat revisi PRD.
- **Diagnostik disalahartikan orang tua** — bahasa hati-hati, ambang data minimum, disclaimer jelas.

## 15. Asumsi dan Pertanyaan Terbuka

**Asumsi:** pengguna utama anak 4–12 tahun di Indonesia; orang tua pemilik akun; produk gratis pada tahap pilot; tim pengembang kecil.

**Pertanyaan terbuka:**

1. Fokus utama di rumah (orang tua) atau di kelas (guru)? Jawabannya menentukan prioritas Mode Kelas.
2. Model bisnis: gratis, donasi, atau langganan sekolah?
3. Rentang usia final dan kelas SD yang dicakup?
4. Siapa yang menyediakan ilustrasi, rekaman suara, dan reviu pedagogis?
5. Berapa anggaran hosting, dan apakah ada kebutuhan data tersimpan di dalam negeri?
6. Tim paling kuat di stack apa (JavaScript/TypeScript, PHP/Laravel, Python, lainnya)? Ini dapat mengubah rekomendasi pada Bab 8.

## Lampiran A — Pemetaan Prototipe ke Target

- Modal 'Masuk Akun' (email, nama, avatar) → auth orang tua, pemilih profil anak, parent gate.
- localStorage `gembira_students_v3` → tabel child_profile, session, attempt, coin_ledger.
- Event `storage` lintas tab → Realtime/polling dari server.
- Peta 3 pulau → peta dinamis dari katalog game dan progres.
- Letus Balon dan Tebak Kata → game mandiri dengan soal dari bank soal.
- `launchInteractiveModule(1–8)` → 8 game terpisah, masing-masing dengan bank soal.
- `renderLeaderboard()` → leaderboard mingguan aman tanpa data pribadi.
- Logika diagnostik di `updateUI()` → skill_snapshot dan aturan teks berbasis akurasi.
- `playTone()` dan `playSuccessSound()` → lapisan audio (efek sintetis + rekaman).

# Tadika Ceria — Sistem Pengurusan Tadika (SPEC)

## Apa aplikasi ini
Demo-ready kindergarten management SPA, **100% frontend, TIADA BACKEND**. Semua data dalam
`localStorage` melalui repository layer. UI sepenuhnya **Bahasa Malaysia**.

Stack sebenar: **React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui (base-nova)**,
react-router-dom, recharts, sonner. (Pengguna minta Next.js App Router — pod ini tidak
menyediakan runtime Next.js, jadi struktur route/folder mencerminkan pokok App Router supaya
port ke Next.js + NestJS kemudian adalah mekanikal. Lihat "Spec deviation" di bawah.)

Backend FastAPI template masih ada tetapi **tidak digunakan sama sekali** — tiada panggilan
`/api` dari frontend.

## Lapisan data (localStorage)
- `src/lib/storage/keys.ts` — semua kunci (`tc_*`)
- `src/lib/storage/storage.ts` — read/write/commit/subscribe, `ensureSeed()`, `resetDemoData()`
- `src/lib/storage/seed.ts` — seed data demo (`tc_seeded_v1`)
- `src/lib/storage/repositories/*.ts` — students, parents, teachers, classes, attendance,
  dailyLogs, incidents, invoices, payments, notifications, announcements, calendar,
  activityLogs, users, settings. Semua ikut API `getX/getXById/createX/updateX/deleteX`.
- Reaktiviti: setiap mutasi memanggil `commit()`; komponen panggil `useStore()` (hooks/useStore.ts)
  untuk re-render. Bukan TanStack Query (tiada HTTP).
- Data **persistent** melalui refresh & logout/login. Dipadam hanya oleh pengguna atau
  "Reset Data Demo" (Tetapan).

## Peranan & routing
`ADMIN` → `/admin`, `TEACHER` → `/teacher`, `PARENT` → `/parent`.
`components/layout/RoleGuard.tsx` menghalang akses URL peranan lain (redirect ke portal sendiri).
Sesi disimpan di `tc_session` (`src/lib/auth.ts`).

- Admin: desktop-first, sidebar + topbar (`AdminLayout`). Routes: index, students, students/:id,
  registration, teachers, parents, classes, attendance, billing, calendar, announcements,
  reports, activity-log, settings.
- Guru: mobile-first, bottom nav (`MobileLayout role="TEACHER"`). Routes: index, attendance,
  daily-log, incidents, calendar, notifications, profile.
- Ibu Bapa: mobile-first (`MobileLayout role="PARENT"`). Routes: index, child, attendance,
  daily-log, billing, calendar, announcements, notifications, profile.

## Model data utama (src/types/index.ts)
Student (status pending/approved/rejected, documents[], kesihatan, kecemasan), Parent (studentIds[]),
Teacher (classId), Class (teacherId), Attendance (hadir/tidak_hadir/lewat/cuti + checkIn/checkOut),
DailyLog (breakfast/lunch/milk/nap/activities/mood/note), Incident (rendah/sederhana/tinggi),
Invoice (draf/belum_dibayar/sudah_dibayar/tertunggak/dibatalkan), Payment (receiptNumber, method),
AppNotification (targetRoles, read), Announcement (audience semua/guru/ibu_bapa/kelas),
CalendarEvent (8 jenis), ActivityLogEntry, AppSettings.

## Aliran utama
1. **Login** `/login` — 3 butang quick-login + borang email/kata laluan.
2. **Guru**: Kehadiran satu-ketik (4 status) → daftar masuk/keluar auto-masa → Rekod Harian
   (bottom sheet bertab: Makanan, Susu, Tidur, Aktiviti, Perasaan, Catatan) → Lapor Insiden.
   Menyimpan rekod harian menghantar pemberitahuan kepada ibu bapa.
3. **Ibu bapa**: Kad anak + Ringkasan Hari Ini + **Garis Masa Harian** (dijana dari
   attendance + dailyLog oleh `deriveTimeline`) → Bil → **simulasi bayaran** (pilih kaedah →
   "Memproses bayaran..." 1.8s → resit) → status bil jadi Sudah Dibayar, resit boleh
   cetak/muat turun.
4. **Admin**: Papan pemuka (kad ringkasan, carta recharts, kewangan, perkara perlu perhatian,
   aktiviti terkini) → CRUD murid/guru/ibu bapa/kelas → pendaftaran (lulus/tolak) →
   jana bil bulanan → kalendar CRUD → pengumuman ikut audience → laporan (6 jenis,
   cetak + muat turun CSV) → log aktiviti → tetapan + Reset Data Demo.

## Seed data (selepas `ensureSeed()`)
- 3 kelas: Melur (cl-melur), Mawar, Cempaka
- 4 guru (Cikgu Sarah Ahmad = tc-sarah, kelas Melur), 14 ibu bapa
- 15 murid: 14 `approved`, 1 `pending` (Amir Rayyan). Kelas Melur ada 6 murid termasuk
  **Muhammad Adam Hakimi (st-adam)** — anak akaun ibu bapa demo.
- Kehadiran 14 hari ke belakang (hari bekerja); Adam hadir hari ini, daftar masuk 08:12.
- Rekod harian hari ini untuk Adam (lengkap: sarapan, susu, tidur, 3 aktiviti, mood gembira,
  catatan guru), Aina, Faiz, Harith. Faiz & murid lain Kelas Melur sengaja belum lengkap.
- Bil: 3 bulan setiap murid aktif. 3 murid tertunggak (Faiz, Irfan, Qistina).
  Adam ada bil bulan semasa **belum_dibayar RM 500.00**.
- 4 insiden, 4 pengumuman, 9 acara kalendar, 9 pemberitahuan, 8 log aktiviti.

## Nota pelaksanaan penting
- **Toast offset**: `main.tsx` memasang `<Toaster richColors offset={{bottom:'24px'}} mobileOffset={{bottom:'84px'}} />`.
  Sonner 2.0.7 menggunakan `mobileOffset` berasingan di bawah 600px (lalai 16px) — tanpa ini toast
  duduk atas bar navigasi bawah (h-16) dan menelan ketikan nav. Jangan buang offset ini.
- **testid navigasi mobile**: diterbitkan daripada `item.id` eksplisit (`home`, `attendance`,
  `daily-log`, `incidents`/`billing`, `calendar`) → `parent-nav-home`, `teacher-nav-daily-log`, dll.
- Nama kelas dalam data sudah mengandungi perkataan "Kelas" (cth. "Kelas Melur") — jangan tambah
  awalan "Kelas" dalam UI, ia menghasilkan "Kelas Kelas Melur".

## Spec deviation (diisytiharkan, bukan bug)
- **Next.js App Router → React 19 + Vite SPA**: runtime Next.js tiada pada pod ini. Struktur
  route & folder (`lib/storage/repositories`, route tree per peranan) mengikut spesifikasi asal.
- Muat naik dokumen = **simulasi metadata** (tiada fail sebenar), seperti diminta.
- Bayaran = **simulasi penuh** tanpa payment gateway, seperti diminta.
- "Muat Turun" resit menjana fail HTML; laporan menjana CSV (tiada penjana PDF dalam skop demo).

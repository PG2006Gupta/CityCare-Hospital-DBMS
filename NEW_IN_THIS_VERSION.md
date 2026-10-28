# City Care Hospital — what's new in this version (v2)

Seven upgrades requested for the frontend. All of them are **already built in** —
you do not have to code anything. Just re-download the ZIP, replace your old
folder, restart `python server.py` and press **Ctrl+F5** in Chrome.

---

## CHANGELOG

- **Latest — bug fix:** the appearance menu could show "Dark mode" ticked while the site was
  actually in light mode. It was reading a stale value saved at page load. The menu now always
  highlights the theme currently in use (and shows a ✓), including after switching themes or
  reloading. "Follow my system" also reacts live to a Windows theme change.
- **Earlier:** removed the two long explanation cards ("How to explain this in the viva" / "Normalisation") from the ER Diagram page — it is now diagram-only, as requested. Added a "Download PNG" button there. The full normalisation write-up still lives in the Word report (chapter 7).
- **Also earlier:** removed the standalone Date & Time page; the real live clock is now in the header of every page.

---

## 1. Bigger text

Every `font-size` in `styles.css` is now `calc(Npx * var(--tscale))`.
The default scale is **1.12** (12% larger than before).

- Click the **A＋** button in the top-right corner to cycle
  **Normal → Large → Extra-large**.
- Or set `textSize: "normal" | "large" | "xlarge"` in `frontend/config.js`.
- Your choice is remembered in the browser (`localStorage`).

## 2. Coloured typography (no more plain black text)

Page titles and breadcrumbs use an indigo → violet → teal **gradient**.
KPI numbers cycle through five colours, table headers, card subtitles, chart
values and sidebar section labels are tinted with the accent colour.

- Turn it off with `colourfulText: false` in `frontend/config.js`.
- The accent colour itself is `accent: "#4f46e5"` in the same file.

## 3. Dark mode toggle

The **☾** button (top right) opens a menu with three choices:

| Choice | Meaning |
|---|---|
| ☀ Light mode | white cards (default) |
| ☾ Dark mode | dark navy surfaces, light text |
| ◐ Follow my system | uses your Windows/Chrome colour scheme |

Implemented with CSS variables (`--surface`, `--ink`, `--line`, …) in the
`html[data-theme="dark"]` block at the end of `styles.css`. No duplicate
stylesheet. Saved in `localStorage`, applied by an inline script in
`<head>` **before** the CSS loads, so there is no white flash on refresh.

## 4. Custom City Care Hospital logo

A hand-built vector logo: a **medical cross** with an **ECG / heartbeat
monitor trace** running through it, on an indigo → cyan gradient tile.

| File | Use |
|---|---|
| `frontend/logo.svg` | favicon + sidebar brand mark |
| `frontend/logo_full.svg` | logo with "City Care HOSPITAL" wordmark |
| `submission/logo.png` | 512 × 512 PNG for Word / PPT |
| `submission/logo_full.png` | PNG wordmark for the report cover |

The DOCX report cover and the first PPT slide now include the logo.
All four files are downloadable from the **Downloads** page.

## 5. Beds / Rooms page (left sidebar → HOSPITAL)

`GET /api/rooms` runs:

```sql
SELECT r.RoomNo, r.RoomType, r.ChargesPerDay, r.Status,
       dp.DeptName, p.FullName AS Patient, p.BloodGroup,
       d.FullName AS Doctor, ad.Diagnosis, ad.AdmitDate,
       julianday(date('now','localtime')) - julianday(ad.AdmitDate) AS DaysStayed
FROM ROOM r
LEFT JOIN DEPARTMENT dp ON r.DeptID = dp.DeptID
LEFT JOIN ADMISSION  ad ON ad.RoomID = r.RoomID AND ad.Status='Admitted'
LEFT JOIN PATIENT     p ON ad.PatientID = p.PatientID
LEFT JOIN DOCTOR      d ON ad.DoctorID  = d.DoctorID
ORDER BY r.RoomNo;
```

Shows 15 room cards, filter buttons (All / Occupied / Available /
Maintenance / ICU), the **patient currently in each bed**, their blood group,
diagnosis, doctor, phone, days stayed and running room bill, plus a full
SQL register table. The **LEFT JOIN** is important — an INNER JOIN would hide
every empty bed.

## 6. Live real-world date & time in the header (every page)

There is **no separate Date & Time page** — you asked to keep only the header
clock, so that is exactly what this version does.

- On **every** page, the top bar shows your real local time (`HH:MM:SS`), the
  weekday, the date, and your detected time zone (e.g. `Asia/Kolkata`).
- Uses `new Date()` and `Intl.DateTimeFormat().resolvedOptions().timeZone`
  to detect your time zone automatically — nothing is hardcoded.
- `setInterval(tickClocks, 1000)` refreshes it every second.
- Hover the clock for a tooltip with the full date, UTC offset (e.g.
  `UTC+05:30`) and the ISO 8601 UTC timestamp.
- `showHeaderClock: false` in `frontend/config.js` hides it if you ever want to.

## 7. Upcoming / Ongoing appointments

`GET /api/appointment_views?date=&time=&patient=` builds four SQL buckets:

| Bucket | SQL condition |
|---|---|
| **Ongoing** | `AppDate = :d AND Status='Scheduled' AND AppTime > :s AND AppTime <= :t` (a 60-minute consultation slot containing the clock time) |
| **Upcoming** | `Status='Scheduled' AND (AppDate > :d OR (AppDate = :d AND AppTime > :t))` |
| **Today** | `AppDate = :d` |
| **Past** | `AppDate < :d OR Status IN ('Completed','Cancelled','No Show')` |

The Appointments page has tabs with live counts, a **patient dropdown** (so you
can see one patient's upcoming / ongoing appointments), status chips, and an
adjustable **clinic clock** (date + time inputs). Two buttons:

- **◉ Use my real time** — uses your actual local date/time and refreshes
  every 30 seconds.
- **↺ Demo clock** — resets to 27 Oct 2026, 11:05 (the seed data date).

> Why a separate clinic clock? The sample data is fixed around 27 Oct 2026 so
> queries like "appointments today" always return rows for your viva. The
> header clock still shows your **real** time. Drag the clinic clock time
> and watch rows move from *Upcoming* → *Ongoing* → *Past* — all done by SQL,
> not JavaScript tricks.

---

## Also updated

- Seed data: deterministic demo-day appointments + 4 distinct currently
  admitted patients (183 appointments, 155 bills, 86 prescription detail
  rows). All 36 queries still pass.
- Backend: generic safe static-file route, `/api/rooms`,
  `/api/appointment_views`, patient filter on `/api/appointments`.
- Word report (13 screens, logo on cover) and 12-slide PPT regenerated.
- `README.md`, `HOW_TO_RUN.md`, `START_HERE.txt`, `SUBMISSION.md` updated.


---

## 8. 3D rotating logo watermark (latest addition)

The `logo.png` you asked about is now used as a **real 3D figure** floating
faintly behind **every page** — not a flat tiled image.

**How it is built (pure CSS, no libraries, works offline):**

- `frontend/index.html` contains a 6-face cube: front and back faces show
  `frontend/logo.png`, the four side faces are gradient plates.
- `transform-style: preserve-3d` + `perspective: 1400px` in `styles.css`
  make it a genuine 3D object. `@keyframes wmSpin` rotates it continuously
  around the Y axis (with a fixed X tilt so you see the top face).
- `pointer-events: none` on `.wm-stage` means it can never block a click,
  a button, a table row or the SQL editor.
- `mix-blend-mode: multiply` in light mode / `screen` in dark mode keeps it
  readable as a watermark. Print stylesheet hides it completely.
- A soft radial glow and a ground shadow give it depth.
- Preferences are applied by an inline `<head>` script **before** the CSS
  loads, so there is no flash of the wrong state on refresh.

**The ◈ button in the top bar opens a control panel:**

| Control | Options |
|---|---|
| Show / hide | ON / OFF |
| Rotation speed | Normal (22s) → Fast (11s) → Slow (36s) → Manual (stopped) |
| Strength | Faint (6%) / Normal (11%) / Strong (20%) |
| Size | Small (230px) / Medium (330px) / Large (440px) |
| Follow mouse | Cube leans toward your cursor (parallax tilt) |
| Manual angle slider | Drag 0°–360° to pose the logo by hand |

All settings persist in `localStorage` under `cc_wm`. Defaults can also be set
in `frontend/config.js` (`watermark`, `watermarkSpeed`, `watermarkStrength`,
`watermarkSize`, `watermarkMouse`).

> Files: `frontend/logo.png` (the image served at `/logo.png`),
> `frontend/index.html` (cube markup), `frontend/styles.css` (3D CSS),
> `frontend/app.js` (`initWatermark()` controller).

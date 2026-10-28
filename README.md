# City Care Hospital — Full-Stack DBMS Final Project

**Hospital / Clinic Management System** built as a real **frontend + backend** application.
No npm, no pip packages, no API keys, no internet required.

---

## 0. What you already have

This folder is a **complete submission pack**, not just code:

- ✅ working **frontend** (13 screens, vanilla JS SPA)
- ✅ working **backend** (Python REST API + SQLite, no dependencies)
- ✅ real **database** (10 tables, 183 appointments, 36 verified queries)
- ✅ `submission/CityCare_Project_Report.docx` — a full Word report, already written,
  with placeholders where you paste your screenshots
- ✅ `submission/CityCare_Presentation.pptx` — 12 ready slides
- ✅ `SUBMISSION.md` — screenshot checklist, report structure, demo script, 20 viva questions

You only need to: fill in your name/roll number, paste screenshots, and practise the demo.

---

## 1. Run it (one command)

```bash
cd hospital_project/fullstack
python3 server.py
```

Then open **http://localhost:8000**.

Requires **Python 3.8+** only (uses `http.server` and `sqlite3` from the standard library).
On first run the backend creates `database/hospital.db` by executing
`database/schema.sql` then `database/seed.sql`.

> On Linux/Mac use `python3`; on Windows use `python`. Port can be changed with
> `PORT=8080 python3 server.py`.

If you ever break the database, click **↻ Reset DB** in the SQL Console (or
`POST /api/reset`) — it rebuilds everything from the two `.sql` files.

---

## 2. Architecture (this is what you explain in the viva)

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND  (frontend/index.html + app.js + styles.css)       │
│  Vanilla-JS SPA · hash routing · fetch('/api/...')           │
│  13 screens · charts · tables · SQL editor · ER diagram      │
└───────────────────────────┬─────────────────────────────────┘
                            │  JSON over HTTP (same origin)
┌───────────────────────────▼─────────────────────────────────┐
│  BACKEND  (server.py · Python stdlib http.server)            │
│  REST API · parameterised SQL · transaction control         │
│  static file server · CSV export · query verification       │
└───────────────────────────┬─────────────────────────────────┘
                            │  sqlite3 driver
┌───────────────────────────▼─────────────────────────────────┐
│  DATABASE  (database/hospital.db · SQLite)                  │
│  10 tables · 13 FKs · 3 views · 3 triggers · 6 indexes      │
│  30 patients · 14 doctors · 183 appointments · 155 bills    │
└─────────────────────────────────────────────────────────────┘
```

**Key point:** the frontend contains **zero data**. Every number, row and chart
comes from an SQL query executed by the backend. That is what makes it a DBMS
project rather than a website with hardcoded JSON.

---

## 3. File structure

```
fullstack/
├── server.py                     BACKEND — REST API + static server (Python stdlib)
├── HOW_TO_RUN.md                 ⭐ step-by-step VS Code setup guide
├── NEW_IN_THIS_VERSION.md        ⭐ the 7 new frontend features explained
├── .vscode/launch.json           F5 run configuration for VS Code
├── run_windows.bat              double-click launcher (Windows)
├── run.sh                        convenience start script (Mac/Linux)
├── START_HERE.txt                quick 4-step summary
├── README.md                     this file
├── SUBMISSION.md                 what to give your teacher + viva script
├── Hospital_Project_Prompt_Pack.md   AI prompts (reference / extra)
├── submission/                   READY-TO-EDIT DELIVERABLES
│   ├── CityCare_Project_Report.docx   full Word report (63 headings, 36 queries)
│   ├── CityCare_Presentation.pptx     12-slide PowerPoint
│   ├── er_diagram.png                 ER diagram as an image
│   ├── logo.png                       custom hospital logo (512×512)
│   └── logo_full.png                  logo + wordmark for the report cover
├── database/
│   ├── schema.sql                DDL: tables, keys, constraints, views, triggers, indexes
│   ├── seed.sql                  realistic Indian sample data
│   ├── queries.sql               36 SQL queries, each with a plain-English question
│   └── hospital.db               the generated SQLite database (created on first run)
└── frontend/
    ├── index.html                SPA shell + sidebar navigation
    ├── config.js                 ⭐ one-file customisation (name, colour, sizes, theme)
    ├── styles.css                design system: scalable type, colours, dark mode
    ├── app.js                    router + 13 page renderers + SQL console
    ├── logo.png                  ⭐ custom hospital logo (PNG used by the 3D watermark)
    ├── logo.svg                  ⭐ custom hospital logo (vector)
    ├── logo_full.svg             logo + wordmark (vector)
    └── er_diagram.svg            ER diagram (embedded in the app, printable)
```

---

## 3b. NEW in this version (v2)

| Request | Where it is |
|---|---|
| Bigger text | Every `font-size` in `styles.css` is `calc(Npx * var(--tscale))`; the **A＋** button in the top bar cycles Normal / Large / Extra-large. Default = 12% bigger. |
| Coloured typography | Gradient page titles + breadcrumbs, coloured KPI numbers, coloured table headers and section labels. Toggle with `colourfulText` in `config.js`. |
| Dark mode toggle | **☾ / ☀** button top-right → Light / Dark / Follow system. Stored in `localStorage`; all surfaces use CSS variables. |
| Custom logo | `frontend/logo.svg` (cross + ECG heartbeat trace), `logo_full.svg` wordmark, PNG versions in `submission/`. Used as favicon, sidebar brand, Project Info and report cover. |
| Beds / Rooms page | `#/rooms` → `GET /api/rooms`: 15 rooms, occupancy KPIs, filterable cards and a full register joined to the **patient currently admitted** (doctor, diagnosis, days stayed, running bill). |
| Live header date & time | The **top bar of every page** shows real local time (`HH:MM:SS`), weekday, date and your auto-detected time zone, ticking every second from the browser `Date` object + `Intl.DateTimeFormat().resolvedOptions().timeZone`. Hover for full date, UTC offset and ISO timestamp. No separate Date & Time page — removed as requested. |
| 3D rotating logo watermark | `frontend/logo.png` on a 6-face CSS 3D cube behind every page; the **◈** button controls on/off, speed, strength, size, follow-mouse and a manual angle slider. Preferences persist in `localStorage`; print stylesheet hides it. |
| Upcoming / Ongoing appointments | `GET /api/appointment_views` builds SQL `WHERE` clauses with a 60-minute slot. Tabs: All / Ongoing now / Upcoming / Today / Past, a patient dropdown, and an adjustable **clinic clock** (demo time or your real local time). |

Because the sample data is anchored to **27 Oct 2026**, the Appointments page has its own
clinic clock (default 11:05) so *Ongoing* always has rows. The **header clock** always
shows your **real** date and time — no hardcoded demo value.

---

## 4. The database

### Tables
`DEPARTMENT`, `DOCTOR`, `PATIENT`, `ROOM`, `APPOINTMENT`, `ADMISSION`,
`MEDICINE`, `PRESCRIPTION`, `PRESCRIPTION_DETAIL`, `BILL`

### Relationships (13 foreign keys)
```
DEPARTMENT ─1:M→ DOCTOR          PATIENT ─1:M→ APPOINTMENT
DEPARTMENT ─1:M→ ROOM            DOCTOR  ─1:M→ APPOINTMENT
PATIENT    ─1:M→ ADMISSION       DOCTOR  ─1:M→ ADMISSION
ROOM       ─1:M→ ADMISSION       APPOINTMENT ─1:1→ PRESCRIPTION
PATIENT    ─1:M→ PRESCRIPTION    DOCTOR  ─1:M→ PRESCRIPTION
PATIENT    ─1:M→ BILL            PRESCRIPTION ─1:M→ PRESCRIPTION_DETAIL
MEDICINE   ─1:M→ PRESCRIPTION_DETAIL
```

**Two M:N relationships, correctly resolved by junction tables:**
- DOCTOR ↔ PATIENT → **APPOINTMENT**
- PRESCRIPTION ↔ MEDICINE → **PRESCRIPTION_DETAIL**

### Constraints & advanced objects
- `PRIMARY KEY` on all 10 tables; `UNIQUE` on DeptName, RoomNo, doctor/patient phone+email,
  `UNIQUE(DoctorID, AppDate, AppTime)` (prevents double booking), `UNIQUE(AppID)` in PRESCRIPTION,
  `UNIQUE(PrescID, MedicineID)` in the junction table.
- `CHECK` on gender, status fields, fees, stock, days, discharge date.
- `ON DELETE CASCADE` / `ON DELETE RESTRICT` / `ON UPDATE CASCADE` + `PRAGMA foreign_keys = ON`.
- **Views:** `v_doctor_schedule`, `v_available_rooms`, `v_patient_spend`, plus `v_doctor_revenue` (Q25).
- **Triggers:** room status on admission/discharge; automatic medicine stock reduction on prescription.
- **Generated (derived) columns:** `BILL.NetAmount`, `PRESCRIPTION_DETAIL.LineTotal`.
- **Indexes:** on appointment date/patient, bill patient+date, prescription medicine, patient name.

---

## 5. The 36 queries (`database/queries.sql`)

| Group | # | Concepts |
|---|---|---|
| A. Simple SELECT | 4 | WHERE, BETWEEN, IN, LIKE, DISTINCT, ORDER BY, calculated columns, date functions |
| B. Aggregates | 3 | COUNT/SUM/AVG/MIN/MAX, GROUP BY, HAVING |
| C. Joins | 5 | 2-table & 3-table INNER JOIN, LEFT JOIN anti-join, self-join |
| D. Subqueries | 6 | scalar, correlated, IN, EXISTS, UNION |
| E. M:N & business | 7 | 4-table join, top-N, low stock, expiry, monthly trend, occupancy, length of stay |
| F. Views & indexes | 3 | CREATE VIEW, view usage, EXPLAIN QUERY PLAN |
| G. Transactions & DML | 4 | BEGIN/COMMIT/ROLLBACK, UPDATE, DELETE, ALTER |
| H. Validation & complex | 4 | integrity audit, 2nd-highest, top-3 spend, department report, parameterised search |

**All 36 are verified automatically:** open SQL Console → **"✓ Verify all 36"**.
The backend runs them against a temporary copy of the database, so your live data is untouched.

---

## 6. Screens (11)

| # | Screen | SQL demonstrated |
|---|---|---|
| 1 | Dashboard | 5 KPI cards (scalar subqueries) + 4 charts (GROUP BY, joins, SUM) |
| 2 | Patients | parameterised LIKE, correlated subqueries, CSV export |
| 3 | Doctors | INNER JOIN + LEFT JOIN + COUNT + GROUP BY |
| 4 | Appointments | 4-table INNER JOIN, status/date filters |
| 5 | Book Appointment | **ACID transaction** — appointment + bill, ROLLBACK on error, UNIQUE constraint |
| 6 | Billing & Revenue | generated column, conditional aggregation, monthly GROUP BY |
| 7 | Pharmacy | CASE expression, date arithmetic, trigger side-effects |
| 8 | **SQL Console** ⭐ | all 36 queries, live editor, result grid, EXPLAIN plan, verify-all, reset |
| 9 | Schema / Dictionary | `sqlite_master`, `PRAGMA table_info`, `PRAGMA foreign_key_list` |
| 13 | ER Diagram | Clean full-page SVG/PNG diagram with colour legend (no extra text) |
| 11 | Downloads | every `.sql`, `.db`, `.svg` and source file for submission |

Every data screen has a collapsible **"SQL behind this screen"** panel showing the exact SQL used.

---

## 7. REST API (for the report's "implementation" chapter)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health`, `/api/meta` | DB status, table counts |
| GET | `/api/dashboard` | KPIs + 4 charts + recent appointments |
| GET | `/api/patients?q=` | patient register (parameterised search) |
| GET | `/api/doctors` | doctors with department + visit counts |
| GET | `/api/appointments?status=&date=&patient=` | filtered 4-table join |
| GET | `/api/rooms` | all 15 rooms LEFT JOINed to the current admitted patient |
| GET | `/api/appointment_views?date=&time=&patient=` | SQL Upcoming / Ongoing / Today / Past buckets + counts |
| GET | `/api/book/options` | dropdown data |
| POST | `/api/book` | **transaction**: insert appointment + bill |
| GET | `/api/billing`, `/api/pharmacy` | reports + inventory |
| GET | `/api/queries` | the 36-query bank |
| POST | `/api/sql` | run arbitrary SQL (used by SQL Console) |
| POST | `/api/queries/verify` | execute all 36 on a temp DB copy |
| GET | `/api/schema`, `/api/er` | data dictionary, ER diagram |
| GET | `/api/export?table=X` | CSV download |
| POST | `/api/reset` | rebuild database |

All user input goes through `?` placeholders (`sqlite3` parameter binding) — never string
concatenation. This prevents SQL injection; the code comments say so explicitly.

---

## 8. If your teacher wants MS Access

Keep this app as the "software" component, then:

1. Open MS Access → **Blank desktop database** → save as `CityCare.accdb`.
2. Import the 10 tables (External Data → Import, or recreate from `schema.sql` in Design View).
3. **Database Tools → Relationships**: drag each PK to its FK and tick
   **Enforce Referential Integrity**, Cascade Update, Cascade Delete where appropriate.
4. Create → Query Design → **SQL View**: paste each query from `queries.sql` (one statement per
   saved query object) and save as `Q01`…`Q36`.
5. Add 3 **Forms** (patient entry, appointment booking, medicine entry) and 3 **Reports**
   (appointments by doctor, monthly revenue, low-stock medicines).
6. Screenshot the Relationships window and put it in the report.

Dialect conversion notes are in `Hospital_Project_Prompt_Pack.md` §9
(`TOP` vs `LIMIT`, `#dates#`, `IIf` vs `CASE`, `DateDiff`, `AUTOINCREMENT`, etc.).

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError` | None needed — the app uses only the Python standard library |
| Port 8000 busy | `PORT=8080 python3 server.py` |
| Blank page | Check the browser console; make sure you opened `http://localhost:8000/` and not the `.html` file directly |
| SQL Console error after a bad query | Click **↻ Reset DB** |
| Changes not showing | Hard-refresh (Ctrl+Shift+R) — the server sends `Cache-Control: no-store` |
| Charts empty | Reset the database; seed data may have been deleted by a `DELETE` query |
| Need a fresh copy | Delete `database/hospital.db` and restart `server.py` |

---

## 10. Why this scores well

- Real relational schema with keys, constraints, referential integrity and normalisation (not a flat JSON store).
- 36 queries covering the entire DBMS syllabus, all executable and verifiable in-app.
- Advanced objects: views, triggers, generated columns, indexes, transactions, query plans.
- A working front end that proves every screen is SQL-driven — plus an SQL Console the examiner can use.
- Zero external dependencies: runs offline on any college lab PC.

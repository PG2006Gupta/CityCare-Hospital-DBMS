# Hospital / Clinic Management System — Vibe-Coding Prompt Pack

**Your brief:** a *simple software project with SQL used in it*, built on a vibe-coding website, for a DBMS final project.

**The one idea that will get you top marks:** don't build just another hospital dashboard. Build a hospital dashboard **that shows its own SQL**. Add a **"SQL Console / Query Lab"** page (a textarea where you type real SQL, press Run, and see the result table), plus a small **"SQL behind this screen"** panel on every page. Suddenly your "software project" is also undeniable proof of database work — exactly what a DBMS examiner wants to see. Everything else (login, charts, forms) is decoration.

---

## 0. What to build (scope in one paragraph)

A **City Care Hospital** web app with 8–10 screens, backed by a **real relational database** (10 tables, 13 foreign keys, 3 views, 3 triggers, indexes, 175+ sample rows). Every number on every screen must come from an SQL query — no hardcoded JSON arrays. Include one page that displays and executes the 36 SQL queries from your practical file. Keep the front end simple but polished. That's it. That is a complete, defensible DBMS project.

> ✅ **You do NOT need** login/auth, payments, email, AI features, real-time chat, or deployment to a domain. Those add risk and zero DBMS marks. Add them only if everything else is done.

---

## 1. Pick your vibe-coding tool (read this first)

The tool decides what "SQL" means in your project. This is the most important technical choice.

| Path | Tools | Stack to request | DB reality | Verdict |
|---|---|---|---|---|
| **A — Full-stack, real SQL file** ⭐ | **Replit Agent**, Cursor, Windsurf, Claude Code, Google AI Studio / Firebase Studio, Emergent | Python (Flask or Streamlit) + SQLite **or** Node/Express + SQLite | A genuine `hospital.db` file on disk. Teacher can open it in DB Browser for SQLite. All 36 queries work as written. | **Best for DBMS marks.** Easiest to explain in viva. Works offline. |
| **B — Beautiful React UI, SQL in the browser** | **Lovable, Bolt.new, v0 (Vercel), Tempolabs, Base44** | React + TypeScript + Tailwind + **sql.js** (SQLite compiled to WebAssembly) | Real SQLite engine running inside the browser tab. Loads `schema.sql` + `seed.sql` at startup, keeps the DB in memory, and can **export a `.sqlite` file**. Works offline, no API keys. | **Best-looking UI.** Slightly harder; use the Path-B prompts in §6. |
| **C — React UI + hosted Postgres** | Lovable / Bolt + **Supabase** (or Neon) | React + TypeScript + Tailwind + Supabase JS client | A real PostgreSQL database in the cloud with Row Level Security and an SQL editor. | Impressive, but needs an account, internet in the lab, and API keys. Risky on submission day. |
| **D — No front-end required** | MS Access / MySQL Workbench | — | — | Only if your teacher changes the brief. See the general workflow file. |

**My recommendation:** if your vibe tool can run a backend (Replit Agent, Cursor, Emergent), take **Path A**. If you've already fallen in love with Lovable/Bolt/v0, take **Path B with sql.js** — it is genuinely the best of both worlds, and it means you can still hand your teacher a real `.sqlite` database file.

> ⚠️ **The #1 vibe-coding trap:** the AI quietly builds the whole app with data in a JavaScript array (`const patients = [...]`) and calls it a "database". That is an instant fail for a DBMS subject. Prompt 0 below contains an explicit guardrail against this. Check the generated code for `const patients =` / `mockData` / `localStorage.setItem('patients'` — if you see them as the *primary* data store, your database is fake.

---

## 2. Files to give the AI before you prompt

I've already built these for you. Upload/attach all of them to your vibe-coding tool, then say **"Read all attached files before you write any code."**

| File | What it gives the AI |
|---|---|
| `schema.sql` | The exact 10-table DDL: PKs, FKs, CHECK, UNIQUE, views, triggers, indexes |
| `seed.sql` | 175 appointments, 30 patients, 14 doctors, 22 medicines, 157 bills — realistic Indian data |
| `queries.sql` | 36 ready-made SQL queries, each with a plain-English question |
| `er_diagram.svg` | The ER diagram to show in the app and print in your report |
| `app.py` | A **working reference implementation** — the AI can copy its SQL and page structure |
| `Hospital_Project_Prompt_Pack.md` | This file |

If your tool can't attach files, paste `schema.sql` and `queries.sql` into the chat and say "use this schema exactly".

---

## 3. The 10 screens to ask for

| # | Screen | SQL concepts it proves |
|---|---|---|
| 1 | **Dashboard** — 5 KPI cards + 3 charts | Scalar subqueries, GROUP BY, date functions, SUM |
| 2 | **Patients** — searchable table, patient detail | SELECT, LIKE with parameters, correlated subqueries |
| 3 | **Doctors** — cards/table with department filter | INNER JOIN, LEFT JOIN with COUNT, GROUP BY |
| 4 | **Appointments** — filter by status/date, 4-table join | 3-table/4-table joins, ORDER BY, WHERE |
| 5 | **Book Appointment** — form → INSERT | **Transaction** (appointment + bill), parameterised queries, UNIQUE constraint |
| 6 | **Billing & Revenue** — bills list + monthly revenue | Generated/derived columns, conditional aggregation, HAVING |
| 7 | **Pharmacy / Inventory** — low-stock + near-expiry alerts | CASE, date arithmetic, trigger side-effects |
| 8 | **SQL Console / Query Lab** ⭐ — query bank + editor + results + query plan | **Everything**: 36 queries, EXPLAIN, views, triggers, transactions |
| 9 | **Schema & Data Dictionary** — table structures, FKs, row counts | `sqlite_master`, `PRAGMA table_info`, `PRAGMA foreign_key_list` |
| 10 | **ER Diagram** — embedded SVG + relationship explanation | Cardinality, M:N resolution, normalisation |

Optional extras only if time permits: admit/discharge patient (room trigger), prescription writer (M:N insert), CSV export, print-friendly report.

---

## 4. PROMPT 0 — the master prompt (paste this first)

> Replace the bracketed stack line with **Path A** or **Path B** below. Keep everything else exactly as-is.

```text
You are building a college DBMS final-year project called "City Care Hospital —
Hospital/Clinic Management System". I am a student; the examiner will grade the
DATABASE work, not just the UI. Build a clean, modern, fully working web app.

=== STACK (choose ONE, delete the other) ===
PATH A: Python 3 + Flask (Jinja templates, no build step) + SQLite (stdlib sqlite3).
        No external Python packages beyond Flask. Run with `python app.py` on port 8000.
PATH B: React + TypeScript + Vite + Tailwind CSS + sql.js (SQLite WASM).
        Load schema.sql and seed.sql from /public at startup into sql.js.
        Provide an "Export database" button that downloads hospital.sqlite.
=========================================

=== DATABASE — NON-NEGOTIABLE ===
I have attached schema.sql, seed.sql and queries.sql. READ THEM FIRST.
- Use these 10 tables EXACTLY: DEPARTMENT, DOCTOR, PATIENT, ROOM, APPOINTMENT,
  ADMISSION, MEDICINE, PRESCRIPTION, PRESCRIPTION_DETAIL, BILL.
- Create hospital.db (Path A) / an in-memory sql.js DB (Path B) by executing
  schema.sql then seed.sql at first run. Include a "Reset database" button.
- Enable foreign keys: PRAGMA foreign_keys = ON.
- EVERY value shown in the UI must come from an SQL query. No hardcoded arrays,
  no mock data, no localStorage as the primary store, no fake random charts.
- Use parameterised queries (placeholders, never string concatenation) for all
  user input. Mention SQL-injection prevention in a code comment.
- Keep a single module `db.py` (Path A) / `src/lib/db.ts` (Path B) that centralises
  query execution and exposes a `runSQL(sql)` function returning {columns, rows, error}.
- Keep all 36 queries from queries.sql in a `QUERY_BANK` array with fields
  {id, group, title, sql} so the SQL Console can list and run them.

=== SCREENS (left sidebar navigation) ===
1. Dashboard: 5 KPI cards (patients, doctors, appointments today, occupied rooms,
   total billed) + bar charts: monthly appointments, visits by department,
   top prescribed medicines, revenue by payment mode.
2. Patients: searchable/sortable table with name, age, blood group, city, phone,
   last visit (correlated subquery), visit count and total spend.
3. Doctors: table/cards with department, specialisation, qualification, fee,
   appointment count and status badge.
4. Appointments: filter chips by status + date picker, table with 4-table join
   (patient + doctor + department), colour-coded status badges.
5. Book Appointment: form with patient dropdown, doctor dropdown, date, time slot,
   reason. On submit run a TRANSACTION that inserts into APPOINTMENT and BILL
   (BEGIN / INSERT / INSERT / COMMIT; ROLLBACK on any error). Show the exact SQL
   that ran and a success or error message. Let the UNIQUE(DoctorID,AppDate,AppTime)
   constraint reject double bookings with a friendly message.
6. Billing & Revenue: all bills with gross/discount/tax/net, payment mode, paid
   status; monthly revenue chart; total + pending dues KPIs.
7. Pharmacy: inventory table with REORDER / OK badge, low-stock count and
   medicines expiring within 90 days. Explain the stock-reducing trigger.
8. SQL Console (MOST IMPORTANT PAGE): a textarea editor, a "Run query" button,
   a results table, a searchable left panel listing all 36 queries grouped by
   category (click loads the SQL into the editor), an error display, and a
   "Reset database" button. Also show EXPLAIN QUERY PLAN for one query.
9. Schema & Data Dictionary: for each table show column name, type, PK, NOT NULL,
   default, foreign keys and row count, read from sqlite_master/PRAGMA.
10. ER Diagram: render er_diagram.svg inline, plus a short written explanation of
    the 1:M relationships, the two M:N relationships resolved by junction tables,
    and the derived attributes.

=== "SQL BEHIND THIS SCREEN" ===
On screens 1-7 and 9, add a collapsible dark code panel at the bottom titled
"SQL behind this screen" showing the actual SQL used to produce that page's data,
copied verbatim from the code. This is how I prove to my teacher that I used SQL.

=== DESIGN ===
Modern hospital admin dashboard: dark navy left sidebar, white content area,
indigo/blue accent, rounded cards with subtle shadows, clean data tables with
hover states, coloured status pills, CSS bar charts (no chart library needed),
responsive down to mobile, empty states and error states everywhere.
Use Indian context: ₹ for money, DD/MM/YYYY display dates, cities like Mohali,
Kharar, Chandigarh, Ludhiana. App title: "City Care Hospital".
Include a small badge in the header: "● LIVE SQL DATABASE".

=== DELIVERABLES ===
- All source files, a README.md with setup + run instructions and a screenshot list.
- A /downloads page (or section) offering schema.sql, seed.sql, queries.sql and
  hospital.db / hospital.sqlite as downloadable files.
- Do NOT add authentication, payments, email, external APIs or AI features.
- Do NOT use placeholder/lorem-ipsum text anywhere.

Build the whole app now. After building, list which SQL queries power each screen,
and tell me exactly how to run it.
```

---

## 5. Incremental prompts (use these instead of Prompt 0 if you prefer step-by-step)

Vibe tools often produce better results when you build in small steps. Paste **one at a time**, in order. Each one assumes the previous step is working.

**P1 — Scaffold + database**
```text
Create the project skeleton for "City Care Hospital" using [PATH A / PATH B stack].
First implement ONLY the database layer: execute the attached schema.sql then
seed.sql to build a SQLite database with foreign keys enabled, and create a
`runSQL(sql)` helper that returns {columns, rows, error} and handles both
SELECT and DDL/DML/transaction scripts. Add a health-check page that prints
the 10 table names with their row counts. Do not build any UI yet.
Verify: 175 rows in APPOINTMENT, 30 in PATIENT, 157 in BILL.
```

**P2 — Layout + design system**
```text
Now build the app shell: dark navy left sidebar with 10 navigation links
(Dashboard, Patients, Doctors, Appointments, Book Appointment, Billing,
Pharmacy, SQL Console, Schema, ER Diagram), a white content area, a page title,
a "● LIVE SQL DATABASE" badge, and the shared CSS design system (cards, tables,
status pills, buttons, form fields, bar charts). Use React/Tailwind or Jinja/CSS
as chosen. Add placeholder page bodies for now. Make it responsive.
```

**P3 — Dashboard**
```text
Build the Dashboard: 5 KPI cards and 4 bar charts. Use exactly these queries:
- KPI: SELECT (SELECT COUNT(*) FROM PATIENT), (SELECT COUNT(*) FROM DOCTOR),
  (SELECT COUNT(*) FROM APPOINTMENT WHERE AppDate='2026-10-27'),
  (SELECT COUNT(*) FROM ROOM WHERE Status='Occupied'),
  (SELECT ROUND(SUM(NetAmount),2) FROM BILL);
- Monthly appointments: SELECT strftime('%Y-%m',AppDate), COUNT(*) FROM
  APPOINTMENT GROUP BY 1 ORDER BY 1;
- Visits by department: DEPARTMENT LEFT JOIN DOCTOR LEFT JOIN APPOINTMENT,
  GROUP BY department.
- Top medicines: PRESCRIPTION_DETAIL JOIN MEDICINE, SUM(Qty) GROUP BY medicine.
- Revenue by mode: SELECT PaymentMode, SUM(NetAmount) FROM BILL GROUP BY 1.
Add a collapsible "SQL behind this screen" panel showing these queries.
```

**P4 — Patients & Doctors**
```text
Build Patients and Doctors screens. Patients: search input filtering by name /
city / blood group with parameterised LIKE, plus a correlated subquery for
LastVisit and TotalSpend. Doctors: INNER JOIN DEPARTMENT and LEFT JOIN
APPOINTMENT with COUNT, grouped by doctor, with a status pill. Both need
sortable tables, empty states, and the "SQL behind this screen" panel.
```

**P5 — Appointments + booking transaction**
```text
Build the Appointments screen (status filter chips + date filter + 4-table join)
and the Book Appointment form. The form must insert into APPOINTMENT and BILL
inside ONE transaction using BEGIN/COMMIT with ROLLBACK on error, using ?
placeholders for every value. Display the exact SQL executed. Handle the
UNIQUE(DoctorID, AppDate, AppTime) violation with a friendly "This doctor is
already booked at that time" message.
```

**P6 — Billing & Pharmacy**
```text
Build Billing & Revenue (bill table + monthly revenue chart + total/pending KPIs,
using the generated NetAmount column and conditional aggregation) and Pharmacy
(inventory with REORDER badge using CASE, low-stock count using
StockQty < ReorderLevel, near-expiry list using date('2026-10-27','+90 day')).
Add a note explaining the AFTER INSERT trigger that reduces medicine stock.
```

**P7 — SQL Console (the most important prompt)**
```text
Build the SQL Console page. Left panel: searchable, grouped list of all 36
queries from queries.sql with their ID and plain-English title — clicking one
loads its SQL into the editor. Right panel: a textarea SQL editor, a "Run query"
button that calls runSQL() and renders the result as a table with column headers,
a success/error message, a row count, a "Reset database" button, and a button
that runs EXPLAIN QUERY PLAN on a sample query to show index usage.
It must handle multi-statement scripts (BEGIN; INSERT; INSERT; COMMIT;).
```

**P8 — Schema & ER diagram**
```text
Build the Schema & Data Dictionary page: for each table show columns (name, type,
PK, NOT NULL, default) from PRAGMA table_info, foreign keys from
PRAGMA foreign_key_list, and row counts; also list views, triggers and indexes
from sqlite_master. Then build the ER Diagram page with er_diagram.svg embedded
inline and a short written explanation of 1:M relationships, M:N resolution and
derived attributes.
```

**P9 — Guardrail sweep (paste this near the end, always)**
```text
Do a correctness sweep before we finish:
1. Delete ALL hardcoded/mock data arrays. Every record must come from SQL.
2. Confirm foreign keys are ON and the DB is built from schema.sql + seed.sql.
3. Confirm all user inputs use parameterised queries.
4. Confirm every screen has loading, empty and error states.
5. Confirm the "SQL behind this screen" panel shows the real query used.
6. Confirm the SQL Console can run all 36 queries without errors — actually
   execute them all and fix any that fail.
7. Remove unused dependencies, dead code and placeholder text.
8. Write README.md with run instructions, the ER diagram, the query list and
   a 5-minute demo script.
Report what you changed.
```

**P10 — Polish**
```text
Polish the UI: consistent spacing, hover/focus states, tooltips on icons,
number formatting with ₹ and thousands separators, DD/MM/YYYY dates, printable
bill/report view, and CSV export for every table. Keep it fast and do not add
new features. Make sure it works at 1280px and 375px widths.
```

**P11 — Deployment / handover**
```text
Make the app trivially runnable on any laptop with no API keys and no internet:
one command to start, one command to reset the database. Add a /downloads page
that serves schema.sql, seed.sql, queries.sql, er_diagram.svg and the .db file.
Write a short SUBMISSION.md listing exactly which files to give the teacher.
```

---

## 6. Tool-specific prompt variants

### 6A. Replit Agent / Cursor / Windsurf / Claude Code (Path A — recommended)

Append this to Prompt 0:

```text
ENVIRONMENT NOTES:
- Use only Python standard library + Flask. Do not require npm, pip packages,
  Docker, or external services. `python app.py` must start everything.
- Store the database at ./hospital.db (a real file, committed to the repo).
- Bind the server to 0.0.0.0 on port 8000 so the Replit preview works.
- Put all SQL in db.py as named constants; never inline SQL in templates.
- Add requirements.txt (just `Flask==3.0.3`) and a fallback note: if Flask is
  missing, the app still works using http.server (see attached app.py for a
  zero-dependency reference implementation).
- Create run.sh: `python3 app.py`.
```

### 6B. Lovable / Bolt.new / v0 (Path B — sql.js)

Append this to Prompt 0:

```text
ENVIRONMENT NOTES — you are a browser-only app, so there is no server:
- Add `sql.js` (SQLite compiled to WebAssembly). Put schema.sql and seed.sql in
  /public and fetch them at startup. Initialise: initSqlJs({locateFile: ...}),
  new SQL.Database(), db.run(schemaSQL), db.run(seedSQL).
- Write a `src/lib/db.ts` wrapper with `runSQL(sql)` returning
  {columns, rows, error}. db.exec() returns [{columns, values}].
- Persist changes across reloads by exporting the DB to Uint8Array and saving in
  IndexedDB (not localStorage — it's too small). Provide "Reset database" and
  "Export hospital.sqlite" buttons that download db.export().
- Parameterised queries: use db.prepare(sql), stmt.bind(params), stmt.step(),
  stmt.getAsObject(), stmt.free(). Never interpolate user input into SQL text.
- Multi-statement scripts (BEGIN; INSERT; ...; COMMIT;) must be split on ";" at
  statement boundaries and executed one at a time; skip lines starting with "--".
- All 36 queries in queries.sql must work in sql.js. Note: sql.js supports
  generated columns, triggers, views, EXPLAIN QUERY PLAN and julianday().
- Use shadcn/ui components if available (Table, Card, Badge, Button, Tabs,
  Dialog, Select). Use Tailwind for layout. Use recharts ONLY if already
  installed; otherwise pure CSS bars are fine.
- Do not call any external API, Supabase, or localhost backend. The app must
  work completely offline after the first load.
```

> ⚠️ With Lovable in particular, the AI will try to connect Supabase because that's its default. If you want Path B, repeat twice: **"No Supabase. Use sql.js, fully offline."**

### 6C. If you choose Supabase (Path C)

```text
Use Supabase (PostgreSQL) as the database. Create the tables by running the SQL
from schema.sql in the Supabase SQL editor — convert AUTOINCREMENT to
GENERATED ALWAYS AS IDENTITY, and keep the generated columns (PostgreSQL supports
GENERATED ALWAYS AS (...) STORED). Enable RLS with a permissive policy for the
anon key because this is a demo. Put the project URL and anon key in .env.
Use the Supabase JS client for reads, but ALSO build an "SQL Console" page that
uses a Postgres RPC function `run_readonly_query(sql text)` limited to SELECT
statements, so the teacher can see real SQL. Provide a `supabase/schema.sql`
file and instructions to run it in the SQL editor. Warn me that this needs
internet in the lab.
```

### 6D. v0 / shadcn-specific design prompt

```text
Design language: linear/vercel-inspired clinical dashboard. Background #f8fafc,
cards white with 1px #e2e8f0 border and 12px radius, primary indigo #4f46e5,
sidebar #0f172a. Use shadcn Table, Card, Badge, Button, Input, Select, Tabs,
Dialog, Tooltip. Status badges: Completed/Paid/OK = green, Scheduled = blue,
Pending/No Show = red, Partial = amber. Numbers use tabular-nums and ₹ prefix.
Add a skeleton loading state for every table. No gradients on text, no emoji
overload, no glassmorphism.
```

---

## 7. Guardrail & debugging prompts

**If the AI faked the data:**
```text
I found hardcoded data in the app (e.g. `const patients = [...]`, mockData.ts,
or localStorage.setItem). This is a DBMS project — that is not acceptable.
Replace ALL of it with SQL queries against the SQLite database. Keep the same UI,
but every row must come from runSQL(). Show me the diff and confirm no mock data
remains anywhere in src/.
```

**If SQL errors appear:**
```text
The app throws: [PASTE THE EXACT ERROR AND THE STACK TRACE HERE].
Diagnose the root cause, fix ONLY that bug, and explain in 3 lines what was wrong.
Also run all 36 queries from queries.sql against the current database and report
any that fail, with the corrected SQL. Do not rewrite unrelated files.
```

**If the AI breaks working code while adding a feature:**
```text
Your last change broke [SCREEN NAME]. Revert only that change, keep everything
else, then re-implement the feature in a smaller step. Before and after, run the
app and confirm these 3 URLs still return 200: /, /sql, /schema.
```

**If the UI looks generic / AI-generated:**
```text
Make this look like a real hospital product, not a template: replace placeholder
copy with specific medical wording, use realistic Indian names and ₹ prices,
add meaningful empty states ("No appointments on this date"), show today's date
in the header, add units/labels to every chart, and remove any lorem ipsum,
"Lorem", "John Doe", "Sample text" or duplicated cards.
```

**If it's getting too big / running out of credits:**
```text
Stop adding features. Freeze the scope at the 10 screens we have. Spend the
remaining effort on: (1) making sure all 36 SQL queries run, (2) the "SQL behind
this screen" panels, (3) the README, (4) fixing bugs. Delete anything unfinished.
```

---

## 8. Proving the SQL to your teacher (this is the whole game)

Do these 10 things and your viva is basically done:

1. **SQL Console demo** — open the page, run Q14 (correlated subquery), Q18 (4-table join), Q28 (transaction). Show the result tables.
2. **Show the actual DB file** — `hospital.db`. Open it in **DB Browser for SQLite** and show the 10 tables + Browse Data.
3. **Show the Relationships** — in Access, the Relationships window; in SQLite, the Schema page with FK list. Prove "Enforce Referential Integrity" is on.
4. **Show a constraint failing** — try to insert an appointment with `PatientID = 999`, or double-book a doctor. Screenshot the error.
5. **Show a trigger working** — insert a `PRESCRIPTION_DETAIL` row and show `MEDICINE.StockQty` dropping automatically.
6. **Show a transaction** — book an appointment and show BOTH the appointment and the bill appearing; then change COMMIT to ROLLBACK and show both disappearing.
7. **Show `EXPLAIN QUERY PLAN`** — Q27, and explain what an index does.
8. **Show normalisation** — 1NF → 3NF using `PRESCRIPTION_DETAIL` (partial dependency) and `DOCTOR → DEPARTMENT` (transitive dependency).
9. **Show the ER diagram** — printed and on screen, with cardinalities and the two junction tables.
10. **Show 36 queries with output screenshots** in the practical file — group them exactly as `queries.sql` does.

---

## 9. SQL dialect conversion (teacher mentioned MS Access / SQL)

Your `schema.sql` and `queries.sql` are written in **SQLite** (very close to standard SQL). If your teacher wants **MS Access** or **MySQL**, use this conversion table — and put it in your report as a "portability" section (examiners love it).

| Feature | SQLite (our files) | MS Access | MySQL / MariaDB |
|---|---|---|---|
| Auto-increment PK | `INTEGER PRIMARY KEY AUTOINCREMENT` | `COUNTER` / `AUTOINCREMENT` in Design View | `INT AUTO_INCREMENT PRIMARY KEY` |
| Top N rows | `LIMIT 5` | `SELECT TOP 5 ...` | `LIMIT 5` |
| 2nd highest | `LIMIT 1 OFFSET 1` | `SELECT TOP 1 ... WHERE col < (SELECT MAX(col)...)` | `LIMIT 1 OFFSET 1` |
| String wildcard (default) | `%` and `_` | `*` and `?` (ANSI-89) / `%` in ANSI-92 mode | `%` and `_` |
| Date literals | `'2026-10-27'` | `#2026-10-27#` | `'2026-10-27'` |
| Date difference | `julianday(d2)-julianday(d1)` | `DateDiff('d', d1, d2)` | `DATEDIFF(d2, d1)` |
| Month extraction | `strftime('%Y-%m', d)` | `Format(d,'yyyy-mm')` | `DATE_FORMAT(d,'%Y-%m')` |
| Add days | `date('2026-10-27','+90 day')` | `DateAdd('d',90,#2026-10-27#)` | `DATE_ADD('2026-10-27', INTERVAL 90 DAY)` |
| Conditional | `CASE WHEN ... END` | `IIf(condition, a, b)` (no CASE) | `CASE WHEN ... END` |
| Derived column | `GENERATED ALWAYS AS (...) VIRTUAL` | compute in a query / calculated field in a form | `GENERATED ALWAYS AS (...) STORED` |
| Boolean | `0 / 1` | `Yes/No` field, `True/False` | `TINYINT(1)` |
| `IF NOT EXISTS` | supported | **not supported** | supported |
| Views | `CREATE VIEW` | saved SELECT query (Query Design) | `CREATE VIEW` |
| Triggers | `CREATE TRIGGER` | **Data Macros** (table events) | `CREATE TRIGGER` with `DELIMITER` |
| Stored procedures | **not available** | **not available** | `CREATE PROCEDURE` |
| `FULL OUTER JOIN` | 3.39+ | **not available** (use UNION of LEFT+RIGHT) | **not available** |
| `INTERSECT` / `EXCEPT` | supported | **not available** | 8.0+ (INTERSECT/EXCEPT) |
| `GRANT / REVOKE` | n/a (file permissions) | user-level security (legacy) | supported |
| Multiple statements | `executescript()` | **one statement per query object** | Workbench supports many |
| Referential integrity | `PRAGMA foreign_keys=ON` | Relationships window → tick "Enforce Referential Integrity" | `FOREIGN KEY ... REFERENCES` (InnoDB) |

**Access-specific advice:** if you must submit `.accdb`, keep the SQLite app as your "software project" and ALSO import the tables into Access (External Data → Import from ODBC/text), recreate relationships in the Relationships window, save the 36 queries as named query objects (SQL View, one statement each), and add 3 Forms + 3 Reports. That satisfies both the "software" and the "MS-Access" conditions.

---

## 10. Turning the app into your project report (screenshot list)

Take these screenshots — they become 80% of your practical file:

- [ ] Dashboard (KPIs + charts) — 1 full page
- [ ] "SQL behind this screen" panel expanded — 2 pages
- [ ] Patients table with search result — 1
- [ ] Doctors table with department join — 1
- [ ] Appointments 4-table join with status badges — 1
- [ ] Book Appointment form + success message + transaction SQL — 2
- [ ] Constraint violation error (double booking / orphan FK) — 1
- [ ] Billing revenue chart + bills table — 1
- [ ] Pharmacy REORDER alerts — 1
- [ ] **SQL Console with Q18 result** — 1 (hero screenshot)
- [ ] SQL Console with Q28 transaction result — 1
- [ ] SQL Console with Q27 EXPLAIN QUERY PLAN — 1
- [ ] Schema / data dictionary page — 1
- [ ] ER diagram page — 1 (also print full-size)
- [ ] DB Browser for SQLite showing tables + data — 1
- [ ] Downloads page / file list — 1

Then write the report using the structure in `../DBMS_Project_Workflow.md` (§4, Step 12). Map it like this:

| Report chapter | Comes from |
|---|---|
| ER diagram | `er_diagram.svg` + app's ER page |
| Relational schema + data dictionary | `schema.sql` + app's Schema page |
| Normalisation | `PRESCRIPTION_DETAIL` and `DOCTOR→DEPARTMENT` examples |
| SQL implementation (25–36 queries) | `queries.sql` + SQL Console screenshots |
| Forms / reports | App screens 2–7 + billing CSV/print |
| Testing | constraint/trigger/transaction screenshots |
| Appendices | `schema.sql`, `seed.sql`, `queries.sql`, source code |

---

## 11. Five-minute demo script (practise this twice)

1. **(0:00)** "Sir, this is City Care Hospital. It's a hospital management system built on a real relational database — 10 tables, 13 foreign keys, 3 views, 3 triggers." → show Schema page.
2. **(0:45)** "Here's the ER diagram. DOCTOR–PATIENT is many-to-many, resolved by APPOINTMENT; PRESCRIPTION–MEDICINE is many-to-many, resolved by PRESCRIPTION_DETAIL." → show ER page.
3. **(1:30)** "All tables are in 3NF — for example, DeptName is not repeated inside DOCTOR." → show Schema page FK list.
4. **(2:00)** "Every screen runs SQL. Here's the dashboard with scalar subqueries and GROUP BY charts." → expand "SQL behind this screen".
5. **(2:45)** "This is the SQL Console with all 36 queries. Let me run a 4-table join, then a correlated subquery." → run Q18 then Q14.
6. **(3:30)** "Here's a transaction: booking an appointment inserts into APPOINTMENT and BILL atomically. Watch the trigger reduce medicine stock when I add a prescription line." → run Q28 and show pharmacy.
7. **(4:15)** "Here's referential integrity — inserting an invalid PatientID is rejected." → show error screenshot.
8. **(4:45)** "The database file itself is here, openable in DB Browser. And here's the ER diagram and the .sql scripts." → show Downloads.

---

## 12. Pitfalls with vibe coding (learn from other students' mistakes)

| Mistake | Fix |
|---|---|
| AI stores data in a JS array / localStorage and calls it a database | Guardrail prompt in §7. Grep the repo for `mockData`, `const patients = [` |
| AI connects Supabase by default and you have no keys | Say "fully offline, sql.js, no Supabase" twice |
| AI "improves" the schema (renames tables, drops FKs) | Say "use the attached schema.sql EXACTLY; do not redesign it" |
| Queries use MySQL syntax that fails in SQLite (or vice versa) | Tell it which dialect; paste the error and ask for that dialect only |
| Everything works in preview but breaks after deploy | Deploy only if needed. Prefer a local run: `python app.py` |
| Too many features, nothing finished | Use P11 — freeze scope, finish SQL Console first |
| AI deletes earlier working code | Ask for small steps; commit/download a copy after each successful step |
| No screenshots, no report | Take screenshots as you build, not the night before |
| Can't explain the code in viva | Use the "explain in 3 lines" debugging prompt; read `queries.sql` twice |
| Fake/garbage data (abc, test, 123) | Use the provided `seed.sql` — realistic Indian names, dates and ₹ amounts |

---

## 13. Final checklist before submission

- [ ] App runs with one command, offline, no API keys
- [ ] 10 tables exist with PKs, FKs, CHECK, UNIQUE constraints and referential integrity ON
- [ ] 175 appointments / 30 patients / 157 bills of realistic sample data
- [ ] All 36 queries in `queries.sql` execute without error
- [ ] SQL Console page works (this is your differentiator)
- [ ] "SQL behind this screen" panel on every data screen
- [ ] At least one transaction, one trigger demo, one constraint-violation demo, one EXPLAIN plan
- [ ] ER diagram printed + data dictionary + normalisation write-up
- [ ] Practical file / report with query-wise screenshots
- [ ] PPT (10–12 slides) + 5-minute demo rehearsed
- [ ] Backup: `.db` + `.sql` + source code on Google Drive AND a pen drive
- [ ] You can answer: 1NF/2NF/3NF, joins, WHERE vs HAVING, view vs table, trigger, ACID, index, SQL injection

---

### You already have a working reference

I built the complete Path-A app for you in this folder. Run `python3 app.py` and open `http://localhost:8000` to see exactly what your vibe-coded version should look like — including the SQL Console, the 36-query bank, the ER diagram and the transaction demo. You can also show this reference to the AI and say: **"Build something that looks and works like app.py, but in [React + sql.js / Flask + SQLite]."**

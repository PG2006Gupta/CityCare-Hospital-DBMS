# SUBMISSION GUIDE — City Care Hospital (DBMS Final Project)

Use this as the last chapter of your practical file / project report, and as your
checklist on submission day.

---

## A. Files to hand in

Put everything in one folder named `DBMS_Project_<YourRollNo>/` and zip it.

```
DBMS_Project_<RollNo>/
├── fullstack/                 ← the complete working project (source code)
│   ├── server.py
│   ├── frontend/  (index.html, app.js, styles.css, config.js, logo.svg, er_diagram.svg)
│   └── database/  (schema.sql, seed.sql, queries.sql, hospital.db)
├── CityCare_Project_Report.docx    ← already written; fill name + paste screenshots, export PDF
├── CityCare_Presentation.pptx      ← 12 ready slides, already made
├── screenshots/                    ← all screenshots listed below
└── SQL_Queries_Output.pdf          ← optional: 36 queries with SQL + output screenshots
```

> The `.docx` and `.pptx` are already generated in `fullstack/submission/`.
> Open the Word file, replace `< Your Name >` / `< Your Roll No. >` on the cover and
> certificate pages, then paste the screenshots into the grey placeholder boxes.

**Minimum if the teacher only wants the database:** `schema.sql`, `seed.sql`,
`queries.sql`, `hospital.db` (or `CityCare.accdb`), `er_diagram.svg`.

---

## B. Screenshot checklist (take these from the running app)

1. Dashboard — KPI cards + all 4 charts
2. Dashboard — "SQL behind this screen" panel expanded
3. Patients table with a search result
4. Doctors table showing the department join
5. Appointments 4-table join with coloured status badges
6. Book Appointment form filled in
7. Booking success message (transaction COMMITTED)
8. **Constraint violation** — book the same doctor/date/time twice → error message
9. Billing revenue chart + bills table
10. Pharmacy with REORDER alerts
11. **SQL Console — Q18 (4-table join) result** ← hero screenshot
12. SQL Console — Q14 (correlated subquery) result
13. SQL Console — Q28 (transaction) result
14. SQL Console — Q27 (EXPLAIN QUERY PLAN) result
15. SQL Console — "✓ Verify all 36" showing 36/36 PASS
16. Schema / Data Dictionary page
17. ER Diagram page (also print the SVG full-size)
18. DB Browser for SQLite (or Access Relationships window) showing the tables
19. Downloads page
20. **Beds / Rooms** — ward cards showing the patient currently in each occupied bed
21. Beds / Rooms — "Occupied" filter + the full SQL register table
22. **Header live clock** — real date, time and detected time zone visible on every page (crop the top bar)
23. **Appointments — Ongoing tab** (6 in-progress rows at the demo clinic clock) ← great viva screenshot
24. Appointments — Upcoming tab, patient dropdown and adjustable clinic clock
25. **Dark mode** screenshot + the A＋ text-size control + the custom logo
26. Project Info page (your name / roll number / college / teacher)

---

## C. Report structure (60–90 pages with screenshots is normal)

| Chapter | Content | Source |
|---|---|---|
| Cover / Certificate / Acknowledgement / Abstract / TOC | standard | — |
| 1. Introduction | What a Hospital Management System is, need for the project | write it |
| 2. Problem statement & objectives | 8–10 functional requirements, users, scope, assumptions | `fullstack/README.md` §1–2 |
| 3. Hardware & software requirements | Python 3.8+, any browser, SQLite, no internet | `README.md` |
| 4. Existing system vs proposed system | manual registers → computerised DB | write it |
| 5. **ER Diagram** | entities, attributes, cardinalities, participation, assumptions | `er_diagram.svg` |
| 6. **Relational schema & data dictionary** | all 10 tables with column/type/constraint tables | `schema.sql` + Schema page screenshot |
| 7. **Normalisation** | 1NF → 2NF → 3NF → BCNF with before/after examples | Word report ch. 7 + `schema.sql` |
| 8. System design / architecture | 3-tier diagram (frontend / backend / database) | `README.md` §2 |
| 9. **SQL implementation** | DDL script, sample data, then all 36 queries grouped A–H, each with SQL + output screenshot | `queries.sql` + SQL Console |
| 10. Advanced DB objects | views, triggers, generated columns, indexes, transactions, EXPLAIN | `schema.sql`, Q25–Q28 |
| 11. User interface / forms & reports | screenshots of all 13 screens | app |
| 12. Testing & validation | test-case table, constraint violation, trigger demo, rollback demo, integrity audit | Q32 + screenshots |
| 13. Limitations & future scope | no auth, single-user, offline only | write it |
| 14. Conclusion | 1 page | write it |
| 15. References | Elmasri & Navathe, C.J. Date, SQLite docs, Microsoft Access docs, Python docs | — |
| Appendices | full `schema.sql`, `seed.sql`, `queries.sql`, `server.py`, `app.js` | downloads page |

---

## D. PPT outline (10–12 slides)

1. Title — City Care Hospital, your name, roll no., subject, teacher
2. Problem statement & objectives
3. Proposed system + 3-tier architecture diagram
4. ER diagram (full slide)
5. Relational schema / table list
6. Normalisation (1NF → 3NF, one example each)
7. Key SQL queries — Q09 (3-table join), Q14 (correlated subquery), Q18 (M:N junction)
8. Advanced features — views, triggers, generated columns, transactions, indexes
9. Screenshots — Dashboard, SQL Console, ER Diagram
10. Testing & validation results (36/36 queries pass)
11. Limitations & future enhancements
12. Conclusion + "Thank you / Questions"

---

## E. Five-minute demo script (practise twice)

> **0:00–0:40** — "Sir/Ma'am, this is City Care Hospital, a hospital management system built on a
> real relational database. The backend is Python with SQLite, the frontend is JavaScript, and
> there are 10 tables with 13 foreign keys." *(show Dashboard)*

> **0:40–1:20** — "Every number here is a query result. These KPI cards use scalar subqueries;
> the charts use GROUP BY. Here is the actual SQL behind this screen." *(expand SQL panel)*

> **1:20–2:10** — "This is the ER diagram. Doctor–Patient is many-to-many, resolved by the
> APPOINTMENT junction table; Prescription–Medicine is resolved by PRESCRIPTION_DETAIL.
> The schema is in 3NF — DeptName is not repeated inside DOCTOR." *(show ER page)*

> **2:10–3:10** — "This is the SQL Console with all 36 queries. Let me run a four-table join,
> then a correlated subquery." *(run Q18, then Q14)* "And here I verify all 36 at once — 36/36 pass."

> **3:10–3:50** — "Here's a transaction: booking an appointment inserts into APPOINTMENT and
> BILL atomically. If I double-book, the UNIQUE constraint rejects it and the transaction rolls back."
> *(run Q28, then show the booking error)*

> **3:50–4:20** — "This is the data dictionary with all columns, primary keys and foreign keys,
> read live from sqlite_master." *(show Schema page)*

> **4:20–4:45** — "The trigger reduces medicine stock automatically when a prescription line is
> added, and the view v_patient_spend reuses a LEFT JOIN." *(show Pharmacy + Q20)*

> **4:45–5:00** — "Finally, here are the actual database file and all SQL scripts on the Downloads
> page. Thank you." *(show Downloads)*

---

## F. Viva questions you must be able to answer

1. Why did you split DOCTOR–PATIENT and PRESCRIPTION–MEDICINE into junction tables?
2. Explain 1NF, 2NF, 3NF and BCNF using tables from **your own** schema.
3. What is referential integrity? What happens on deleting a referenced row?
4. INNER vs LEFT vs FULL OUTER JOIN — give an example from your queries.
5. `WHERE` vs `HAVING` — why can't an aggregate go in WHERE?
6. `DELETE` vs `TRUNCATE` vs `DROP`.
7. What is a view, and why did you create `v_patient_spend`? Can you update through it?
8. What does an index do? Show me `EXPLAIN QUERY PLAN` (Q27).
9. Explain your trigger. What is a data macro in MS Access?
10. What is a transaction? Explain ACID with your booking example.
11. DDL / DML / DCL / TCL — two commands each.
12. What is a correlated subquery? Point to Q14.
13. What is SQL injection, and how do `?` placeholders prevent it?
14. What is a generated/derived column? Where did you use one?
15. Why SQLite instead of MS Access / MySQL? What are its limitations?
16. Normalisation vs denormalisation — when would you denormalise?
17. What is a deadlock? Clustered vs non-clustered index?
18. Explain cardinality and participation in your ER diagram.
19. `UNION` vs `UNION ALL`.
20. How would you find the 2nd highest value? *(Q33)*

---

## G. Common mistakes to avoid

- Don't forget to **start the server before the demo** (`python3 server.py`).
- Don't leave the SQL Console in a broken state — click **↻ Reset DB** before presenting.
- Don't claim you wrote the SQL Console yourself if you can't explain `runSQL()` — read `server.py` once.
- Don't submit only the app; the **report + 36 query outputs** carry most of the marks.
- Keep **two backups** (Google Drive + pen drive). A corrupted `.db` on submission day is fatal.
- Don't use real patient data — the included data is synthetic.

---

## H. One-page project summary (paste into your report abstract)

> *City Care Hospital is a Hospital/Clinic Management System developed as a DBMS final project.
> It computerises patient registration, doctor scheduling, appointments, admissions, room
> allocation, prescriptions, pharmacy inventory and billing. The system follows a three-tier
> architecture: a JavaScript single-page frontend, a Python REST backend, and a SQLite relational
> database comprising ten normalised tables, thirteen foreign keys, three views, three triggers
> and six indexes. The schema resolves two many-to-many relationships using the APPOINTMENT and
> PRESCRIPTION_DETAIL junction tables, and enforces data integrity through primary, foreign,
> unique and check constraints together with cascading referential actions. Thirty-six SQL queries
> ranging from simple selection to correlated subqueries, multi-table joins, aggregate grouping,
> views, query plans and ACID transactions were implemented and verified. An integrated SQL
> Console allows any query to be executed live, and every application screen displays the SQL
> that produced its data, making the database implementation directly demonstrable.*

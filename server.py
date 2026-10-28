#!/usr/bin/env python3
"""
CITY CARE HOSPITAL - full-stack DBMS project
BACKEND: Python 3 standard library only (http.server + sqlite3).
REST JSON API + static file server for the SPA frontend.

Run:  python3 server.py        ->  http://localhost:8000
No pip install, no npm, no API keys, works fully offline.
"""
import os, re, io, csv, json, shutil, sqlite3, tempfile, traceback, mimetypes
from datetime import datetime, timedelta
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

ROOT   = os.path.dirname(os.path.abspath(__file__))
DBDIR  = os.path.join(ROOT, "database")
FRONT  = os.path.join(ROOT, "frontend")
SUBDIR = os.path.join(ROOT, "submission")
DB     = os.path.join(DBDIR, "hospital.db")
SCHEMA = os.path.join(DBDIR, "schema.sql")
SEED   = os.path.join(DBDIR, "seed.sql")
QUERIES= os.path.join(DBDIR, "queries.sql")
TODAY  = "2026-10-27"

# ===================================================================== DB layer
def build_db(force=False):
    if force or not os.path.exists(DB):
        if os.path.exists(DB):
            os.remove(DB)
        c = sqlite3.connect(DB)
        c.executescript(open(SCHEMA, encoding="utf-8").read())
        c.executescript(open(SEED,   encoding="utf-8").read())
        c.commit(); c.close()

def conn(path=None):
    c = sqlite3.connect(path or DB)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA foreign_keys = ON")
    return c

def q(sql, args=(), path=None):
    c = conn(path)
    try:
        return [dict(r) for r in c.execute(sql, args).fetchall()]
    finally:
        c.close()

def q1(sql, args=()):
    r = q(sql, args)
    return r[0] if r else {}

def run_sql(sql):
    """Run one or many statements. Returns {columns, rows, message|error}."""
    c = conn()
    try:
        low = sql.lower()
        if "attach " in low or "detach " in low or "writable_schema" in low:
            return {"columns": [], "rows": [], "error": "ATTACH / DETACH / writable_schema are disabled."}
        statements = []
        for chunk in sql.split(";"):
            clean = "\n".join(l for l in chunk.splitlines()
                              if not l.strip().startswith("--")).strip()
            if clean:
                statements.append(clean)
        if not statements:
            return {"columns": [], "rows": [], "error": "No SQL statement found."}
        c.isolation_level = None
        cols, data, affected = [], [], 0
        for st in statements:
            cur = c.execute(st)
            if cur.description:
                cols = [d[0] for d in cur.description]
                data = [list(r) for r in cur.fetchmany(400)]
            else:
                affected = cur.rowcount
        return {"columns": cols, "rows": data,
                "message": (f"{len(data)} row(s) returned" if cols else
                            f"Statement executed. Rows affected: {max(affected, 0)}")}
    except Exception as e:
        return {"columns": [], "rows": [], "error": str(e)}
    finally:
        c.close()

def query_bank():
    txt = open(QUERIES, encoding="utf-8").read()
    parts = re.split(r"(?m)^-- (Q\d+) \| ([^|]+) \| ([^\n]+)\n", txt)
    out = []
    for i in range(1, len(parts), 4):
        out.append({"id": parts[i], "group": parts[i+1].strip(),
                    "title": parts[i+2].strip(), "sql": parts[i+3].strip()})
    return out

def verify_queries():
    """Execute all 36 queries against a TEMPORARY COPY so the live DB is untouched."""
    tmp = os.path.join(tempfile.gettempdir(), "citycare_verify.db")
    shutil.copyfile(DB, tmp)
    results = []
    try:
        for item in query_bank():
            sql = "\n".join(l for l in item["sql"].splitlines()
                            if not l.strip().startswith("--")).strip()
            try:
                c = conn(tmp); c.isolation_level = None
                try:
                    n = 0
                    for st in [s.strip() for s in sql.split(";") if s.strip()]:
                        cur = c.execute(st)
                        if cur.description:
                            n = len(cur.fetchall())
                    results.append({"id": item["id"], "title": item["title"],
                                    "status": "PASS", "rows": n})
                finally:
                    c.close()
            except Exception as e:
                results.append({"id": item["id"], "title": item["title"],
                                "status": "FAIL", "rows": 0, "error": str(e)})
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
    return results

# ===================================================================== SQL used by screens
SQL_KPI = """SELECT (SELECT COUNT(*) FROM PATIENT) AS patients,
       (SELECT COUNT(*) FROM DOCTOR) AS doctors,
       (SELECT COUNT(*) FROM APPOINTMENT WHERE AppDate='2026-10-27') AS today,
       (SELECT COUNT(*) FROM ROOM WHERE Status='Occupied') AS occupied,
       (SELECT COUNT(*) FROM ROOM) AS rooms,
       (SELECT ROUND(SUM(NetAmount),2) FROM BILL) AS revenue,
       (SELECT COUNT(*) FROM BILL WHERE PaidStatus='Pending') AS pending,
       (SELECT COUNT(*) FROM MEDICINE WHERE StockQty<ReorderLevel) AS lowstock;"""
SQL_MONTHLY = """SELECT strftime('%Y-%m',AppDate) AS label, COUNT(*) AS value
                 FROM APPOINTMENT GROUP BY 1 ORDER BY 1;"""
SQL_DEPT = """SELECT dp.DeptName AS label, COUNT(a.AppID) AS value
              FROM DEPARTMENT dp LEFT JOIN DOCTOR d ON dp.DeptID=d.DeptID
              LEFT JOIN APPOINTMENT a ON d.DoctorID=a.DoctorID
              GROUP BY dp.DeptID,dp.DeptName ORDER BY value DESC;"""
SQL_TOPMEDS = """SELECT m.MedName AS label, SUM(pd.Qty) AS value
                 FROM PRESCRIPTION_DETAIL pd JOIN MEDICINE m ON pd.MedicineID=m.MedicineID
                 GROUP BY m.MedicineID,m.MedName ORDER BY value DESC LIMIT 6;"""
SQL_MODES = """SELECT PaymentMode AS label, ROUND(SUM(NetAmount),2) AS value
               FROM BILL GROUP BY PaymentMode ORDER BY value DESC;"""
SQL_RECENT = """SELECT a.AppDate, a.AppTime, p.FullName AS Patient, d.FullName AS Doctor, a.Status
                FROM APPOINTMENT a JOIN PATIENT p ON a.PatientID=p.PatientID
                JOIN DOCTOR d ON a.DoctorID=d.DoctorID
                ORDER BY a.AppDate DESC, a.AppTime DESC LIMIT 8;"""
SQL_PATIENTS = """SELECT p.PatientID, p.FullName, p.Gender, p.DOB, p.BloodGroup, p.Phone, p.City,
       (SELECT MAX(a.AppDate) FROM APPOINTMENT a WHERE a.PatientID=p.PatientID) AS LastVisit,
       (SELECT COUNT(*) FROM APPOINTMENT a WHERE a.PatientID=p.PatientID) AS Visits,
       (SELECT ROUND(COALESCE(SUM(b.NetAmount),0),2) FROM BILL b WHERE b.PatientID=p.PatientID) AS TotalSpend
FROM PATIENT p {where} ORDER BY p.FullName;"""
SQL_DOCTORS = """SELECT d.DoctorID, d.FullName, dp.DeptName, d.Specialization, d.Qualification,
       d.ExperienceYrs, d.ConsultFee, d.Phone, d.Status, COUNT(a.AppID) AS Appointments
FROM DOCTOR d JOIN DEPARTMENT dp ON d.DeptID=dp.DeptID
LEFT JOIN APPOINTMENT a ON d.DoctorID=a.DoctorID
GROUP BY d.DoctorID ORDER BY Appointments DESC;"""
SQL_APPOINTMENTS = """SELECT a.AppID, a.AppDate, a.AppTime, p.FullName AS Patient,
       d.FullName AS Doctor, dp.DeptName AS Department, a.Reason, a.Status, a.ConsultFee
FROM APPOINTMENT a
JOIN PATIENT p     ON a.PatientID = p.PatientID
JOIN DOCTOR d      ON a.DoctorID  = d.DoctorID
JOIN DEPARTMENT dp ON d.DeptID    = dp.DeptID
{where} ORDER BY a.AppDate DESC, a.AppTime DESC LIMIT 300;"""
SQL_BILLS = """SELECT b.BillID, b.BillDate, p.FullName AS Patient, b.BillType,
       b.GrossAmount, b.Discount, b.TaxPercent, b.NetAmount, b.PaymentMode, b.PaidStatus
FROM BILL b JOIN PATIENT p ON b.PatientID=p.PatientID
ORDER BY b.BillDate DESC, b.BillID DESC LIMIT 300;"""
SQL_BILL_KPI = """SELECT ROUND(SUM(NetAmount),2) AS total, COUNT(*) AS bills,
       ROUND(SUM(CASE WHEN PaidStatus='Pending' THEN NetAmount ELSE 0 END),2) AS pending
FROM BILL;"""
SQL_BILL_MONTHLY = """SELECT strftime('%Y-%m',BillDate) AS label, ROUND(SUM(NetAmount),2) AS value
                      FROM BILL GROUP BY 1 ORDER BY 1;"""
SQL_PHARMACY = """SELECT MedicineID, MedName, Category, Manufacturer, UnitPrice, StockQty,
       ReorderLevel, ExpiryDate,
       CASE WHEN StockQty < ReorderLevel THEN 'REORDER' ELSE 'OK' END AS Alert
FROM MEDICINE ORDER BY (StockQty < ReorderLevel) DESC, MedName;"""
SQL_ROOMS = """SELECT r.RoomID, r.RoomNo, r.RoomType, r.ChargesPerDay, r.Status AS RoomStatus,
       dp.DeptName AS Department,
       ad.AdmissionID, ad.AdmitDate, ad.Diagnosis, ad.Status AS AdmissionStatus,
       p.PatientID, p.FullName AS Patient, p.Gender, p.BloodGroup AS Blood, p.Phone, p.City,
       d.FullName AS Doctor, d.Specialization,
       CAST(julianday(date('now','localtime')) - julianday(ad.AdmitDate) AS INTEGER) AS DaysStayed,
       ROUND((julianday(date('now','localtime')) - julianday(ad.AdmitDate))
             * r.ChargesPerDay,2) AS CurrentBill
FROM ROOM r
LEFT JOIN DEPARTMENT dp ON r.DeptID = dp.DeptID
LEFT JOIN ADMISSION ad ON ad.RoomID = r.RoomID AND ad.Status='Admitted'
LEFT JOIN PATIENT p  ON ad.PatientID = p.PatientID
LEFT JOIN DOCTOR d   ON ad.DoctorID  = d.DoctorID
ORDER BY r.RoomNo;"""
SQL_ROOM_KPI = """SELECT COUNT(*) AS total,
       SUM(CASE WHEN Status='Occupied'   THEN 1 ELSE 0 END) AS occupied,
       SUM(CASE WHEN Status='Available'  THEN 1 ELSE 0 END) AS available,
       SUM(CASE WHEN Status='Maintenance' THEN 1 ELSE 0 END) AS maintenance,
       ROUND(AVG(ChargesPerDay),2) AS avgcharge
FROM ROOM;"""

# Same projection as SQL_APPOINTMENTS but without the trailing ORDER BY/LIMIT,
# so the time-aware views can order chronologically themselves.
SQL_APP_BASE = """SELECT a.AppID, a.AppDate, a.AppTime, p.FullName AS Patient,
       d.FullName AS Doctor, dp.DeptName AS Department, a.Reason, a.Status, a.ConsultFee
FROM APPOINTMENT a
JOIN PATIENT p     ON a.PatientID = p.PatientID
JOIN DOCTOR d      ON a.DoctorID  = d.DoctorID
JOIN DEPARTMENT dp ON d.DeptID    = dp.DeptID
{where} {order} LIMIT 60;"""

SQL_PHARM_KPI = """SELECT COUNT(*) AS items,
       (SELECT COUNT(*) FROM MEDICINE WHERE StockQty < ReorderLevel) AS low,
       (SELECT COUNT(*) FROM MEDICINE WHERE ExpiryDate BETWEEN '2026-10-27'
            AND date('2026-10-27','+90 day')) AS expiring
FROM MEDICINE;"""

# ===================================================================== API payloads
def api_meta():
    tables = q("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    counts = {t["name"]: q1(f'SELECT COUNT(*) c FROM "{t["name"]}"')["c"] for t in tables}
    return {"name": "City Care Hospital", "today": TODAY,
            "tables": len(tables), "counts": counts,
            "queries": len(query_bank()), "db_bytes": os.path.getsize(DB)}

def api_dashboard():
    return {"kpi": q1(SQL_KPI), "monthly": q(SQL_MONTHLY), "departments": q(SQL_DEPT),
            "topmeds": q(SQL_TOPMEDS), "modes": q(SQL_MODES), "recent": q(SQL_RECENT),
            "sql": "\n".join([SQL_KPI, SQL_MONTHLY, SQL_DEPT, SQL_TOPMEDS, SQL_MODES])}

def api_patients(search=""):
    where, args = "", []
    if search:
        where = "WHERE p.FullName LIKE ? OR p.City LIKE ? OR p.BloodGroup LIKE ?"
        args = [f"%{search}%"] * 3
    return {"rows": q(SQL_PATIENTS.format(where=where), args),
            "sql": SQL_PATIENTS.format(where=where or "-- no filter")}

def api_doctors():
    return {"rows": q(SQL_DOCTORS), "sql": SQL_DOCTORS}

def api_appointments(status="", date="", patient=""):
    conds, args = [], []
    if status: conds.append("a.Status = ?"); args.append(status)
    if date:   conds.append("a.AppDate = ?"); args.append(date)
    if patient and str(patient).isdigit():
        conds.append("a.PatientID = ?"); args.append(int(patient))
    where = ("WHERE " + " AND ".join(conds)) if conds else ""
    return {"rows": q(SQL_APPOINTMENTS.format(where=where), args),
            "stats": q("SELECT Status, COUNT(*) AS Cnt FROM APPOINTMENT GROUP BY Status ORDER BY Cnt DESC"),
            "sql": SQL_APPOINTMENTS.format(where=where or "-- no WHERE clause")}

def api_rooms():
    """Every room LEFT JOINed to the patient currently admitted to that bed."""
    return {"rows": q(SQL_ROOMS), "kpi": q1(SQL_ROOM_KPI), "sql": SQL_ROOMS}

def api_appointment_views(refdate, nowtime, patient=""):
    """Upcoming / Ongoing / Today / Past appointment buckets.

    Every appointment occupies a 30-minute slot. 'Ongoing' means the clinic
    clock is inside that slot; 'Upcoming' means the slot has not begun yet.
    Comparing zero-padded HH:MM strings is safe and stays pure SQL.
    """
    try:
        h, m = [int(x) for x in nowtime.split(":")[:2]]
        h, m = max(0, min(23, h)), max(0, min(59, m))
    except Exception:
        h, m = 10, 45
    nowtime = f"{h:02d}:{m:02d}"
    base = datetime(2000, 1, 1, h, m)
    # One consultation lasts 60 minutes -> anything started within the last
    # 59 minutes is still "ongoing" at the clinic clock time.
    slot_start = (base - timedelta(minutes=59)).strftime("%H:%M")
    if slot_start > nowtime:
        slot_start = "00:00"
    p = {"d": refdate, "t": nowtime, "s": slot_start, "p": 0}
    pf = ""
    if patient and str(patient).isdigit():
        p["p"] = int(patient)
        pf = " AND a.PatientID = :p"
    conds = {
        "ongoing": ("a.AppDate = :d AND a.Status = 'Scheduled' "
                    "AND a.AppTime > :s AND a.AppTime <= :t" + pf),
        "upcoming": ("a.Status = 'Scheduled' AND (a.AppDate > :d "
                     "OR (a.AppDate = :d AND a.AppTime > :t))" + pf),
        "today":    "a.AppDate = :d" + pf,
        "past":     ("(a.AppDate < :d OR a.Status IN ('Completed','Cancelled','No Show'))" + pf),
    }
    counts = q1(
        "SELECT "
        "SUM(CASE WHEN " + conds["ongoing"]  + " THEN 1 ELSE 0 END) AS Ongoing, "
        "SUM(CASE WHEN " + conds["upcoming"] + " THEN 1 ELSE 0 END) AS Upcoming, "
        "SUM(CASE WHEN " + conds["today"]    + " THEN 1 ELSE 0 END) AS Today, "
        "SUM(CASE WHEN " + conds["past"]     + " THEN 1 ELSE 0 END) AS Past, "
        "COUNT(*) AS AllRows FROM APPOINTMENT a "
        + ("WHERE a.PatientID = :p" if pf else ""), p)
    views = {}
    for key, cond in conds.items():
        direction = "DESC" if key == "past" else "ASC"
        sql = SQL_APP_BASE.format(where="WHERE " + cond,
                                  order=f"ORDER BY a.AppDate {direction}, a.AppTime {direction}")
        views[key] = q(sql, p)
    return {"counts": counts, "views": views, "refdate": refdate,
            "clock": nowtime, "slot_start": slot_start,
            "sql": SQL_APP_BASE.format(where="WHERE " + conds["ongoing"],
                                       order="ORDER BY a.AppDate ASC, a.AppTime ASC")}

def api_book_options():
    return {"patients": q("SELECT PatientID,FullName FROM PATIENT ORDER BY FullName"),
            "doctors": q("""SELECT d.DoctorID,d.FullName,dp.DeptName,d.ConsultFee
                            FROM DOCTOR d JOIN DEPARTMENT dp ON d.DeptID=dp.DeptID
                            WHERE d.Status='Active' ORDER BY d.FullName"""),
            "times": ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30",
                      "14:00","14:30","15:00","15:30","16:00","16:30"]}

def api_book(data):
    try:
        pid  = int(data.get("patient", 0)); did = int(data.get("doctor", 0))
        date = data.get("date", ""); tm = data.get("time", "")
        reason = data.get("reason", "")
        fee = q1("SELECT ConsultFee FROM DOCTOR WHERE DoctorID=?", (did,)).get("ConsultFee")
        if fee is None: return {"ok": False, "error": "Doctor not found."}
        c = conn(); c.isolation_level = None
        try:
            c.execute("BEGIN TRANSACTION")
            c.execute("""INSERT INTO APPOINTMENT
                (PatientID,DoctorID,AppDate,AppTime,Reason,Status,ConsultFee)
                VALUES (?,?,?,?,?,'Scheduled',?)""", (pid, did, date, tm, reason, fee))
            appid = c.execute("SELECT last_insert_rowid()").fetchone()[0]
            c.execute("""INSERT INTO BILL
                (PatientID,BillDate,BillType,RefID,GrossAmount,Discount,TaxPercent,PaymentMode,PaidStatus)
                VALUES (?,?,'Consultation',?,?,0,5,'UPI','Paid')""", (pid, date, appid, fee))
            c.execute("COMMIT")
        except Exception:
            c.execute("ROLLBACK"); raise
        finally:
            c.close()
        return {"ok": True, "app_id": appid, "fee": fee,
                "message": f"Transaction COMMITTED — appointment #{appid} + bill of ₹{fee:,.0f} created.",
                "sql": """BEGIN TRANSACTION;
  INSERT INTO APPOINTMENT (PatientID,DoctorID,AppDate,AppTime,Reason,Status,ConsultFee)
  VALUES (?,?,?,?,?,'Scheduled',?);
  INSERT INTO BILL (PatientID,BillDate,BillType,RefID,GrossAmount,Discount,TaxPercent,PaymentMode,PaidStatus)
  VALUES (?,?,'Consultation',?,?,0,5,'UPI','Paid');
COMMIT;"""}
    except sqlite3.IntegrityError as e:
        msg = str(e)
        if "UNIQUE" in msg:
            msg = "This doctor is already booked on that date and time (UNIQUE constraint)."
        return {"ok": False, "error": f"Transaction ROLLED BACK — {msg}"}
    except Exception as e:
        return {"ok": False, "error": f"Transaction ROLLED BACK — {e}"}

def api_billing():
    return {"kpi": q1(SQL_BILL_KPI), "monthly": q(SQL_BILL_MONTHLY),
            "rows": q(SQL_BILLS), "sql": "\n".join([SQL_BILL_KPI, SQL_BILL_MONTHLY, SQL_BILLS])}

def api_pharmacy():
    return {"kpi": q1(SQL_PHARM_KPI), "rows": q(SQL_PHARMACY),
            "sql": SQL_PHARMACY + "\n\n-- trigger:\n" +
                   "CREATE TRIGGER trg_presc_detail_stock AFTER INSERT ON PRESCRIPTION_DETAIL\n" +
                   "BEGIN UPDATE MEDICINE SET StockQty = StockQty - NEW.Qty WHERE MedicineID = NEW.MedicineID; END;"}

def api_schema():
    tabs = q("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    out = []
    for t in tabs:
        n = t["name"]
        out.append({"name": n, "columns": q(f'PRAGMA table_info("{n}")'),
                    "fks": q(f'PRAGMA foreign_key_list("{n}")'),
                    "rows": q1(f'SELECT COUNT(*) c FROM "{n}"')["c"],
                    "ddl": t["sql"]})
    return {"tables": out,
            "objects": q("""SELECT type, name, tbl_name FROM sqlite_master
                            WHERE type IN ('view','trigger','index') AND name NOT LIKE 'sqlite_%'
                            ORDER BY type,name"""),
            "sql": "SELECT name, sql FROM sqlite_master WHERE type IN ('table','view','trigger','index');\nPRAGMA table_info('APPOINTMENT');\nPRAGMA foreign_key_list('APPOINTMENT');"}

def api_export(table):
    allowed = ["DEPARTMENT","DOCTOR","PATIENT","ROOM","APPOINTMENT","ADMISSION",
               "MEDICINE","PRESCRIPTION","PRESCRIPTION_DETAIL","BILL"]
    if table not in allowed:
        return None
    data = q(f'SELECT * FROM "{table}"')
    if not data:
        return f"No rows in {table}\n"
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=list(data[0].keys()))
    w.writeheader(); w.writerows(data)
    return buf.getvalue()

# ===================================================================== HTTP
MIME = {".html":"text/html; charset=utf-8", ".js":"application/javascript; charset=utf-8",
        ".css":"text/css; charset=utf-8", ".svg":"image/svg+xml",
        ".sql":"text/plain; charset=utf-8", ".md":"text/plain; charset=utf-8",
        ".json":"application/json; charset=utf-8", ".db":"application/octet-stream",
        ".png":"image/png", ".ico":"image/x-icon",
        ".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation"}

class Handler(BaseHTTPRequestHandler):
    server_version = "CityCare/1.0"

    def log_message(self, *a):
        pass

    def send(self, payload, ctype="application/json; charset=utf-8", code=200, extra=None):
        raw = payload.encode("utf-8") if isinstance(payload, str) else payload
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Cache-Control", "no-store")
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()
        try:
            self.wfile.write(raw)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def json(self, obj, code=200):
        self.send(json.dumps(obj, ensure_ascii=False, default=str), code=code)

    def do_OPTIONS(self):
        self.send(b"", "text/plain", 204)

    def do_GET(self):
        u = urlparse(self.path); p = u.path; qs = parse_qs(u.query)
        try:
            # ---------------- API ----------------
            if p == "/api/health":              return self.json({"ok": True, "db": os.path.getsize(DB)})
            if p == "/api/meta":                return self.json(api_meta())
            if p == "/api/dashboard":           return self.json(api_dashboard())
            if p == "/api/patients":            return self.json(api_patients(qs.get("q", [""])[0]))
            if p == "/api/doctors":             return self.json(api_doctors())
            if p == "/api/appointments":        return self.json(api_appointments(
                qs.get("status", [""])[0], qs.get("date", [""])[0], qs.get("patient", [""])[0]))
            if p == "/api/rooms":               return self.json(api_rooms())
            if p == "/api/appointment_views":
                d = qs.get("date", [TODAY])[0]
                t = qs.get("time", ["11:05"])[0]
                return self.json(api_appointment_views(d, t, qs.get("patient", [""])[0]))
            if p == "/api/book/options":        return self.json(api_book_options())
            if p == "/api/billing":             return self.json(api_billing())
            if p == "/api/pharmacy":            return self.json(api_pharmacy())
            if p == "/api/queries":             return self.json({"bank": query_bank()})
            if p == "/api/schema":              return self.json(api_schema())
            if p == "/api/er":                  return self.send(open(os.path.join(FRONT, "er_diagram.svg"), encoding="utf-8").read(), "image/svg+xml")
            if p == "/api/export":
                csvtxt = api_export(qs.get("table", [""])[0].upper())
                if csvtxt is None: return self.json({"error": "Unknown table"}, 404)
                name = qs.get("table", ["data"])[0].upper() + ".csv"
                return self.send(csvtxt, "text/csv; charset=utf-8",
                                 extra={"Content-Disposition": f'attachment; filename="{name}"'})

            # ---------------- STATIC FRONTEND ----------------
            if p in ("/", "/index.html"):
                return self.send(open(os.path.join(FRONT, "index.html"), encoding="utf-8").read(), MIME[".html"])
            # Any whitelisted static asset from frontend/ (no path traversal:
            # only a bare filename is accepted).
            if p.startswith("/") and p.count("/") == 1 and os.path.splitext(p)[1].lower() in MIME:
                f = os.path.join(FRONT, os.path.basename(p))
                if os.path.isfile(f):
                    ext = os.path.splitext(f)[1].lower()
                    if ext in (".svg", ".png", ".ico", ".db"):
                        return self.send(open(f, "rb").read(), MIME[ext])
                    return self.send(open(f, encoding="utf-8").read(), MIME[ext])

            # ---------------- DOWNLOADS ----------------
            if p.startswith("/download/"):
                name = os.path.basename(p[len("/download/"):])
                candidates = [os.path.join(DBDIR, name), os.path.join(ROOT, name),
                              os.path.join(FRONT, name), os.path.join(SUBDIR, name)]
                path = next((x for x in candidates if os.path.isfile(x)), None)
                if not path: return self.json({"error": "File not found"}, 404)
                ext = os.path.splitext(path)[1].lower()
                return self.send(open(path, "rb").read(), MIME.get(ext, "application/octet-stream"),
                                 extra={"Content-Disposition": f'attachment; filename="{name}"'})
            return self.json({"error": "Not found", "path": p}, 404)
        except Exception:
            return self.json({"error": traceback.format_exc()}, 500)

    def do_POST(self):
        u = urlparse(self.path); p = u.path
        n = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(n).decode("utf-8", "replace") if n else ""
        try:
            data = json.loads(raw) if raw.strip().startswith(("{", "[")) else parse_qs(raw)
        except Exception:
            data = {}
        try:
            if p == "/api/sql":              return self.json(run_sql(data.get("sql", "")))
            if p == "/api/book":             return self.json(api_book(data))
            if p == "/api/reset":
                build_db(force=True)
                return self.json({"ok": True, "message": "hospital.db rebuilt from schema.sql + seed.sql"})
            if p == "/api/queries/verify":   return self.json({"results": verify_queries()})
            return self.json({"error": "Not found"}, 404)
        except Exception:
            return self.json({"error": traceback.format_exc()}, 500)

if __name__ == "__main__":
    build_db()
    port = int(os.environ.get("PORT", "8000"))
    print("City Care Hospital (full stack) is running.")
    print("  -> Open http://localhost:8000 in Chrome / Edge")
    print("  -> Do NOT open 0.0.0.0:8000; that is a server address, not a browser address.")
    print("  -> Press Ctrl+C to stop.")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()

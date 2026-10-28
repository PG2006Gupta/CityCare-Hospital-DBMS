# HOW TO RUN THE PROJECT IN VS CODE — step by step

Follow these in order. It takes about 5 minutes. Examples are for **Windows**
(the most common college lab setup); Mac/Linux differences are noted.

---

## 🔄 ALREADY HAVE AN OLDER VERSION RUNNING? (read this first)

This ZIP is a **new version** with bigger text, coloured headings, dark mode,
a custom logo, a **Beds / Rooms** page, a **live date & time clock in the
header of every page**, a 3D rotating logo watermark, and
**Upcoming / Ongoing** appointment tabs. The separate "Date & Time" page has
been removed, as requested. `server.py` was changed, so a hard
refresh alone is not enough:

1. **Download the new `CityCare_DBMS_Project.zip`** from the chat.
2. Go to `C:\Users\pc\Desktop` and **delete or rename** your old folder
   `DBMS_Project_CityCare` (e.g. rename it `DBMS_Project_CityCare_OLD`).
   > Renaming is safer — you keep a backup.
3. Right-click the new ZIP → **Extract All…** → extract to `C:\Users\pc\Desktop\`.
   Make sure you end up with `C:\Users\pc\Desktop\DBMS_Project_CityCare\server.py`.
4. In VS Code: **File → Open Folder** → choose that inner folder (the one
   containing `server.py`).
5. If `python server.py` is still running in the old terminal, click the
   terminal and press **Ctrl+C** to stop it. Then run `python server.py` again.
   > **`server.py` changed → restarting is required.**
6. In Chrome open **http://localhost:8000** and press **Ctrl+F5**
   (hard refresh, clears cached CSS/JS).

If you only changed `frontend/config.js`, `app.js`, `styles.css` or
`index.html`, you only need **Ctrl+F5** — no restart.

### Where the new controls are

| Control | Location | What it does |
|---|---|---|
| **◈** | top-right of the header | **3D logo watermark** — show/hide, rotation speed (Normal / Fast / Slow / Manual), strength, size, follow-mouse tilt, and a manual angle slider. |
| **A＋** | top-right of the header | Cycles text size: Normal → Large (default) → Extra-large. Remembered in the browser. |
| **☾ / ☀** | top-right of the header | Dark mode menu: Light / Dark / Follow my system. Remembered in the browser. |
| **Live date & time** | top-right of the header (circled red in your screenshot) | Your REAL local time + date + time zone, ticking every second on **every** page. Hover it for the full date, UTC offset and ISO timestamp. |
| **Beds / Rooms** | left sidebar, HOSPITAL | 15 rooms, who is in each bed, doctor, diagnosis, days stayed, running bill. |
| Upcoming / Ongoing | Appointments page | Tabs + patient dropdown + adjustable **clinic clock** (drag the time). |

> 💡 The sample data is dated **27 Oct 2026** so the SQL queries always return
> rows. That is why Appointments has its own adjustable "clinic clock"
> (default 11:05). The **header clock always shows your real time** —
> click **◉ Use my real time** on Appointments if you want that instead.

---

## STEP 0 — What you need installed

| Thing | Where to get it | Notes |
|---|---|---|
| **Python 3.8+** | https://www.python.org/downloads/ | ⚠️ During install, **tick "Add Python to PATH"** at the bottom — this is the #1 cause of errors |
| **VS Code** | https://code.visualstudio.com/ | free |
| **A browser** | Chrome / Edge / Firefox | already installed |
| Python extension for VS Code | VS Code → Extensions (Ctrl+Shift+X) → search "Python" by Microsoft → Install | optional but recommended |

> No npm, no pip install, no internet, no API keys. The project uses only
> Python's built-in libraries.

---

## STEP 1 — Extract the ZIP

1. Go to your **Downloads** folder.
2. Right‑click `CityCare_DBMS_Project.zip` → **Extract All…**
3. Extract it somewhere **simple**, for example:
   - `C:\DBMS_Project\`  ✅
   - `D:\College\DBMS_Project\` ✅
   - ❌ Avoid paths with spaces, Hindi/special characters, or inside OneDrive.
4. Click **Extract**.

⚠️ **Watch out for the double folder.** Windows sometimes creates this:

```
DBMS_Project_CityCare\
└── DBMS_Project_CityCare\    ← the real project is inside here
    ├── server.py
    ├── frontend\
    └── database\
```

If that happens, open the **inner** folder — the one that contains `server.py`.

---

## STEP 2 — Check the folder structure (IMPORTANT)

The folder you will open in VS Code **must** look exactly like this:

```
DBMS_Project_CityCare/          ← OPEN THIS FOLDER IN VS CODE
├── server.py                   ← backend (must be at top level)
├── run_windows.bat             ← double-click alternative
├── run.sh                      ← Mac/Linux alternative
├── START_HERE.txt
├── README.md
├── SUBMISSION.md
├── HOW_TO_RUN.md               ← this file
├── .vscode\
│   ├── launch.json             ← lets you press F5
│   └── settings.json
├── frontend\
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── er_diagram.svg
├── database\
│   ├── schema.sql
│   ├── seed.sql
│   ├── queries.sql
│   └── hospital.db             ← created automatically on first run
└── submission\
    ├── CityCare_Project_Report.docx
    ├── CityCare_Presentation.pptx
    └── er_diagram.png
```

🚫 **Do NOT move files around, rename folders, or put `server.py` inside
another folder.** `server.py` finds `frontend/` and `database/` relative to
itself — if you separate them, the app breaks.

---

## STEP 3 — Open the folder in VS Code

1. Launch **VS Code**.
2. `File` → `Open Folder…`  (or press `Ctrl+K` then `Ctrl+O`).
3. Select the **`DBMS_Project_CityCare`** folder — the one that directly
   contains `server.py`.
4. Click **Select Folder**.
5. If VS Code asks *"Do you trust the authors of the files in this folder?"*
   → click **Yes, I trust**.

✅ **Check:** in the left **Explorer** panel you should immediately see
`server.py`, `frontend`, `database`, `submission` at the top level.

> ❌ Common mistake: opening the **parent** folder (the one that contains
> `DBMS_Project_CityCare`). Then VS Code shows only one folder and the
> terminal starts in the wrong place.

---

## STEP 4 — Open the VS Code terminal

Press **`Ctrl + ` `** (the backtick key, below Esc),
or go to `Terminal` → `New Terminal`.

A terminal appears at the bottom. Check the path shown — it should end with
your project folder, e.g.:

```
C:\DBMS_Project\DBMS_Project_CityCare>
```

If it shows a different folder, type:

```bat
cd C:\DBMS_Project\DBMS_Project_CityCare
```

(use your real path). Confirm with:

```bat
dir
```

You should see `server.py` in the list.

---

## STEP 5 — Verify Python works

In that terminal, type:

```bat
python --version
```

You should see something like `Python 3.12.4`.

**Mac/Linux:** use `python3 --version` and `python3` everywhere below.

### If you get "python is not recognized"
1. Install Python from https://www.python.org/downloads/
2. Re‑run the installer → **Modify** → make sure **"Add Python to PATH"** is ticked.
3. **Close and reopen VS Code completely** (PATH changes don't apply to an
   already-running VS Code), then try again.

Alternatively try `py --version` — on some Windows PCs the command is `py`,
so use `py server.py` in Step 6.

---

## STEP 6 — Start the server

### Option A — terminal (recommended)

```bat
python server.py
```

You should see:

```
City Care Hospital (full stack) running at http://0.0.0.0:8000
```

**Leave this terminal running.** Do not close it while using the app.

### Option B — press F5 (if you installed the Python extension)

Open `server.py`, press **F5**, choose **"▶ Run City Care Hospital"** if asked.
The integrated terminal will start the server. Same result.

### Option C — outside VS Code (quick demo)

Double-click **`run_windows.bat`** in File Explorer. A black window opens with
the server. (Mac/Linux: `bash run.sh`.)

---

## STEP 7 — Open the app in your browser

Go to:

```
http://localhost:8000
```

> ⚠️ **VERY COMMON MISTAKE — read this.**
> The terminal prints `running at http://0.0.0.0:8000`. **Do NOT open that
> address.** `0.0.0.0` is a *server* address meaning "listen on all network
> cards"; a browser cannot connect to it. If you Ctrl+clicked the terminal
> link, VS Code opened its built-in "Simple Browser" tab with `0.0.0.0:8000`
> and you will see **`ERR_ADDRESS_INVALID (-108) — Failed to Load Page`**.
>
> ✅ Instead: click the **Chrome / Edge icon on your taskbar**, type
> `http://localhost:8000` in the address bar, press Enter.
> (Backup address: `http://127.0.0.1:8000`.)
> Close the broken `0.0.0.0:8000` tabs — they are harmless.

💡 The server must stay running in the VS Code terminal while you use the app.

You should see the **City Care Hospital** dashboard with KPI cards and charts.

> ❌ **Do NOT right-click `index.html` → "Open with Live Server"** and do NOT
> double-click `index.html` directly (that opens `file:///...`). The frontend
> needs the Python backend for `/api/...` calls — without it you'll get
> "Could not load data". Always go through `http://localhost:8000`.

---

## STEP 8 — Verify everything works (do this once)

1. In the left sidebar, click **SQL Console**.
2. Click **"✓ Verify all 36"**.
3. You should see **"36 / 36 queries passed"** in green.
4. Click **Dashboard** — you should see numbers like 30 patients, 14 doctors.
5. Click **Book Appointment**, fill the form, submit → you should see
   *"Transaction COMMITTED"*.

If all three work, your project is 100% functional. 🎉

---

## STEP 9 — Stop the server when finished

Click inside the terminal and press **`Ctrl + C`**.
(Or close the `run_windows.bat` window.)

To start again, just repeat Step 6.

---

## STEP 10 — Reset the database (if you break something)

If you run a `DELETE` or `DROP` in the SQL Console and things look wrong:

- Go to **SQL Console** → click **"↻ Reset DB"**, **or**
- Stop the server, delete `database/hospital.db`, and run `python server.py` again.

The database is rebuilt automatically from `schema.sql` + `seed.sql`.

---

## Troubleshooting

| Problem | Reason | Fix |
|---|---|---|
| `'python' is not recognized` | Python not in PATH | Reinstall Python, tick **Add Python to PATH**, restart VS Code. Or try `py server.py`. |
| `No module named ...` | You're running someone else's script | This project needs **no packages**. Make sure you ran `python server.py` from this folder. |
| Blank page / "Could not load data" | Opened `index.html` directly or used Live Server | Use `http://localhost:8000` only. |
| Page loads but all numbers are 0 | `hospital.db` missing/empty | Click **Reset DB** in SQL Console, or delete the `.db` file and restart. |
| `Address already in use` / port 8000 busy | Another app uses port 8000 | Windows CMD: `set PORT=8080 && python server.py` → open `http://localhost:8080`. PowerShell: `$env:PORT=8080; python server.py`. Mac/Linux: `PORT=8080 python3 server.py`. |
| Windows firewall popup | Python listening on a port | Click **Allow access** (or Cancel — `localhost` still works). |
| Changes to `app.js` / `styles.css` not showing | Browser cache | Press **Ctrl + F5** (hard refresh). |
| Changes to `server.py` not showing | Server still running old code | Press **Ctrl+C**, then run `python server.py` again. |
| `Access is denied` when extracting | OneDrive / protected folder | Extract to `C:\DBMS_Project\` instead. |
| VS Code terminal opens in wrong folder | Opened the parent folder | `File → Open Folder` and select the folder containing `server.py`; or `cd` into it. |
| F5 does nothing | Python extension not installed | Install the "Python" extension by Microsoft, or just use the terminal (Option A). |

---

## WANT TO CHANGE THE FRONTEND? (read this)

There is now **one easy file**: `frontend/config.js`. Open it in VS Code and
change the values between the quotes — hospital name, tagline, **your name,
roll number, college, teacher**, theme colour, **text size**, **dark mode**,
**coloured typography**, the **3D watermark** defaults, footer text. Then:

1. Save (`Ctrl+S`)
2. Go to Chrome and press **`Ctrl+F5`** (hard refresh)
3. Done — **no server restart needed**

A **"Project Info"** page in the sidebar shows all your submission details and
the new logo. Colour presets are listed inside `config.js` (teal, red, purple,
blue, orange). The **A＋** and **☾** buttons change text size and theme live;
your choice is saved in the browser, so it overrides `config.js` on later
visits (clear site data in Chrome if you want `config.js` to win again).

| I want to change… | Edit this file | Restart needed? |
|---|---|---|
| Name / your details / theme colour ⭐ | **`frontend/config.js`** | No — just Ctrl+F5 in browser |
| Colours, layout, fonts (advanced) | `frontend/styles.css` | No — just Ctrl+F5 |
| Screens, charts, buttons | `frontend/app.js` | No — just Ctrl+F5 |
| Page shell / sidebar | `frontend/index.html` | No — just Ctrl+F5 |
| API, SQL queries, logic | `server.py` | **Yes** — Ctrl+C then run again |
| Tables, constraints, triggers | `database/schema.sql` | Yes — and click Reset DB |
| Sample data | `database/seed.sql` | Yes — and click Reset DB |
| The 36 query list | `database/queries.sql` | No (reload SQL Console page) |
| Your report | `submission/CityCare_Project_Report.docx` | Open in Word |
| Your slides | `submission/CityCare_Presentation.pptx` | Open in PowerPoint |

---

## Final quick checklist

- [ ] ZIP extracted to a simple path
- [ ] VS Code opened the folder **containing `server.py`**
- [ ] `python --version` works in the VS Code terminal
- [ ] `python server.py` shows "Open http://localhost:8000"
- [ ] (When updating from an older ZIP) old server stopped with Ctrl+C and started again
- [ ] Browser opened at `http://localhost:8000` (**not** `0.0.0.0:8000`) and hard-refreshed with Ctrl+F5
- [ ] SQL Console → Verify all 36 → **36 / 36 passed**
- [ ] Report + PPT opened and your name filled in
- [ ] Screenshots taken from the running app and pasted into the report

That's it — you're ready to submit. 🚀

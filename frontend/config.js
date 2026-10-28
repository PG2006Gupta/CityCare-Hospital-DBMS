/* =====================================================================
   ⭐ EASY CUSTOMIZATION FILE ⭐
   Change anything below, save (Ctrl+S), then press Ctrl+F5 in Chrome.
   You do NOT need to restart the server. You do NOT need to touch app.js.

   Only edit the text between the quotes. Keep the quotes and commas.
   ===================================================================== */
window.SITE_CONFIG = {

  /* ---------- 1. Branding ---------- */
  hospitalName:   "City Care Hospital",
  tagline:        "Hospital Management",
  projectTitle:   "DBMS Final Project",
  session:        "2026–27",

  /* ---------- 2. YOUR details (shown in the header, footer and About page) ---------- */
  studentName:    "< Your Name >",
  rollNo:         "< Your Roll No. >",
  course:         "< Course / Semester >",
  college:        "< Your College Name >",
  teacher:        "< Teacher's Name >",
  subject:        "Database Management Systems",

  /* ---------- 3. Theme colour (any hex colour) ----------
     Try:  "#4f46e5" indigo (default)   "#0d9488" teal
           "#dc2626" red               "#7c3aed" purple
           "#0284c7" blue              "#ea580c" orange            */
  accent:         "#4f46e5",

  /* ---------- 4. Appearance: text size, colour & dark mode ----------
     textSize: "normal" (small) | "large" (default, 12% bigger) | "xlarge" (26% bigger)
     colourfulText: true  = gradient headings + coloured numbers (recommended)
                    false = plain black text
     theme: "light" | "dark" | "auto" (auto = follow Windows/Chrome setting)
     NOTE: the buttons in the top-right corner let you change these live;
           whatever you pick is remembered in the browser.                    */
  textSize:       "large",
  colourfulText:  true,
  theme:          "light",

  /* ---------- 5. Sidebar / layout ---------- */
  sidebarDark:    true,      // true = dark navy sidebar, false = white sidebar
  showAbout:      true,      // show the "Project Info / About" page in the menu
  showLiveBadge:  true,      // show the green "LIVE SQL DATABASE" badge

  /* ---------- 6. 3D logo watermark ----------
     A rotating 3D version of the hospital logo floats faintly behind every
     page. The ◈ button in the top bar controls it live (on/off, speed,
     strength, size, follow-mouse and a manual angle slider).
     These are only the STARTING values — whatever you pick with the ◈ button
     is remembered by the browser.                                          */
  watermark:          true,       // false = start with it hidden
  watermarkSpeed:     "normal",   // "slow" | "normal" | "fast" | "manual"
  watermarkStrength:  "normal",   // "faint" | "normal" | "strong"
  watermarkSize:      "medium",   // "small" | "medium" | "large"
  watermarkMouse:     true,       // lean toward the mouse pointer

  /* ---------- 7. Footer line ---------- */
  footerNote:     "Every value on every screen comes from a real SQL query",

  /* ---------- 8. Clocks ----------
     The TOP BAR of every page shows your real, live local date and time —
     never a fake value. It reads the time zone directly from your browser, so
     in India it shows Asia/Kolkata (IST). Leave timeZone as "auto".
     Hover the clock to see the full date, UTC offset and ISO timestamp.
     showHeaderClock:false hides it.

     The sample database is built around 27 Oct 2026. Appointments therefore
     has its own "clinic clock" so that Ongoing / Upcoming always show rows.
     demoClockTime is the starting time for that clinic clock.                */
  timeZone:        "auto",
  showHeaderClock: true,
  demoClockTime:  "11:05",

  /* ---------- 9. Do NOT change this ----------
     The sample data is built around 27 Oct 2026. Changing it will make
     the "Appointments today" card show 0. Keep it as it is. */
  demoDate:       "2026-10-27"
};

/* =====================================================================
   CITY CARE HOSPITAL — SPA frontend (vanilla JS, no build step)
   Talks to the Python REST backend via /api/* . Every screen shows its SQL.
   ★ To change names / colours / your details, edit  frontend/config.js  ★
   ===================================================================== */

/* ---------- EASY CONFIG (from config.js, with safe defaults) ---------- */
const CFG = Object.assign({
  hospitalName:'City Care Hospital', tagline:'Hospital Management',
  projectTitle:'DBMS Final Project', session:'2026–27',
  studentName:'< Your Name >', rollNo:'< Your Roll No. >',
  course:'< Course / Semester >', college:'< Your College Name >',
  teacher:"< Teacher's Name >", subject:'Database Management Systems',
  accent:'#4f46e5', sidebarDark:true, showAbout:true, showLiveBadge:true,
  footerNote:'Every value on every screen comes from a real SQL query',
  demoDate:'2026-10-27', textSize:'large', colourfulText:true, theme:'light',
  timeZone:'auto', demoClockTime:'11:05',
  watermark:true, watermarkSpeed:'normal', watermarkStrength:'normal',
  watermarkSize:'medium', watermarkMouse:true, showHeaderClock:true
}, window.SITE_CONFIG || {});

/* ---------- 3D rotating logo watermark (logo.png, pure CSS 3D) ---------- */
const WM_SPEEDS     = {slow:'36s', normal:'22s', fast:'11s', manual:'0s'};
const WM_OPACITIES  = {faint:.06, normal:.11, strong:.20};
const WM_SIZES      = {small:'230px', medium:'330px', large:'440px'};
const WM_CYCLE = {
  speed:['normal','fast','slow','manual'],
  strength:['normal','strong','faint'],
  size:['medium','large','small']
};
let WM = {
  on: CFG.watermark !== false,
  speed: WM_SPEEDS[CFG.watermarkSpeed] ? CFG.watermarkSpeed : 'normal',
  strength: WM_OPACITIES[CFG.watermarkStrength] ? CFG.watermarkStrength : 'normal',
  size: WM_SIZES[CFG.watermarkSize] ? CFG.watermarkSize : 'medium',
  mouse: CFG.watermarkMouse !== false,
  angle: 0
};
function wmSave(){ try{ localStorage.setItem('cc_wm', JSON.stringify(WM)); }catch(e){} }
function wmLabel(k){
  if(k==='onoff')  return (WM.on?'◉ ':'○ ') + 'Show / hide  ·  ' + (WM.on?'ON':'OFF');
  if(k==='speed')  return '⟳ Rotation speed  ·  ' + WM.speed.toUpperCase();
  if(k==='strength')return '◐ Strength  ·  ' + WM.strength.toUpperCase();
  if(k==='size')   return '⤢ Size  ·  ' + WM.size.toUpperCase();
  if(k==='mouse')  return (WM.mouse?'✥ ':'✕ ') + 'Follow mouse  ·  ' + (WM.mouse?'ON':'OFF');
  return '';
}
function wmApply(){
  const r=document.documentElement;
  r.style.setProperty('--wm-speed', WM_SPEEDS[WM.speed]||'22s');
  r.style.setProperty('--wm-opacity', WM_OPACITIES[WM.strength]);
  r.style.setProperty('--wm-size', WM_SIZES[WM.size]);
  r.style.setProperty('--wm-angle', (WM.angle||0)+'deg');
  r.classList.toggle('wm-off', !WM.on);
  r.classList.toggle('wm-manual', WM.speed==='manual');
  Object.keys(WM_CYCLE).concat(['onoff','mouse']).forEach(k=>{
    const b=$('#wmMenu button[data-wm="'+k+'"]'); if(b){ b.textContent=wmLabel(k); b.classList.toggle('on', k==='onoff'?WM.on:(k==='mouse'?WM.mouse:false)); }
  });
  const a=$('#wmAngle'), v=$('#wmAngleVal');
  if(a) a.value=WM.angle||0;
  if(v) v.textContent=(WM.angle||0)+'°';
  const btn=$('#wmBtn'); if(btn) btn.classList.toggle('on', WM.on);
  wmSave();
}
function initWatermark(){
  let saved=null;
  try{ saved=JSON.parse(localStorage.getItem('cc_wm')||'null'); }catch(e){}
  if(saved && typeof saved==='object'){
    WM = Object.assign(WM, saved);
    if(!WM_SPEEDS[WM.speed])       WM.speed='normal';
    if(!WM_OPACITIES[WM.strength]) WM.strength='normal';
    if(!WM_SIZES[WM.size])         WM.size='medium';
    WM.angle = Math.max(0, Math.min(360, Number(WM.angle)||0));
  }
  wmApply();
  const menu=$('#wmMenu');
  $('#wmBtn').addEventListener('click',()=>{
    menu.hidden=!menu.hidden;
    const t=$('#themeMenu'); if(t) t.hidden=true;
  });
  menu.addEventListener('click',e=>{
    const b=e.target.closest('button[data-wm]'); if(!b) return;
    const k=b.dataset.wm;
    if(k==='onoff')        WM.on=!WM.on;
    else if(k==='mouse')   WM.mouse=!WM.mouse;
    else if(WM_CYCLE[k]){
      const list=WM_CYCLE[k];
      WM[k]=list[(list.indexOf(WM[k])+1)%list.length];
    }
    wmApply();
    toast('Watermark: '+k+' → '+(k==='onoff'?(WM.on?'shown':'hidden'):String(WM[k]).toUpperCase()));
  });
  const angle=$('#wmAngle');
  angle.addEventListener('input',e=>{
    WM.angle=Number(e.target.value); WM.speed='manual'; WM.on=true; wmApply();
  });
  angle.addEventListener('change',()=>toast('Manual angle: '+WM.angle+'° — press a speed to spin again'));
  document.addEventListener('click',e=>{
    if(!menu.hidden && !e.target.closest('#wmMenu') && !e.target.closest('#wmBtn')) menu.hidden=true;
  });
  /* subtle mouse parallax — "on control": the figure leans toward the cursor */
  document.addEventListener('mousemove',e=>{
    if(!WM.mouse || !WM.on || window.innerWidth<780) return;
    const x=(e.clientX/window.innerWidth-.5), y=(e.clientY/window.innerHeight-.5);
    document.documentElement.style.setProperty('--wm-tiltx', (-12 - y*11).toFixed(2)+'deg');
    document.documentElement.style.setProperty('--wm-tilty', (x*16).toFixed(2)+'deg');
  },{passive:true});
}

/* ---------- appearance: accent · dark mode · text size · coloured type ---------- */
const TEXT_SIZES = {normal:1, large:1.12, xlarge:1.26};
const SIZE_ORDER = ['normal','large','xlarge'];
let THEME = 'light', TSCALE = 1.12, THEME_CHOICE = 'light';

function systemPrefersDark(){
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function paintAccent(){
  const root=document.documentElement;
  root.style.setProperty('--primary', CFG.accent);
  root.style.setProperty('--primary2', CFG.accent+'cc');
  root.style.setProperty('--primary-soft', CFG.accent + (THEME==='dark' ? '30' : '14'));
}
/* Single source of truth for the menu tick: THEME_CHOICE is the user's
   saved preference (light / dark / auto), THEME is the resolved appearance. */
function syncThemeMenu(){
  $$('#themeMenu button[data-theme]').forEach(x=>{
    const on = x.dataset.theme === THEME_CHOICE;
    x.classList.toggle('on', on);
    x.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
function applyThemeChoice(){
  THEME = THEME_CHOICE === 'auto'
    ? (systemPrefersDark() ? 'dark' : 'light')
    : (THEME_CHOICE === 'dark' ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', THEME);
  const b=$('#themeBtn');
  if(b){ b.textContent = THEME==='dark' ? '☀' : '☾';
         b.title = 'Appearance — light / dark / follow system (currently ' + THEME + ')'; }
  paintAccent();
}
function setTheme(t, persist=true){
  THEME_CHOICE = (t==='dark' || t==='auto') ? t : 'light';
  applyThemeChoice();
  if(persist){ try{ localStorage.setItem('cc_theme', THEME_CHOICE); }catch(e){} }
  const m=$('#themeMenu'); if(m) m.hidden=true;
  syncThemeMenu();
}
function setTextSize(name, persist=true){
  TSCALE = TEXT_SIZES[name] || 1.12;
  document.documentElement.style.setProperty('--tscale', String(TSCALE));
  if(persist){ try{ localStorage.setItem('cc_textsize', String(TSCALE)); }catch(e){} }
  const b=$('#tsBtn'); if(b) b.title='Text size: '+name+' — click to cycle';
  return name;
}
function currentTextSize(){ return TSCALE<1.06 ? 'normal' : (TSCALE<1.19 ? 'large' : 'xlarge'); }
function cycleTextSize(){
  const next=SIZE_ORDER[(SIZE_ORDER.indexOf(currentTextSize())+1)%3];
  setTextSize(next);
  toast('Text size: '+next.toUpperCase());
}
function initAppearance(){
  // A user choice in localStorage wins over config.js (so it stays put on refresh).
  let savedTheme=null, savedScale=null;
  try{ savedTheme=localStorage.getItem('cc_theme');
       savedScale=parseFloat(localStorage.getItem('cc_textsize')); }catch(e){}
  setTheme(savedTheme || CFG.theme || 'light', false);
  if(savedScale && savedScale>0.8 && savedScale<1.6){
    TSCALE=savedScale; setTextSize(currentTextSize(), false);
  } else setTextSize(CFG.textSize||'large', false);
  document.documentElement.classList.toggle('colorful', CFG.colourfulText!==false);
  $('#tsBtn').addEventListener('click', cycleTextSize);
  $('#themeBtn').addEventListener('click', ()=>{
    const m=$('#themeMenu'); m.hidden=!m.hidden;
    const wm=$('#wmMenu'); if(wm) wm.hidden=true;
    syncThemeMenu();   /* always reflect the choice that is active right now */
  });
  /* "Follow my system" must react if the OS theme changes while the page is open */
  if(window.matchMedia){
    const mq=window.matchMedia('(prefers-color-scheme: dark)');
    const onOsChange=()=>{ if(THEME_CHOICE==='auto') applyThemeChoice(); };
    if(mq.addEventListener) mq.addEventListener('change', onOsChange);
    else if(mq.addListener) mq.addListener(onOsChange);
  }
  $('#themeMenu').addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.theme) setTheme(b.dataset.theme);
    if(b.dataset.act==='size') cycleTextSize();
  });
  document.addEventListener('click', e=>{
    const m=$('#themeMenu');
    if(m && !m.hidden && !e.target.closest('#themeMenu') && !e.target.closest('#themeBtn')) m.hidden=true;
  });
}

function applyConfig(){
  if(CFG.sidebarDark===false) document.documentElement.classList.add('light-sidebar');
  if(CFG.showLiveBadge===false){ const b=$('#liveBadge'); if(b) b.style.display='none'; }
  if(CFG.showHeaderClock===false){ const c=$('#topClock'); if(c) c.style.display='none'; }
  const nm=CFG.hospitalName;
  const brand=$('#brandName');
  if(brand){ const parts=nm.split(' '); brand.innerHTML = esc(parts[0]) + (parts.length>1?'<span>'+esc(parts.slice(1).join(' '))+'</span>':''); }
  const bs=$('#brandSub'); if(bs) bs.textContent=CFG.tagline;
  const cb=$('#crumbBrand'); if(cb) cb.textContent=nm;
  const sf=$('#sideFootTitle'); if(sf) sf.textContent=CFG.projectTitle+' · '+CFG.session;
  const ft=$('#footText'); if(ft) ft.innerHTML = `${esc(nm)} · ${esc(CFG.projectTitle)} · ${esc(CFG.studentName)} (${esc(CFG.rollNo)}) · ${esc(CFG.footerNote)}`;
  document.title = nm + ' — Hospital Management System';
  if(CFG.showAbout===false){ const a=$('#nav a[data-page="about"]'); if(a) a.style.display='none'; }
}

/* ---------- LIVE HEADER CLOCK (real local time, never hardcoded) ----------
   Shown on EVERY page in the top bar. Uses the browser Date object and
   Intl.DateTimeFormat().resolvedOptions().timeZone to detect your time zone.
   Refreshed once per second by setInterval in init(). No demo date here.   */
const TZ = (CFG.timeZone && CFG.timeZone!=='auto')
  ? CFG.timeZone : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
const pad2 = n => String(n).padStart(2,'0');
function utcOffset(d){
  const o=-d.getTimezoneOffset(), s=o>=0?'+':'-';
  return `UTC${s}${pad2(Math.floor(Math.abs(o)/60))}:${pad2(Math.abs(o)%60)}`;
}
function inZone(d, zone, opts){
  try{ return new Intl.DateTimeFormat('en-GB', Object.assign({timeZone:zone||TZ},opts)).format(d); }
  catch(e){ return '—'; }
}
function tickClocks(){
  const d = new Date();
  const hms = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  const dateShort = inZone(d,null,{day:'2-digit',month:'short',year:'numeric'});
  const weekday   = inZone(d,null,{weekday:'short'});
  const t = document.getElementById('topClockTime');
  const z = document.getElementById('topClockZone');
  if(t) t.textContent = hms;
  if(z) z.textContent = `${weekday}, ${dateShort} · ${TZ}`;
  const box = document.getElementById('topClock');
  if(box) box.title =
    `Real local time · ${inZone(d,null,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}` +
    ` · ${hms} · ${TZ} (${utcOffset(d)}) · ISO ${d.toISOString()}`;
}

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = v => (v===null||v===undefined) ? '' : String(v).replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nInt = v => (Number(v)||0).toLocaleString('en-IN');
const money = v => '₹' + (Number(v)||0).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:2});
const money2 = v => '₹' + (Number(v)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
const dmy = v => { if(!v) return '—'; const d=String(v).slice(0,10).split('-'); return d.length===3?`${d[2]}/${d[1]}/${d[0]}`:v; };

const STATUS = {'Completed':'green','Paid':'green','Available':'green','Active':'green','OK':'green','Discharged':'purple',
  'Cancelled':'red','Pending':'red','Occupied':'red','No Show':'red','REORDER':'red','Resigned':'red',
  'Scheduled':'blue','Admitted':'blue','Refunded':'gray','Partial':'amber','Maintenance':'amber','On Leave':'amber'};
const badge = v => `<span class="tag ${STATUS[v]||'gray'}">${esc(v)}</span>`;

async function api(path, opts={}){
  const r = await fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, opts));
  if(!r.ok) throw new Error('HTTP '+r.status+' on '+path);
  return r.json();
}
const post = (path, data) => api(path,{method:'POST',body:JSON.stringify(data)});

function toast(msg, kind=''){
  const t=document.createElement('div'); t.className='toast '+kind; t.textContent=msg;
  $('#toast').appendChild(t); setTimeout(()=>{t.style.opacity='0';t.style.transition='.3s';setTimeout(()=>t.remove(),300)},3400);
}
function loading(){ $('#view').innerHTML='<div class="loading"><div class="spinner"></div>Loading data from SQL…</div>'; }
function fail(e){ $('#view').innerHTML=`<div class="card card-pad"><div class="note err"><b>Could not load data.</b><br>${esc(e.message)}</div>
  <div class="note">Make sure <code class="inline">python3 server.py</code> is running, then refresh.</div></div>`; }

function head(title, desc, actions=''){
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${desc}</p></div><div class="row">${actions}</div></div>`;
}
function kpi(label,value,foot,icon){
  return `<div class="kpi"><div class="lab">${esc(label)}</div><div class="val">${value}</div>
          <div class="foot">${esc(foot)}</div><div class="kicon">${icon||''}</div></div>`;
}
function bars(data, color='', fmt=nInt){
  if(!data || !data.length) return '<div class="empty">No data to chart</div>';
  const max=Math.max(...data.map(d=>Number(d.value)||0),1);
  return '<div class="bars">'+data.map(d=>`<div class="bar-row">
      <div class="bar-lab" title="${esc(d.label)}">${esc(d.label)}</div>
      <div class="bar-track"><div class="bar-fill ${color}" style="width:${Math.max(3,(Number(d.value)||0)/max*100)}%"></div></div>
      <div class="bar-val">${fmt(d.value)}</div></div>`).join('')+'</div>';
}
function donut(data){
  if(!data||!data.length) return '<div class="empty">No data</div>';
  const colors=['#6366f1','#06b6d4','#10b981','#f59e0b','#f04438','#7f56d9'];
  const total=data.reduce((s,d)=>s+(Number(d.value)||0),0)||1; let acc=0;
  const segs=data.map((d,i)=>{const p=(Number(d.value)||0)/total*100;const s=`${colors[i%colors.length]} ${acc}% ${acc+p}%`;acc+=p;return s;});
  const legend=data.map((d,i)=>`<div class="li"><span class="sw" style="background:${colors[i%colors.length]}"></span>
     <span>${esc(d.label)}</span><span class="lv">${money(d.value)}</span></div>`).join('');
  return `<div class="donut-wrap"><div class="donut" style="background:conic-gradient(${segs.join(',')})">
    <div class="donut-c">${money(total)}</div></div><div class="legend">${legend}</div></div>`;
}
/* cols: [{k,label,cls,render}]  render(row) returns trusted HTML */
function table(rows, cols, empty='No rows returned'){
  if(!rows || !rows.length) return `<div class="table-wrap"><div class="empty">${esc(empty)}</div></div>`;
  const th=cols.map(c=>`<th>${esc(c.label||c.k)}</th>`).join('');
  const tr=rows.map(r=>'<tr>'+cols.map(c=>{
    const v = c.render ? c.render(r) : esc(r[c.k]);
    return `<td class="${c.cls||''}">${v}</td>`;
  }).join('')+'</tr>').join('');
  return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}
function sqlPanel(sql, hint='This is the exact SQL executed by the Python backend to produce this screen.'){
  return `<details class="sql-panel"><summary>SQL behind this screen</summary>
    <pre>${esc(sql||'')}</pre><div class="hint">${esc(hint)}</div></details>`;
}

/* ============================== PAGES ============================== */
const PAGES = {};
let PAGE_TIMER = null;   // interval owned by the current page (cleared on navigation)

PAGES.dashboard = async () => {
  const d = await api('/api/dashboard'); const k=d.kpi;
  $('#view').innerHTML = head('Dashboard','Live overview generated entirely by SQL aggregate queries.',
      `<button class="btn sec sm" onclick="window.print()">⎙ Print</button>
       <a class="btn sm" href="#/sql">⌘ Open SQL Console</a>`)
  + `<div class="grid g5">
      ${kpi('Registered patients',nInt(k.patients),'PATIENT table','♙')}
      ${kpi('Doctors on staff',nInt(k.doctors),'across 8 departments','✚')}
      ${kpi("Today's appointments",nInt(k.today),'27 Oct 2026','▤')}
      ${kpi('Rooms occupied',`${k.occupied} / ${k.rooms}`,'ADMISSION ⋈ ROOM','▣')}
      ${kpi('Total billed',money(k.revenue),'SUM(NetAmount)','₹')}
     </div>
     <div class="grid g2 mt">
       <div class="card card-pad"><h3 class="card-title">Month-wise appointments</h3>
         <div class="card-sub">GROUP BY strftime('%Y-%m', AppDate)</div>${bars(d.monthly)}</div>
       <div class="card card-pad"><h3 class="card-title">Visits by department</h3>
         <div class="card-sub">2-level LEFT JOIN + COUNT()</div>${bars(d.departments,'g')}</div>
     </div>
     <div class="grid g2 mt">
       <div class="card card-pad"><h3 class="card-title">Top prescribed medicines</h3>
         <div class="card-sub">M:N junction table PRESCRIPTION_DETAIL + SUM(Qty)</div>${bars(d.topmeds,'c')}</div>
       <div class="card card-pad"><h3 class="card-title">Revenue by payment mode</h3>
         <div class="card-sub">GROUP BY on the generated NetAmount column</div>${donut(d.modes)}</div>
     </div>
     <div class="grid g2 mt">
       <div class="card card-pad"><h3 class="card-title">Latest appointments</h3>
         <div class="card-sub">3-table INNER JOIN, ordered by date</div>
         ${table(d.recent,[{k:'AppDate',label:'Date',render:r=>dmy(r.AppDate)},{k:'AppTime',label:'Time'},
           {k:'Patient'},{k:'Doctor'},{k:'Status',render:r=>badge(r.Status)}])}
         <div class="stat-strip"><span>Pending bills <b>${nInt(k.pending)}</b></span>
           <span>Low-stock medicines <b>${nInt(k.lowstock)}</b></span></div></div>
       <div class="card card-pad"><h3 class="card-title">Why this is a DBMS project</h3>
         <div class="note">Every card above is a query result, not a hardcoded number. The KPIs use
         <b>scalar subqueries</b>, the charts use <b>GROUP BY</b>, and the medicine chart joins through a
         <b>junction table</b> that resolves a many-to-many relationship.</div>
         <p class="body-text">
         Open <a href="#/sql" style="color:var(--primary);font-weight:700">SQL Console</a> to run all 36 queries,
         view the <a href="#/schema" style="color:var(--primary);font-weight:700">data dictionary</a>,
         and study the <a href="#/er" style="color:var(--primary);font-weight:700">ER diagram</a>.</p>
       </div>
     </div>` + sqlPanel(d.sql);
};

PAGES.patients = async () => {
  const d = await api('/api/patients');
  const draw = rows => table(rows,[
      {k:'PatientID',label:'ID'},
      {k:'FullName',label:'Patient',render:r=>`<b>${esc(r.FullName)}</b>`},
      {k:'Gender',label:'Sex'},
      {k:'DOB',label:'DOB',render:r=>dmy(r.DOB)},
      {k:'BloodGroup',label:'Blood'},
      {k:'Phone'},{k:'City'},
      {k:'LastVisit',label:'Last visit',render:r=>dmy(r.LastVisit)},
      {k:'Visits',label:'Visits',cls:'num'},
      {k:'TotalSpend',label:'Total spend',cls:'num',render:r=>money2(r.TotalSpend)}]);
  $('#view').innerHTML = head('Patients','Searchable patient register with correlated subqueries.',
      `<button class="btn sec sm" onclick="exportCsv('PATIENT')">↓ Export CSV</button>`)
    + `<div class="card card-pad"><div class="row" style="margin-bottom:14px">
        <div class="search"><input id="psearch" placeholder="Search name, city or blood group…"></div>
        <span class="tag blue" id="pcount">${d.rows.length} patients</span></div>
        <div id="ptable">${draw(d.rows)}</div></div>`
    + sqlPanel(d.sql,'LastVisit and TotalSpend are correlated subqueries. Search uses parameterised LIKE (?) to prevent SQL injection.');
  let timer;
  $('#psearch').addEventListener('input', e=>{
    clearTimeout(timer);
    timer=setTimeout(async()=>{
      const r=await api('/api/patients?q='+encodeURIComponent(e.target.value));
      $('#ptable').innerHTML=draw(r.rows); $('#pcount').textContent=r.rows.length+' patients';
      $('.sql-panel pre').textContent=r.sql;
    },220);
  });
};

PAGES.doctors = async () => {
  const d = await api('/api/doctors');
  $('#view').innerHTML = head('Doctors','Doctor master joined with DEPARTMENT; visit counts from a LEFT JOIN.',
      `<button class="btn sec sm" onclick="exportCsv('DOCTOR')">↓ Export CSV</button>`)
    + `<div class="card card-pad">${table(d.rows,[
        {k:'DoctorID',label:'ID'},{k:'FullName',label:'Doctor',render:r=>`<b>${esc(r.FullName)}</b>`},
        {k:'DeptName',label:'Department'},{k:'Specialization',label:'Specialisation'},
        {k:'Qualification'},{k:'ExperienceYrs',label:'Exp (yrs)',cls:'num'},
        {k:'ConsultFee',label:'Fee',cls:'num',render:r=>money(r.ConsultFee)},
        {k:'Appointments',label:'Appointments',cls:'num'},
        {k:'Status',render:r=>badge(r.Status)}])}</div>` + sqlPanel(d.sql);
};

PAGES.appointments = async () => {
  /* The sample data is anchored to CFG.demoDate, so this screen has its own
     adjustable "clinic clock". It is pure SQL: the date/time are parameters in
     the WHERE clause. Your REAL live clock stays in the top bar of every page. */
  const AST = { tab:'all', status:'', patient:'', realtime:false,
                date: CFG.demoDate, time:String(CFG.demoClockTime||'11:05').slice(0,5) };
  const TABS = [['all','All'],['ongoing','● Ongoing now'],['upcoming','↑ Upcoming'],
                ['today','Today'],['past','Past / completed']];
  const tabs = TABS.map(([k,l])=>
    `<button class="view-tab${k==='all'?' on':''}" data-v="${k}">${l}<span class="cnt" id="cnt-${k}">…</span></button>`).join('');

  const draw = rows => table(rows,[
      {k:'AppID',label:'#'},
      {k:'AppDate',label:'Date',render:r=>dmy(r.AppDate)},
      {k:'AppTime',label:'Time',render:r=>esc(r.AppTime)+(AST.tab==='ongoing'
          ? ' <span class="status-now">● IN PROGRESS</span>' : '')},
      {k:'Patient',render:r=>`<b>${esc(r.Patient)}</b>`},
      {k:'Doctor'},{k:'Department'},{k:'Reason'},
      {k:'Status',render:r=>badge(r.Status)},
      {k:'ConsultFee',label:'Fee',cls:'num',render:r=>money(r.ConsultFee)}],
      'No appointments match this view. Try a different clinic clock time or the "Use my real time" button.');

  const pats = await api('/api/patients');
  const popts = '<option value="">All patients</option>' + pats.rows.map(p=>
      `<option value="${p.PatientID}">${esc(p.FullName)}</option>`).join('');

  $('#view').innerHTML = head('Appointments',
      'Upcoming &amp; ongoing appointments for any patient — filtered by real SQL date/time comparisons.',
      `<span class="tag green"><span class="live-dot"></span>LIVE HEADER CLOCK</span>
       <a class="btn sec sm" href="#/book">＋ Book appointment</a>`)
   + `<div class="clock-bar">
        <span class="cb-lab">◷ Clinic clock</span>
        <input type="date" id="clkDate" value="${esc(AST.date)}" title="Reference date for the SQL query">
        <input type="time" id="clkTime" value="${esc(AST.time)}" title="Reference time for the SQL query">
        <button class="tbtn" id="clkReal">◉ Use my real time</button>
        <button class="tbtn" id="clkDemo">↺ Demo clock</button>
        <span class="cb-note" id="clkNote"></span>
      </div>
      <div class="view-tabs" id="viewtabs">${tabs}</div>
      <div class="row" style="margin-bottom:12px">
        <select id="pfilter" style="width:240px">${popts}</select>
        <div id="chips" class="row"></div>
      </div>
      <div class="card card-pad"><div id="atable"><div class="loading">Loading appointments…</div></div></div>`
   + sqlPanel('-- press a tab to load the SQL',
      'Ongoing = a Scheduled appointment whose 60-minute slot contains the clinic clock time. Upcoming = Scheduled appointments after it. Both are SQL WHERE clauses, not JavaScript tricks.');

  const refresh = async () => {
    const qs=`date=${encodeURIComponent(AST.date)}&time=${encodeURIComponent(AST.time)}&patient=${encodeURIComponent(AST.patient)}`;
    const [v,a] = await Promise.all([
      api('/api/appointment_views?'+qs),
      api('/api/appointments?patient='+encodeURIComponent(AST.patient))
    ]);
    const c=v.counts||{};
    const counts={all:c.AllRows||0,ongoing:c.Ongoing||0,upcoming:c.Upcoming||0,
                  today:c.Today||0,past:c.Past||0};
    TABS.forEach(([k])=>{ const el=document.getElementById('cnt-'+k); if(el) el.textContent=counts[k]; });
    const chips=['<button class="chip on" data-s="">All statuses</button>'].concat(
      (a.stats||[]).map(s=>`<button class="chip" data-s="${esc(s.Status)}">${esc(s.Status)} (${s.Cnt})</button>`)).join('');
    $('#chips').innerHTML=chips;
    $$('#chips .chip').forEach(x=>x.classList.toggle('on', x.dataset.s===AST.status));
    let rows = AST.tab==='all' ? a.rows : (v.views[AST.tab]||[]);
    if(AST.status) rows=rows.filter(r=>r.Status===AST.status);
    $('#atable').innerHTML=draw(rows);
    const pre=$('.sql-panel pre'); if(pre) pre.textContent = AST.tab==='all' ? a.sql : v.sql;
    $('#clkNote').innerHTML = AST.realtime
      ? `Using <b>your real local time</b> (${esc(TZ)}). Counts update every 30 seconds.`
      : `Demo data is dated <b>${esc(AST.date)}</b>. Drag the time to watch appointments move from <b>Upcoming</b> → <b>Ongoing</b> → <b>Past</b>.`;
  };

  $('#viewtabs').addEventListener('click',e=>{
    const b=e.target.closest('.view-tab'); if(!b)return;
    AST.tab=b.dataset.v;
    $$('#viewtabs .view-tab').forEach(x=>x.classList.toggle('on',x===b));
    refresh();
  });
  $('#chips').addEventListener('click',e=>{
    const b=e.target.closest('.chip'); if(!b)return;
    AST.status=b.dataset.s;
    $$('#chips .chip').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    refresh();
  });
  $('#pfilter').addEventListener('change',e=>{ AST.patient=e.target.value; refresh(); });
  $('#clkDate').addEventListener('change',e=>{ AST.date=e.target.value||CFG.demoDate; AST.realtime=false; refresh(); });
  $('#clkTime').addEventListener('change',e=>{ AST.time=e.target.value||'11:05'; AST.realtime=false; refresh(); });
  $('#clkDemo').addEventListener('click',()=>{
    if(PAGE_TIMER){clearInterval(PAGE_TIMER);PAGE_TIMER=null;}
    AST.realtime=false; AST.date=CFG.demoDate; AST.time=String(CFG.demoClockTime||'11:05').slice(0,5);
    $('#clkDate').value=AST.date; $('#clkTime').value=AST.time;
    refresh(); toast('Demo clinic clock restored');
  });
  $('#clkReal').addEventListener('click',()=>{
    AST.realtime=true;
    const sync=()=>{
      const d=new Date();
      AST.date=`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
      AST.time=`${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
      $('#clkDate').value=AST.date; $('#clkTime').value=AST.time;
      refresh();
    };
    sync(); toast('Using your real local time ('+TZ+')','ok');
    if(PAGE_TIMER) clearInterval(PAGE_TIMER);
    PAGE_TIMER=setInterval(sync,30000);
  });
  await refresh();
};

/* ---------------- BEDS / ROOMS with current patient details ---------------- */
PAGES.rooms = async () => {
  const d = await api('/api/rooms'); const k=d.kpi||{};
  const pct = k.total ? Math.round((k.occupied/k.total)*100) : 0;
  const card = r => {
    const occ = !!r.AdmissionID;
    const cls = r.RoomStatus==='Occupied' ? 'occupied'
              : r.RoomStatus==='Maintenance' ? 'maintenance'
              : /icu/i.test(r.RoomType||'') ? 'icu' : '';
    const patient = occ ? `<div class="room-patient">
        <div class="pl">Currently admitted · Patient #${r.PatientID}</div>
        <div class="pn">${esc(r.Patient||'—')}</div>
        <div class="pd">
          <b>${esc(r.Gender||'—')}</b> · Blood ${esc(r.Blood||'—')} · ${esc(r.City||'—')}<br>
          <b>Diagnosis:</b> ${esc(r.Diagnosis||'—')}<br>
          <b>Doctor:</b> ${esc(r.Doctor||'—')} <span style="opacity:.75">(${esc(r.Specialization||'—')})</span><br>
          <b>Admitted:</b> ${dmy(r.AdmitDate)} · ${esc(r.DaysStayed)} day(s)<br>
          <b>Phone:</b> ${esc(r.Phone||'—')}<br>
          <b>Running room bill:</b> ${money(r.CurrentBill)}
        </div></div>` : `<div class="room-empty"><span class="be">▤</span>
          <b>No patient in this bed</b><br>Ready for the next admission</div>`;
    return `<div class="room-card ${cls}" data-status="${esc(r.RoomStatus)}" data-type="${esc(r.RoomType)}">
      <div class="room-top"><div><div class="room-no">${esc(r.RoomNo)}</div>
        <div class="room-type">${esc(r.RoomType)} · ${esc(r.Department||'General')}</div></div>
        ${badge(r.RoomStatus)}</div>
      <div class="room-charge">${money(r.ChargesPerDay)} <span class="room-meta">/ day</span></div>
      <div class="room-meta">Room ID ${r.RoomID}${occ?' · Admission #'+r.AdmissionID:''}</div>
      ${patient}</div>`;
  };
  $('#view').innerHTML = head('Beds / Rooms',
      'Ward occupancy with the patient currently in each bed — a LEFT JOIN from ROOM to ADMISSION to PATIENT and DOCTOR.',
      `<button class="btn sec sm" onclick="exportCsv('ROOM')">↓ Export CSV</button>`)
   + `<div class="grid g5">
       ${kpi('Total rooms',nInt(k.total),'ROOM table','▣')}
       ${kpi('Occupied beds',nInt(k.occupied),pct+'% occupancy','●')}
       ${kpi('Available beds',nInt(k.available),'ready to admit','○')}
       ${kpi('Maintenance',nInt(k.maintenance),'out of service','⚒')}
       ${kpi('Avg. charge / day',money(k.avgcharge),'AVG(ChargesPerDay)','₹')}
      </div>
      <div class="card card-pad mt">
        <div class="row" style="justify-content:space-between;margin-bottom:14px">
          <div class="seg" id="roomFilter">
            <button class="on" data-f="all">All rooms</button>
            <button data-f="Occupied">● Occupied</button>
            <button data-f="Available">○ Available</button>
            <button data-f="Maintenance">⚒ Maintenance</button>
            <button data-f="ICU">✚ ICU / Critical</button>
          </div>
          <div class="bed-legend"><span><i style="background:var(--red)"></i>Occupied</span>
            <span><i style="background:var(--green)"></i>Available</span>
            <span><i style="background:var(--amber)"></i>Maintenance</span></div>
        </div>
        <div class="room-grid" id="roomGrid">${d.rows.map(card).join('')}</div>
      </div>
      <div class="card card-pad mt"><h3 class="card-title">Full room register (SQL result set)</h3>
        <div class="card-sub">Every column below comes from the joined query — nothing is typed in by hand.</div>
        ${table(d.rows,[
          {k:'RoomNo',label:'Room'},{k:'RoomType',label:'Type'},{k:'Department'},
          {k:'ChargesPerDay',label:'₹/day',cls:'num',render:r=>money(r.ChargesPerDay)},
          {k:'RoomStatus',label:'Status',render:r=>badge(r.RoomStatus)},
          {k:'Patient',label:'Current patient',render:r=>r.Patient?`<b>${esc(r.Patient)}</b>`:'—'},
          {k:'Blood',label:'Blood'},{k:'Diagnosis'},
          {k:'Doctor'},{k:'AdmitDate',label:'Admitted',render:r=>dmy(r.AdmitDate)},
          {k:'DaysStayed',label:'Days',cls:'num'},
          {k:'CurrentBill',label:'Room bill',cls:'num',render:r=>r.CurrentBill!==null?money(r.CurrentBill):'—'}
        ])}</div>
      <div class="note"><b>Referential integrity in action:</b> ROOM.Status is kept in sync by the
      <code class="inline">trg_admission_insert</code> and <code class="inline">trg_admission_discharge</code>
      triggers. Rooms with no admitted patient are still listed because the query uses a <b>LEFT JOIN</b>.</div>`
   + sqlPanel(d.sql,'LEFT JOIN is essential here: an INNER JOIN would hide every available bed.');

  $('#roomFilter').addEventListener('click',e=>{
    const b=e.target.closest('button[data-f]'); if(!b)return;
    $$('#roomFilter button').forEach(x=>x.classList.toggle('on',x===b));
    const f=b.dataset.f;
    $$('#roomGrid .room-card').forEach(c=>{
      const ok = f==='all' || (f==='ICU' ? /icu/i.test(c.dataset.type||'') : c.dataset.status===f);
      c.style.display = ok ? '' : 'none';
    });
  });
};

PAGES.book = async () => {
  const o = await api('/api/book/options');
  const po=o.patients.map(p=>`<option value="${p.PatientID}">${esc(p.FullName)}</option>`).join('');
  const doo=o.doctors.map(d=>`<option value="${d.DoctorID}">${esc(d.FullName)} — ${esc(d.DeptName)} (${money(d.ConsultFee)})</option>`).join('');
  const to=o.times.map(t=>`<option value="${t}">${t}</option>`).join('');
  $('#view').innerHTML = head('Book Appointment','A real database transaction: appointment + bill are committed together.')
   + `<div class="grid g2">
      <div class="card card-pad"><h3 class="card-title">New appointment</h3>
        <div class="card-sub">All values are bound with ? placeholders — never string concatenation.</div>
        <form id="bform">
          <div class="field"><label>Patient</label><select name="patient">${po}</select></div>
          <div class="field"><label>Doctor</label><select name="doctor">${doo}</select></div>
          <div class="two-col"><div class="field"><label>Date</label><input type="date" name="date" value="2026-11-05" required></div>
          <div class="field"><label>Time slot</label><select name="time">${to}</select></div></div>
          <div class="field"><label>Reason for visit</label><input name="reason" value="Routine checkup"></div>
          <button class="btn" type="submit">Book appointment → run transaction</button>
        </form><div id="bresult"></div></div>
      <div class="card card-pad"><h3 class="card-title">What happens in the database</h3>
        <div class="card-sub">BEGIN → INSERT → INSERT → COMMIT. Any error triggers ROLLBACK, so you never get an appointment without a bill.</div>
        ${sqlPanel(`BEGIN TRANSACTION;
  INSERT INTO APPOINTMENT
    (PatientID,DoctorID,AppDate,AppTime,Reason,Status,ConsultFee)
  VALUES (?,?,?,?,?,'Scheduled',?);

  INSERT INTO BILL
    (PatientID,BillDate,BillType,RefID,GrossAmount,Discount,TaxPercent,PaymentMode,PaidStatus)
  VALUES (?,?,'Consultation',?,?,0,5,'UPI','Paid');
COMMIT;`,'Try booking the same doctor, date and twice — the UNIQUE(DoctorID, AppDate, AppTime) constraint will reject it.').replace('<details','<details open')}
        <div class="note">The <code class="inline">NetAmount</code> on the bill is a <b>generated column</b>:
        it is computed automatically from GrossAmount, Discount and TaxPercent. This is a derived attribute in the ER diagram.</div>
      </div></div>`
   + sqlPanel(`-- Constraints demonstrated here
-- 1. UNIQUE (DoctorID, AppDate, AppTime)  -> prevents double booking
-- 2. FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID)
-- 3. CHECK (Status IN ('Scheduled','Completed','Cancelled','No Show'))
-- 4. ACID transaction: both INSERTs succeed or neither does`,
      'These are real DDL constraints from schema.sql, enforced by SQLite with PRAGMA foreign_keys = ON.');
  $('#bform').addEventListener('submit', async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const data=Object.fromEntries(f.entries());
    const btn=$('#bform button'); btn.disabled=true; btn.textContent='Running transaction…';
    try{
      const r=await post('/api/book',data);
      $('#bresult').innerHTML=`<div class="note ${r.ok?'ok':'err'}"><b>${esc(r.message||r.error)}</b></div>`;
      if(r.ok){ toast('Appointment booked & bill generated','ok'); e.target.reset(); }
      else toast(r.error,'err');
    }catch(err){ $('#bresult').innerHTML=`<div class="note err">${esc(err.message)}</div>`; }
    btn.disabled=false; btn.textContent='Book appointment → run transaction';
  });
};

PAGES.billing = async () => {
  const d = await api('/api/billing');
  $('#view').innerHTML = head('Billing & Revenue','Revenue analytics from the generated NetAmount column.',
      `<button class="btn sec sm" onclick="exportCsv('BILL')">↓ Export CSV</button>
       <button class="btn sec sm" onclick="window.print()">⎙ Print report</button>`)
   + `<div class="grid g3">
      ${kpi('Total billed',money(d.kpi.total),'SUM(NetAmount)','₹')}
      ${kpi('Number of bills',nInt(d.kpi.bills),'COUNT(*) from BILL','▤')}
      ${kpi('Pending dues',money(d.kpi.pending),'conditional aggregation','!')}
     </div>
     <div class="card card-pad mt"><h3 class="card-title">Monthly revenue</h3>
       <div class="card-sub">SELECT strftime('%Y-%m',BillDate), ROUND(SUM(NetAmount),2) FROM BILL GROUP BY 1</div>
       ${bars(d.monthly,'g',money)}</div>
     <div class="card card-pad mt"><h3 class="card-title">All bills</h3>
       <div class="card-sub">BILL ⋈ PATIENT · NetAmount is a virtual generated column</div>
       ${table(d.rows,[
         {k:'BillID',label:'#'},{k:'BillDate',label:'Date',render:r=>dmy(r.BillDate)},
         {k:'Patient',render:r=>`<b>${esc(r.Patient)}</b>`},{k:'BillType',label:'Type'},
         {k:'GrossAmount',label:'Gross',cls:'num',render:r=>money2(r.GrossAmount)},
         {k:'Discount',label:'Discount',cls:'num',render:r=>money2(r.Discount)},
         {k:'TaxPercent',label:'Tax %',cls:'num'},
         {k:'NetAmount',label:'Net',cls:'num',render:r=>`<b>${money2(r.NetAmount)}</b>`},
         {k:'PaymentMode',label:'Mode'},{k:'PaidStatus',label:'Status',render:r=>badge(r.PaidStatus)}])}</div>`
   + sqlPanel(d.sql);
};

PAGES.pharmacy = async () => {
  const d = await api('/api/pharmacy');
  $('#view').innerHTML = head('Pharmacy Inventory','Stock levels, reorder alerts and expiry tracking — all from SQL.',
      `<button class="btn sec sm" onclick="exportCsv('MEDICINE')">↓ Export CSV</button>`)
   + `<div class="grid g3">
      ${kpi('Medicine types',nInt(d.kpi.items),'MEDICINE table','⬡')}
      ${kpi('Below reorder level',nInt(d.kpi.low),'needs a purchase order','!')}
      ${kpi('Expiring in 90 days',nInt(d.kpi.expiring),'date arithmetic','◷')}
     </div>
     <div class="card card-pad mt"><h3 class="card-title">Inventory</h3>
       <div class="card-sub">CASE expression builds the REORDER / OK badge; rows sorted by urgency.</div>
       ${table(d.rows,[
         {k:'MedicineID',label:'ID'},{k:'MedName',label:'Medicine',render:r=>`<b>${esc(r.MedName)}</b>`},
         {k:'Category'},{k:'Manufacturer'},
         {k:'UnitPrice',label:'Unit price',cls:'num',render:r=>money2(r.UnitPrice)},
         {k:'StockQty',label:'Stock',cls:'num'},
         {k:'ReorderLevel',label:'Reorder at',cls:'num'},
         {k:'ExpiryDate',label:'Expiry',render:r=>dmy(r.ExpiryDate)},
         {k:'Alert',label:'Alert',render:r=>badge(r.Alert)}])}</div>
     <div class="note"><b>Trigger demo:</b> the <code class="inline">trg_presc_detail_stock</code> trigger
     automatically reduces <code class="inline">MEDICINE.StockQty</code> whenever a row is inserted into
     PRESCRIPTION_DETAIL. Run Q18 in the SQL Console to see prescribed medicines, then Q20 to see stock alerts.</div>`
   + sqlPanel(d.sql);
};

/* ---------------- SQL CONSOLE (the star of the project) ---------------- */
let BANK=[];
PAGES.sql = async () => {
  const d = await api('/api/queries'); BANK=d.bank||[];
  const groups={}; BANK.forEach(x=>(groups[x.group]=groups[x.group]||[]).push(x));
  const list=Object.entries(groups).map(([g,items])=>
     `<div class="qgroup">${esc(g)}</div>`+items.map(x=>
       `<div class="qitem" data-id="${x.id}" title="${esc(x.title)}"><b>${x.id}</b>${esc(x.title)}</div>`).join('')).join('');
  const initial = BANK.find(x=>x.id==='Q18')?.sql ||
      'SELECT d.FullName, dp.DeptName, d.ConsultFee\nFROM DOCTOR d JOIN DEPARTMENT dp ON d.DeptID=dp.DeptID\nORDER BY d.ConsultFee DESC LIMIT 10;';
  $('#view').innerHTML = head('SQL Console & Query Bank',
      'A live SQL editor on the real database — 36 queries from simple SELECT to transactions.',
      `<span class="tag blue">${BANK.length} queries</span>`)
   + `<div class="console">
      <div class="card qbank"><div class="qbank-head"><b class="mini-head" style="margin:0">Query bank</b>
        <div style="font-size:calc(11px * var(--tscale));color:var(--soft);margin:4px 0 9px">Click a query to load it into the editor</div>
        <input id="qsearch" placeholder="⌕  Search queries…"></div><div id="qlist">${list}</div></div>
      <div>
        <div class="card card-pad"><h3 class="card-title">SQL editor</h3>
          <div class="card-sub">Real SQL executed by the Python backend against hospital.db. SELECT, JOIN, VIEW, TRIGGER, TRANSACTION — everything works.</div>
          <textarea id="editor" class="editor" spellcheck="false">${esc(initial)}</textarea>
          <div class="row" style="margin-top:12px">
            <button class="btn" id="runBtn">▶ Run query</button>
            <button class="btn sec" id="verifyBtn">✓ Verify all 36</button>
            <button class="btn sec" id="planBtn">⌁ Query plan</button>
            <button class="btn ghost" id="clearBtn">Clear</button>
            <button class="btn warn" id="resetBtn">↻ Reset DB</button>
          </div>
          <div id="sqlmsg"></div>
          <div id="verifyout"></div>
        </div>
        <div class="card card-pad result-box"><h3 class="card-title">Result set</h3>
          <div id="result"><div class="empty">Run a query to see the output here.</div></div></div>
      </div></div>`
   + sqlPanel(`-- Every one of the ${BANK.length} queries in the bank is stored in queries.sql
-- and is executed here with sqlite3. Examples of what the examiner can try:
--   Q14  correlated subquery      Q18  4-table join via M:N junction
--   Q27  EXPLAIN QUERY PLAN      Q28  BEGIN / COMMIT transaction
--   Q32  referential integrity audit`,
      'This page is the proof that the project uses a real relational database, not hardcoded data.');

  $('#qlist').addEventListener('click',e=>{
    const it=e.target.closest('.qitem'); if(!it)return;
    const q=BANK.find(x=>x.id===it.dataset.id); if(!q)return;
    $('#editor').value=q.sql; $('#sqlmsg').innerHTML=`<div class="note">Loaded <b>${esc(q.id)}</b> — ${esc(q.title)}</div>`;
    window.scrollTo({top:0,behavior:'smooth'});
  });
  $('#qsearch').addEventListener('input',e=>{
    const s=e.target.value.toLowerCase();
    $$('#qlist .qitem').forEach(x=>x.style.display=x.textContent.toLowerCase().includes(s)?'':'none');
    $$('#qlist .qgroup').forEach(g=>{let n=g.nextElementSibling,vis=false;
      while(n&&!n.classList.contains('qgroup')){if(n.style.display!=='none')vis=true;n=n.nextElementSibling;}
      g.style.display=vis?'':'none';});
  });
  $('#runBtn').addEventListener('click',()=>runEditor($('#editor').value));
  $('#clearBtn').addEventListener('click',()=>{$('#editor').value='';$('#result').innerHTML='';$('#sqlmsg').innerHTML='';});
  $('#planBtn').addEventListener('click',()=>{
    $('#editor').value="EXPLAIN QUERY PLAN\nSELECT AppID, AppDate, DoctorID FROM APPOINTMENT\nWHERE AppDate BETWEEN '2026-09-01' AND '2026-10-31';";
    runEditor($('#editor').value);
  });
  $('#resetBtn').addEventListener('click',async()=>{
    if(!confirm('Rebuild hospital.db from schema.sql + seed.sql?\nThis discards any changes made in the console.'))return;
    const r=await post('/api/reset',{});
    $('#sqlmsg').innerHTML=`<div class="note ok">${esc(r.message)}</div>`; toast('Database rebuilt','ok');
  });
  $('#verifyBtn').addEventListener('click',async()=>{
    $('#verifyBtn').disabled=true; $('#verifyBtn').textContent='Verifying…';
    $('#verifyout').innerHTML='<div class="loading"><div class="spinner"></div>Executing all 36 queries on a temporary copy…</div>';
    try{
      const r=await post('/api/queries/verify',{}); const res=r.results||[];
      const pass=res.filter(x=>x.status==='PASS').length;
      $('#verifyout').innerHTML=`<div class="note ${pass===res.length?'ok':'err'}"><b>${pass} / ${res.length} queries passed.</b>
        Executed on a temporary copy of the database, so your live data is unchanged.</div>
        <div class="verify-list">${res.map(x=>`<div class="vrow"><span class="vid">${esc(x.id)}</span>
          <span class="vtitle">${esc(x.title)}</span>
          <span class="tag ${x.status==='PASS'?'green':'red'}">${x.status}</span></div>`).join('')}</div>`;
    }catch(e){$('#verifyout').innerHTML=`<div class="note err">${esc(e.message)}</div>`;}
    $('#verifyBtn').disabled=false; $('#verifyBtn').textContent='✓ Verify all 36';
  });
};
async function runEditor(sql){
  const msg=$('#sqlmsg'), out=$('#result');
  msg.innerHTML='<div class="loading" style="padding:14px"><div class="spinner"></div>Executing…</div>';
  try{
    const r=await post('/api/sql',{sql});
    if(r.error){ msg.innerHTML=`<div class="note err"><b>SQL error:</b> ${esc(r.error)}</div>`; out.innerHTML=''; return; }
    msg.innerHTML=`<div class="note ok">${esc(r.message)}</div>`;
    if(!r.columns||!r.columns.length){ out.innerHTML='<div class="empty">Statement executed — no result set (DDL / DML / transaction).</div>'; return; }
    out.innerHTML=`<div class="result-meta">${r.rows.length} row(s) · ${r.columns.length} column(s)</div>`
      + table(r.rows.map(row=>Object.fromEntries(r.columns.map((c,i)=>[c,row[i]]))),
              r.columns.map(c=>({k:c,label:c})));
  }catch(e){ msg.innerHTML=`<div class="note err">${esc(e.message)}</div>`; }
}

PAGES.schema = async () => {
  const d = await api('/api/schema');
  const cards=d.tables.map(t=>`<div class="card schema-card">
      <div class="schema-head"><b>${esc(t.name)}</b><span class="tag blue">${nInt(t.rows)} rows</span></div>
      ${table(t.columns,[
        {k:'name',label:'Column',render:r=>`<b>${esc(r.name)}</b>`},
        {k:'type',label:'Type'},{k:'pk',label:'PK',render:r=>r.pk?'🔑':''},
        {k:'notnull',label:'NOT NULL',render:r=>r.notnull?'✔':''},
        {k:'dflt_value',label:'Default',render:r=>r.dflt_value?esc(r.dflt_value):'—'}]).replace('max-height:560px','max-height:none')}
      ${t.fks.length?`<div class="fk-line"><b>Foreign keys:</b> ${t.fks.map(f=>
          `${esc(f.from)} → ${esc(f.table)}(${esc(f.to)})`).join(' · ')}</div>`:''}
    </div>`).join('');
  $('#view').innerHTML = head('Schema & Data Dictionary','Live structures read from sqlite_master and PRAGMA — use these tables in your report.')
   + `<div class="grid g4">${d.tables.map(t=>kpi(t.name.replace('_',' '),nInt(t.rows),'rows','▥')).join('')}</div>
      <div class="note mt"><b>Total:</b> ${d.tables.length} tables. Every foreign key has ON DELETE / ON UPDATE rules;
      every table has a PRIMARY KEY; CHECK and UNIQUE constraints are defined in <code class="inline">schema.sql</code>.</div>
      <div class="schema-grid mt">${cards}</div>
      <div class="card card-pad mt"><h3 class="card-title">Views, triggers & indexes</h3>
        <div class="card-sub">Database objects stored in sqlite_master</div>
        ${table(d.objects,[{k:'type',label:'Type',render:r=>badge(r.type.toUpperCase()==='VIEW'?'Scheduled':r.type.toUpperCase()==='TRIGGER'?'Discharged':'Completed')},
          {k:'name',label:'Name'},{k:'tbl_name',label:'On table'}])}</div>` + sqlPanel(d.sql);
};

PAGES.er = async () => {
  const svg = await (await fetch('/api/er')).text();
  $('#view').innerHTML = head('Entity Relationship Diagram',
      '10 entities · 13 relationships · two M:N relationships resolved with junction tables.',
      `<a class="btn sm" href="/download/er_diagram.svg">↓ Download SVG</a>
       <a class="btn sec sm" href="/download/er_diagram.png">↓ Download PNG</a>`)
   + `<div class="er-box">${svg}</div>`;
};


PAGES.about = async () => {
  const m = await api('/api/meta');
  const rows = [
    ['Project title', CFG.projectTitle + ' — ' + CFG.hospitalName],
    ['Subject', CFG.subject],
    ['Student name', CFG.studentName],
    ['Roll number', CFG.rollNo],
    ['Course / semester', CFG.course],
    ['College', CFG.college],
    ['Submitted to', CFG.teacher],
    ['Session', CFG.session]
  ];
  $('#view').innerHTML = head('Project Info','Your submission details — edit them in frontend/config.js.',
      `<a class="btn sec sm" href="#/downloads">↓ Downloads</a>`)
   + `<div class="grid g2">
      <div class="card card-pad"><h3 class="card-title">Submitted by</h3>
        <div class="card-sub">Change these values in <code class="inline">frontend/config.js</code>, save, then press Ctrl+F5.</div>
        ${table(rows.map(([a,b])=>({a,b})),[
          {k:'a',label:'Field',render:r=>`<b>${esc(r.a)}</b>`},
          {k:'b',label:'Value',render:r=>esc(r.b)}]).replace('max-height:560px','max-height:none')}</div>
      <div class="card card-pad"><h3 class="card-title">Technical summary</h3>
        <div class="card-sub">Numbers read live from the database</div>
        <div class="grid g2" style="gap:12px">
          ${kpi('Tables',m.tables,'normalised relational tables','▥')}
          ${kpi('SQL queries',m.queries,'verified and runnable','⌘')}
          ${kpi('Patients',nInt(m.counts.PATIENT),'sample records','♙')}
          ${kpi('Appointments',nInt(m.counts.APPOINTMENT),'sample records','▤')}
        </div>
        <div class="note mt"><b>Stack:</b> Python 3 (http.server + sqlite3) backend ·
        vanilla JavaScript SPA frontend · SQLite database. No frameworks, no internet,
        no API keys.</div>
        <p class="body-text">
        <b>Database objects:</b> 13 foreign keys, 3 views, 3 triggers, 6 indexes,
        generated columns, CHECK / UNIQUE constraints, and ACID transactions.</p></div>
     </div>
     <div class="card card-pad mt"><h3 class="card-title">Want to change the look?</h3>
       <p class="body-text">
       Open <code class="inline">frontend/config.js</code> in VS Code. You can change the
       <b>hospital name</b>, <b>tagline</b>, <b>your name / roll no / college / teacher</b>,
       the <b>theme colour</b> (any hex value), the <b>text size</b>,
       <b>dark mode</b>, <b>coloured typography</b>, the <b>3D watermark</b> defaults, the
       <b>sidebar style</b> and the <b>footer text</b> — all in one file. Save and press <b>Ctrl+F5</b> in Chrome.
       No server restart needed. You can also use the <b>A＋</b> and <b>☾</b> buttons in the
       top-right corner; your choice is remembered by the browser. Use the <b>◈</b> button to
       control the 3D logo watermark.</p></div>
     <div class="grid g2 mt">
       <div class="card card-pad"><h3 class="card-title">Our logo</h3>
         <div class="card-sub">Custom vector logo — medical cross + heartbeat monitor trace</div>
         <img class="brand-logo-full" src="/logo_full.svg" alt="City Care Hospital logo">
         <p class="body-text">Find editable SVG and PNG versions on the
         <a href="#/downloads" style="color:var(--primary);font-weight:700">Downloads</a> page.</p></div>
       <div class="card card-pad"><h3 class="card-title">What's new in this version</h3>
         <p class="body-text">
         ✓ Bigger, scalable text (three sizes) &nbsp; ✓ Gradient / coloured typography<br>
         ✓ Dark mode toggle (light / dark / follow system)<br>
         ✓ Custom City Care Hospital logo<br>
         ✓ <b>Beds / Rooms</b> page with the patient currently in each bed<br>
         ✓ <b>Live date &amp; time in the top bar of every page</b> (auto-detected time zone)<br>
         ✓ <b>Upcoming / Ongoing / Past</b> appointment tabs with an adjustable clinic clock<br>
         ✓ <b>3D rotating logo watermark</b> behind every page (◈ button controls it)<br>
         ✓ 13 screens in total, all backed by real SQL queries.</p></div>
     </div>`;
};

PAGES.downloads = async () => {
  const files=[
    ['schema.sql','DDL — 10 tables, 13 FKs, 3 views, 3 triggers, 6 indexes','database/'],
    ['seed.sql','Sample data — 30 patients, 183 appointments, 155 bills','database/'],
    ['queries.sql','36 SQL queries with plain-English questions','database/'],
    ['hospital.db','The live SQLite database — open in DB Browser for SQLite','database/'],
    ['er_diagram.svg','Printable ER diagram','frontend/'],
    ['logo.svg','⭐ Custom City Care Hospital logo (vector, editable)','frontend/'],
    ['logo_full.svg','Full logo with wordmark — paste into your report / PPT','frontend/'],
    ['logo.png','⭐ Logo PNG (512 × 512) — also used by the 3D rotating watermark','submission/'],
    ['logo_full.png','Full logo as a PNG image for the report title page','submission/'],
    ['server.py','Backend source (Python REST API)',''],
    ['app.js','Frontend source (vanilla JS SPA)','frontend/'],
    ['styles.css','Frontend stylesheet','frontend/'],
    ['index.html','Frontend HTML shell','frontend/'],
    ['config.js','⭐ EASY EDIT — name, colours, your student details','frontend/'],
    ['CityCare_Project_Report.docx','Ready-to-edit Word project report (63 headings, 36 queries, screenshot placeholders)','submission/'],
    ['CityCare_Presentation.pptx','12-slide PowerPoint presentation','submission/'],
    ['er_diagram.png','ER diagram as a PNG image for the report','submission/'],
    ['HOW_TO_RUN.md','⭐ Step-by-step VS Code setup guide (read this first)',''],
    ['NEW_IN_THIS_VERSION.md','⭐ What the 7 new frontend features are and how they work',''],
    ['run_windows.bat','Double-click launcher for Windows',''],
    ['README.md','Setup, run instructions & project guide',''],
    ['SUBMISSION.md','What to give your teacher + viva script',''],
    ['Hospital_Project_Prompt_Pack.md','The AI prompts (reference material)',''],
  ];
  $('#view').innerHTML = head('Downloads & Submission','Everything you need to hand in — SQL scripts, database, source code and docs.')
   + `<div class="card">${files.map(([f,desc,dir])=>`<div class="dl-row">
        <div class="dl-ico">${f.endsWith('.sql')||f.endsWith('.db')?'DB':f.endsWith('.md')?'¶':'<>'}</div>
        <div><b>${esc(f)}</b><p>${esc(desc)}</p></div>
        <a class="btn sec sm" href="/download/${f}">↓ Download</a></div>`).join('')}</div>
     <div class="note mt"><b>If your teacher insists on MS Access:</b> keep this app as the software part, then import
     the tables into Access, recreate relationships in the Relationships window, save the 36 queries as named
     query objects, and add 3 Forms + 3 Reports. The Prompt Pack (§9) has the full SQLite → Access → MySQL
     syntax conversion table.</div>
     <div class="card card-pad mt"><h3 class="card-title">Submission checklist</h3>
       <p class="body-text">
       ☐ schema.sql + seed.sql + queries.sql &nbsp; ☐ hospital.db (or .accdb) &nbsp; ☐ er_diagram.svg<br>
       ☐ Screenshots of all 13 screens &nbsp; ☐ Screenshots of 36 query outputs &nbsp; ☐ Project report / practical file<br>
       ☐ PPT (10–12 slides) &nbsp; ☐ 5-minute demo rehearsed &nbsp; ☐ Backup on Drive + pen drive</p></div>`;
};

/* ============================== ROUTER ============================== */
const TITLES={dashboard:'Dashboard',patients:'Patients',doctors:'Doctors',appointments:'Appointments',
  rooms:'Beds / Rooms',book:'Book Appointment',billing:'Billing & Revenue',
  pharmacy:'Pharmacy',sql:'SQL Console & Query Bank',schema:'Schema & Data Dictionary',
  er:'ER Diagram',about:'Project Info',downloads:'Downloads'};

async function render(){
  let page=(location.hash.replace('#/','')||'dashboard').split('?')[0];
  /* The old standalone Date & Time page was removed — the live clock now
     lives permanently in the header, so send old bookmarks to Dashboard. */
  if(page==='datetime'){ location.hash='#/dashboard'; return; }
  const fn=PAGES[page]||PAGES.dashboard;
  if(PAGE_TIMER){ clearInterval(PAGE_TIMER); PAGE_TIMER=null; }
  $$('#nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
  $('#pageTitle').textContent=TITLES[page]||'Dashboard';
  $('#sidebar').classList.remove('open');
  $('#modal').hidden=true; $('#modal').innerHTML='';
  loading();
  try{ await fn(); }catch(e){ console.error(e); fail(e); }
  window.scrollTo({top:0,behavior:'auto'});
  tickClocks();
}
window.addEventListener('hashchange',render);

function exportCsv(t){ window.location.href='/api/export?table='+encodeURIComponent(t); }
window.exportCsv=exportCsv;

$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#helpBtn').addEventListener('click',()=>{
  $('#modal').hidden=false;
  $('#modal').innerHTML=`<div class="modal"><h3>City Care Hospital — project help</h3>
    <div class="mbody">
      <p><b>What this is:</b> a full-stack Hospital / Clinic Management System for a DBMS final project.
      The backend is Python (<code class="inline">http.server</code> + <code class="inline">sqlite3</code>),
      the frontend is a vanilla JavaScript SPA, and the database is a real SQLite file with 10 tables.</p>
      <p><b>The most important page</b> is <a href="#/sql">SQL Console</a> — it runs all 36 queries live.
      Use "Verify all 36" to prove they work. Every other screen has an expandable
      <b>"SQL behind this screen"</b> panel at the bottom.</p>
      <p><b>New in this version:</b> bigger text (A＋ button), dark mode (☾ button), a custom logo,
      <a href="#/rooms">Beds / Rooms</a> with current patients,
      a <b>live real-world date &amp; time clock in the top bar of every page</b>, and
      <a href="#/appointments">Upcoming / Ongoing</a> appointment tabs with an adjustable clinic clock.</p>
      <p><b>For the viva:</b> show the Dashboard → Appointments (Ongoing tab) → Beds / Rooms →
      SQL Console (run Q18, Q28) → Schema → ER Diagram → Downloads. Explain the two M:N
      junction tables. The full 1NF → BCNF normalisation write-up is in the Word report.</p>
      <p><b>Reset:</b> if you break something in the SQL Console, click "↻ Reset DB". It rebuilds
      hospital.db from schema.sql + seed.sql.</p>
      <p style="color:var(--soft);font-size:calc(11.5px * var(--tscale))">Run with <code class="inline">python3 server.py</code> — no internet, no API keys, no npm.</p>
    </div><div class="mfoot"><button class="btn" id="closeM">Got it</button></div></div>`;
  $('#closeM').addEventListener('click',()=>{$('#modal').hidden=true;$('#modal').innerHTML='';});
});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'){$('#modal').hidden=true;$('#modal').innerHTML='';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){
  $('#modal').hidden=true; $('#modal').innerHTML='';
  const t=$('#themeMenu'); if(t) t.hidden=true;
  const w=$('#wmMenu'); if(w) w.hidden=true;
}});

(async function init(){
  applyConfig();
  initAppearance();
  initWatermark();
  tickClocks();
  setInterval(tickClocks, 1000);          // one global live clock, updates whatever is on screen
  try{
    const m=await api('/api/meta');
    $('#dbInfo').textContent=`${m.tables} tables · ${m.queries} queries · ${(m.db_bytes/1024).toFixed(0)} KB`;
  }catch(e){ $('#dbInfo').textContent='backend offline'; }
  if(!location.hash) location.hash='#/dashboard';
  render();
})();

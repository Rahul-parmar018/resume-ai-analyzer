(() => {
console.log('[Finder] finder.js ready');
const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
const qs = (k) => new URLSearchParams(location.search).get(k);
const $ = (id) => document.getElementById(id);

// -------- Create handler (list page) --------
document.addEventListener('click', async (e)=>{
const btn = e.target.closest('#nrSave');
if (!btn) return;
e.preventDefault();
const alertEl = $('nrAlert'); if (alertEl) { alertEl.textContent=''; alertEl.classList.add('d-none'); }

const title = ($('nrTitle')?.value||'').trim();
let minExp = parseInt($('nrMinExp')?.value||'0',10); if (isNaN(minExp)||minExp<0) minExp = 0;
if (!title){ $('nrTitle')?.classList.add('is-invalid'); $('nrTitleErr')&&( $('nrTitleErr').style.display='block'); if(alertEl){alertEl.textContent='Please enter a title.'; alertEl.classList.remove('d-none');} return; }
$('nrTitle')?.classList.remove('is-invalid'); $('nrTitleErr')&&( $('nrTitleErr').style.display='none');

const must = (($('nrMust')?.value)||'').split(',').map(s=>s.trim()).filter(Boolean);
const nice = (($('nrNice')?.value)||'').split(',').map(s=>s.trim()).filter(Boolean);
const location = ($('nrLoc')?.value||'').trim();
const notesBase = ($('nrNotes')?.value||'').trim();

const adv = [];
const t = $('advType')?.value||'';
const smin = parseInt($('advSalaryMin')?.value||'',10);
const smax = parseInt($('advSalaryMax')?.value||'',10);
const pri  = $('advPriority')?.value||'';
const tags = $('advTags')?.value||'';
if (t) adv.push(`Type: ${t}`);
if (!isNaN(smin) || !isNaN(smax)) adv.push(`Salary: ${isNaN(smin)?'—':smin}–${isNaN(smax)?'—':smax} USD`);
if (pri) adv.push(`Priority: ${pri}`);
if (tags) adv.push(`Tags: ${tags}`);
const payload = {
  title, must_have: must, nice_to_have: nice, min_exp: minExp, location,
  notes: [notesBase, adv.length?`[Advanced] ${adv.join(' | ')}`:''].filter(Boolean).join('\n')
};
const sp = btn.querySelector('.spinner-border'); sp?.classList.remove('d-none'); btn.disabled = true;

try{
  const res = await fetch('/api/requisitions/', {
    method:'POST',
    headers:{ 'X-CSRFToken': getCsrf(), 'Content-Type':'application/json', 'Accept':'application/json' },
    credentials:'same-origin',
    body: JSON.stringify(payload)
  });
  const ct = res.headers.get('content-type')||''; const txt = await res.text();
  if (!res.ok){ if(alertEl){alertEl.textContent = txt||`Create failed (${res.status})`; alertEl.classList.remove('d-none');} throw new Error(txt||`Create failed (${res.status})`); }
  const data = ct.includes('application/json') ? JSON.parse(txt) : null;
  const id = data?.id; if (!id){ if(alertEl){alertEl.textContent='Create succeeded but no id returned'; alertEl.classList.remove('d-none');} throw new Error('No id returned'); }
  location.href = `/finder/${id}/?viz=1`;
}catch(err){
  console.error('[Create] error', err);
}finally{
  sp?.classList.add('d-none'); btn.disabled = false;
}
});

// -------- Detail page & charts --------
const reqIdMatch = location.pathname.match(/\/finder\/(\d+)\//);
const reqId = reqIdMatch ? reqIdMatch[1] : null;

// Global chart registry so we can destroy/update cleanly
const CHARTS = (window.FINDER_CHARTS ||= {});

// Helpers
function toNums(arr){ return (arr||[]).map(x => typeof x === 'string' ? parseFloat(x) : (x||0)); }
function okay(v){ return Number.isFinite(v) ? v : 0; }

function makeOrReplaceChart(canvasId, config){
const el = $(canvasId);
if (!el) return;
// Destroy if exists
if (CHARTS[canvasId]) {
try { CHARTS[canvasId].destroy(); } catch(e){}
}
CHARTS[canvasId] = new Chart(el, config);
}

async function loadMetrics(){
const card = $('vizCard');
if (!reqId || !card) return;

// Unhide KPI/Charts FIRST so canvases have size
const kpiRow = $('kpiRow');
const vizRow = $('vizRow');
if (kpiRow) kpiRow.hidden = false;
if (vizRow) vizRow.hidden = false;

// Fetch
const res = await fetch(`/api/requisitions/${reqId}/metrics/`);
if (!res.ok) { console.warn('[Viz] metrics failed', res.status); return; }
const m = await res.json();

// KPIs text
if ($('kpiTotal')) $('kpiTotal').textContent = okay(m?.kpi?.total);
if ($('kpiShortlisted')) $('kpiShortlisted').textContent = okay(m?.kpi?.shortlisted);
if ($('kpiAvg')) $('kpiAvg').textContent = `${okay(m?.kpi?.avg_match)}%`;
if ($('kpiP90')) $('kpiP90').textContent = `${okay(m?.kpi?.p90)}%`;

// Give the layout 1 frame; then render charts (prevents zero-size canvas)
requestAnimationFrame(() => {
  // Histogram
  const bins = toNums(m?.histogram?.bins);
  const labels = m?.histogram?.labels || [];
  makeOrReplaceChart('chartHist', {
    type: 'bar',
    data: { labels, datasets: [{ data: bins, label:'Count', backgroundColor:'rgba(124,58,237,.7)', borderColor:'rgba(124,58,237,.95)', borderWidth:1 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins:{ legend:{display:false}, tooltip:{mode:'index'} },
      scales:{ x:{ grid:{color:'rgba(255,255,255,.06)'}}, y:{ beginAtZero:true, grid:{color:'rgba(255,255,255,.06)'} } }
    }
  });

  // Coverage (stacked horizontal)
  const cov = Array.isArray(m?.coverage) ? m.coverage : [];
  const covLabels = cov.map(x => x.key || '');
  const covPresent = toNums(cov.map(x => x.present));
  const covMissing = toNums(cov.map(x => x.missing));
  makeOrReplaceChart('chartCoverage', {
    type:'bar',
    data:{
      labels: covLabels,
      datasets:[
        { label:'Present', data: covPresent, backgroundColor:'rgba(34,197,94,.75)', borderWidth:0 },
        { label:'Missing', data: covMissing, backgroundColor:'rgba(239,68,68,.65)', borderWidth:0 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins:{ tooltip:{mode:'index'} },
      scales:{ x:{ stacked:true, beginAtZero:true, grid:{color:'rgba(255,255,255,.06)'} }, y:{ stacked:true, grid:{color:'rgba(255,255,255,.06)'} } }
    }
  });

  // Missing rank
  const miss = Array.isArray(m?.missing_rank) ? m.missing_rank : [];
  const missLabels = miss.map(x => x.key || '');
  const missVals = toNums(miss.map(x => x.count));
  makeOrReplaceChart('chartMissing', {
    type:'bar',
    data:{ labels: missLabels, datasets:[{ data: missVals, backgroundColor:'rgba(245,158,11,.75)', borderWidth:0 }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{ x:{ grid:{color:'rgba(255,255,255,.06)'}}, y:{ beginAtZero:true, grid:{color:'rgba(255,255,255,.06)'} } }
    }
  });

  // Scatter: Exp vs Match (bubble size ~ ATS, color by status)
  const points = Array.isArray(m?.scatter) ? m.scatter : [];
  const statusColor = (s) => s==='shortlisted' ? '#22c55e' : s==='rejected' ? '#ef4444' : s==='hired' ? '#3b82f6' : '#9ca3af';
  const bubbles = points.map(p => ({ x: okay(p.x), y: okay(p.y), r: Math.max(4, okay(p.r)), status: p.status || 'new' }));
  makeOrReplaceChart('chartScatter', {
    type:'bubble',
    data:{ datasets:[{ data: bubbles, backgroundColor: bubbles.map(b => statusColor(b.status)), borderWidth:0 }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{ label:(c)=>`Years: ${c.raw.x}, Match: ${c.raw.y}%` }}},
      scales:{ x:{ title:{display:true, text:'Years'}, grid:{color:'rgba(255,255,255,.06)'} },
              y:{ title:{display:true, text:'Match %'}, min:0, max:100, grid:{color:'rgba(255,255,255,.06)'} } }
    }
  });

  // Threshold slider removed

  // Mark loaded
  card.dataset.loaded = '1';
});
}

if (reqId && (qs('viz') === '1' || $('vizCard')?.dataset.auto === '1')){
document.addEventListener('DOMContentLoaded', loadMetrics);
}

// Threshold slider removed

// -------- Table row rendering hooks --------
// Score badges are now rendered inline, no Chart.js needed

// Replace Copy summary with Add note
window.bindAddNote = function(tbody){
tbody.querySelectorAll('.act-note').forEach(b=>{
b.addEventListener('click', async ()=>{
const id = b.dataset.id;
const note = prompt('Add/Update note:');
if (note == null) return;
await fetch(`/api/candidates/${id}/`, { method:'PATCH', headers:{'X-CSRFToken': getCsrf()}, body: JSON.stringify({ notes: note }) });
alert('Note saved');
});
});
};

// Compare radar
window.loadCompareRadar = async function(reqId, ids){
const res = await fetch(`/api/requisitions/${reqId}/compare/?ids=${ids.join(',')}`);
const data = await res.json();
const body = document.getElementById('compareBody');
body.innerHTML = '';
const wrap = document.createElement('div'); wrap.className='col-12';
wrap.innerHTML = `<div class="card card-glass p-2"><canvas id="radarCompare" height="180"></canvas></div>`;
body.appendChild(wrap);
const labels = ['ATS','Match','Skills','Read','Struct'];
const colors = ['#22c55e','#3b82f6','#f59e0b'];
const ds = (data.items||[]).slice(0,3).map((it, idx)=>({
label: it.name || `C${idx+1}`,
data: [it.ats||0, it.match_score||0, it.skills||0, it.read||0, it.struct||0],
borderColor: colors[idx%colors.length],
backgroundColor: colors[idx%colors.length]+'40',
fill: true, tension:.2
}));
new Chart(document.getElementById('radarCompare'), {
type:'radar',
data:{ labels, datasets: ds },
options:{ plugins:{ legend:{ position:'bottom'}}, scales:{ r:{ min:0, max:100, grid:{color:'rgba(255,255,255,.1)'}, angleLines:{color:'rgba(255,255,255,.1)'}}}}
});
};

// -------- Detail page logic (existing functionality) --------
if (!reqId) return;

// Chart variables and functions
let charts = {};
const vizBtn = document.getElementById('vizLoadBtn');
const vizCard = document.getElementById('vizCard');
const kpiRow = document.getElementById('kpiRow');
const vizRow = document.getElementById('vizRow');
// thresholdInput removed

// initRowGauges function removed - using inline score badges instead

// Expose for reuse after Analyze / Re-score / Restart
window.loadMetrics = loadMetrics;

// ---------------- Table: load & render ----------------
async function loadTable(page=1){
const tbody = $('resultsBody');
const pagerInfo = $('pagerInfo');
const pagerBtns = $('pagerBtns');
const minMatchEl = document.getElementById('fMinMatch');
const statusEl = document.getElementById('fStatus');

if (!reqId || !tbody) return;

// Build params (never send empty min_match)
const params = new URLSearchParams();
if (minMatchEl && String(minMatchEl.value).trim() !== '') params.set('min_match', minMatchEl.value.trim());
if (statusEl && statusEl.value && statusEl.value.toLowerCase() !== 'all') params.set('status', statusEl.value);
params.set('page', page);

// Fetch
let data = { results:[], page:1, pages:1, count:0 };
try{
  const res = await fetch(`/api/requisitions/${reqId}/candidates/?` + params.toString());
  const ct = res.headers.get('content-type')||'';
  const txt = await res.text();
  if (!res.ok) throw new Error(txt || `List failed (${res.status})`);
  data = ct.includes('application/json') ? JSON.parse(txt) : data;
}catch(e){
  console.error('[Candidates] error:', e);
}

// Render rows
tbody.innerHTML = '';
const rows = Array.isArray(data.results) ? data.results : [];
// Store globally for insights modal
window.lastCandidates = rows;
if (!rows.length){
  tbody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="empty-card">
          <div class="empty-title">No results</div>
          <div class="empty-sub">Upload resumes above and click Analyze, or adjust filters.</div>
        </div>
      </td>
    </tr>`;
} else {
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="rowCheck" data-id="${r.id}"></td>
      <td>
        <div class="fw-bold text-white">${r.name||'-'}</div>
        <div class="text-muted small">${r.file_name||''}</div>
      </td>
      <td>
        <div class="small"><i class="bi bi-envelope me-1"></i>${r.email||'-'}</div>
        <div class="small"><i class="bi bi-telephone me-1"></i>${r.phone||'-'}</div>
        <div class="small"><i class="bi bi-linkedin me-1"></i>${r.linkedin?`<a href="${r.linkedin}" target="_blank">LinkedIn</a>`:'-'}</div>
      </td>
      <td>${r.years_experience||0}</td>
      <td>${r.location||'-'}</td>
      <td>
        <span class="score-badge ${r.match_score >= 80 ? 'high' : r.match_score >= 60 ? 'mid' : 'low'}">
          ${r.match_score ?? 0}%
        </span>
      </td>
      <td><span class="badge-total">${r.total_score||0}</span></td>
      <td>
        <span class="badge ${r.status === 'hired' ? 'bg-success' : r.status === 'rejected' ? 'bg-danger' : r.status === 'shortlisted' ? 'bg-info' : 'bg-secondary'}">
          ${r.status === 'hired' ? 'Hired' : r.status === 'rejected' ? 'Not selected' : r.status === 'shortlisted' ? 'Shortlisted' : 'New'}
        </span>
      </td>
      <td>
        <div class="d-flex flex-wrap gap-1">
          <button class="btn btn-sm btn-outline-secondary act-preview" data-url="${r.file_url||''}"><i class="bi bi-file-earmark-pdf"></i> View</button>
          <button class="btn btn-sm btn-outline-secondary act-insights" data-id="${r.id}"><i class="bi bi-lightbulb"></i> Insights</button>
          <button class="btn btn-sm btn-outline-secondary act-note" data-id="${r.id}"><i class="bi bi-journal-text"></i> Add note</button>
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">Status</button>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item act-status" data-id="${r.id}" data-st="shortlisted">Shortlisted</a></li>
              <li><a class="dropdown-item act-status" data-id="${r.id}" data-st="hired">Hired</a></li>
              <li><a class="dropdown-item act-status" data-id="${r.id}" data-st="rejected">Not selected</a></li>
            </ul>
          </div>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Pager
if (pagerInfo) pagerInfo.textContent = `Page ${data.page||1} of ${data.pages||1} (${data.count||0} total)`;
if (pagerBtns){
  pagerBtns.innerHTML = '';
  const pages = Number(data.pages||1);
  const cur = Number(data.page||1);
  for (let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.className = 'btn btn-sm ' + (i===cur ? 'btn-brand' : 'btn-outline-light');
    b.textContent = i;
    b.addEventListener('click', ()=> loadTable(i));
    pagerBtns.appendChild(b);
  }
}

// Bind actions
// Preview
tbody.querySelectorAll('.act-preview').forEach(b=>{
  b.addEventListener('click', ()=>{
    const url = b.dataset.url;
    if (!url) return alert('File not available.');
    document.getElementById('previewObj')?.setAttribute('data', url);
    document.getElementById('previewDownload')?.setAttribute('href', url);
    new bootstrap.Modal(document.getElementById('previewModal')).show();
  });
});
// Insights and Add note handlers are now global event listeners below
// Status
tbody.querySelectorAll('.act-status').forEach(a=>{
  a.addEventListener('click', async ()=>{
    const id = +a.dataset.id; const st = a.dataset.st;
    await fetch(`/api/candidates/${id}/`, { method:'PATCH', headers:{ 'X-CSRFToken': getCsrf(), 'Content-Type':'application/json' }, body: JSON.stringify({ status: st }) });
    loadTable(1);
  });
});

// Compare checkbox badge update
const compareBtn = $('compareBtn');
const checkAll = $('checkAll');
function updateCompare(){
  const ids = Array.from(document.querySelectorAll('#resultsBody .rowCheck:checked')).map(c=> +c.dataset.id);
  if (compareBtn){
    compareBtn.disabled = ids.length < 2;
    compareBtn.textContent = `Compare (${ids.length})`;
    compareBtn.dataset.ids = ids.join(',');
  }
}
checkAll?.addEventListener('change', ()=>{
  document.querySelectorAll('#resultsBody .rowCheck').forEach(c=> c.checked = checkAll.checked);
  updateCompare();
});
document.querySelectorAll('#resultsBody .rowCheck').forEach(c=> c.addEventListener('change', updateCompare));
updateCompare();

// Score badges are now rendered inline, no Chart.js needed
}

// Expose for others
window.loadTable = loadTable;

// Filters Apply button (if present)
document.addEventListener('click', (ev)=>{
if (ev.target.closest('#applyFilters')){ ev.preventDefault(); loadTable(1); }
});

// Compare modal: radar/dumbbell + candidate cards
document.addEventListener('click', async (ev)=>{
const btn = ev.target.closest('#compareBtn');
if (!btn) return;
ev.preventDefault();
const reqId = (location.pathname.match(/\/finder\/(\d+)\//)||[])[1] || (window.FINDER_REQ_ID || null);
const ids = (btn.dataset.ids||'').split(',').filter(Boolean).map(x=>+x);
if (ids.length < 2) return;
const res = await fetch(`/api/requisitions/${reqId}/compare/?ids=${ids.join(',')}`);
const data = await res.json();

// Radar
const ctxR = document.getElementById('cmpRadar');
if (window.cmpRadar) try{ window.cmpRadar.destroy(); }catch(e){}
const labs = ['ATS','Match','Skills','Read','Struct'];
const colors = ['#22c55e','#3b82f6','#f59e0b'];
const sets = (data.items||[]).slice(0,3).map((it,i)=>({
  label: it.name || `C${i+1}`,
  data: [it.ats||0, it.match_score||0, it.skills||0, it.read||0, it.struct||0],
  borderColor: colors[i%colors.length],
  backgroundColor: colors[i%colors.length]+'40',
  fill:true, tension:.2
}));
window.cmpRadar = new Chart(ctxR, {
  type:'radar', data:{ labels: labs, datasets: sets },
  options:{ 
    responsive: true, 
    maintainAspectRatio: false,
    plugins:{legend:{position:'bottom'}}, 
    scales:{ r:{min:0,max:100, grid:{color:'rgba(255,255,255,.1)'}, angleLines:{color:'rgba(255,255,255,.1)'}}}
  }
});

// Dumbbell (match vs ATS)
const ctxD = document.getElementById('cmpDumbbell');
if (window.cmpDumbbell) try{ window.cmpDumbbell.destroy(); }catch(e){}
const names = (data.items||[]).map(it => it.name || `C${it.id}`);
const matchVals = (data.items||[]).map(it => it.match_score||0);
const atsVals = (data.items||[]).map(it => it.ats||0);
window.cmpDumbbell = new Chart(ctxD, {
  type:'bar',
  data:{
    labels:names,
    datasets:[
      { label:'Match %', data: matchVals, backgroundColor:'rgba(34,197,94,.7)' },
      { label:'ATS', data: atsVals, backgroundColor:'rgba(59,130,246,.7)' }
    ]
  },
  options:{
    responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}},
    scales:{ x:{ grid:{color:'rgba(255,255,255,.06)'}}, y:{ min:0, max:100, grid:{color:'rgba(255,255,255,.06)'}}}
  }
});

// Candidate cards
const cards = document.getElementById('cmpCards');
cards.innerHTML = '';
(data.items||[]).forEach(it=>{
  const mustMissing = (it.missing||'').split(';').filter(Boolean);
  const present = (it.present||'').split(';').filter(Boolean);
  const status = (it.status||'new').toLowerCase();
  cards.innerHTML += `
    <div class="cmp-cand-card">
      <div class="cmp-status ${status}">${status.charAt(0).toUpperCase()+status.slice(1)}</div>
      <div class="fw-bold mb-1">${it.name||'-'}</div>
      <div class="cmp-label mb-1">Match: <span class="score-badge">${it.match_score||0}%</span> &nbsp; ATS: <span class="score-badge">${it.ats||0}</span></div>
      <div class="cmp-label mb-1">Years: ${it.years_experience||0}</div>
      <div class="cmp-label mb-1">Present: <span class="cmp-present">${present.join(', ')||'-'}</span></div>
      <div class="cmp-label mb-1">Missing: <span class="cmp-missing">${mustMissing.join(', ')||'-'}</span></div>
      <div class="cmp-summary mb-1">${it.summary||''}</div>
      ${it.notes ? `<div class="cmp-notes mb-1">Note: ${it.notes}</div>` : ''}
      ${mustMissing.length ? `<div class="cmp-must-missing">Missing must-haves!</div>` : ''}
    </div>
  `;
});

new bootstrap.Modal(document.getElementById('compareModal')).show();
});

// Load initial table
if (reqId) loadTable(1);

// Ensure modal close buttons work properly
function initModalCloseHandlers() {
  // Handle all modal close buttons
  document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const modal = this.closest('.modal');
      if (modal) {
        // Try Bootstrap modal instance first
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        }
        
        // Fallback: hide modal manually
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Remove backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalCloseHandlers);
} else {
  initModalCloseHandlers();
}

// Additional explicit close handlers for each modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        new bootstrap.Modal(modal).hide();
      }
    } else {
      // Fallback
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }
}

// Add explicit close handlers
document.addEventListener('click', function(e) {
  // Close button clicks
  if (e.target.matches('.btn-close') || e.target.closest('.btn-close')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      closeModal(modal.id);
    }
  }
  
  // Cancel button clicks
  if (e.target.matches('[data-bs-dismiss="modal"]') && e.target.textContent.trim() === 'Cancel') {
    const modal = e.target.closest('.modal');
    if (modal) {
      closeModal(modal.id);
    }
  }
});

// Global modal event listeners
// Insights modal
document.addEventListener('click', async (ev)=>{
const btn = ev.target.closest('.act-insights');
if (!btn) return;
ev.preventDefault();
const id = +btn.dataset.id;
// Fetch candidate details (or use from loaded rows if available)
let row = null;
if (window.lastCandidates && Array.isArray(window.lastCandidates))
row = window.lastCandidates.find(x=>x.id===id);
if (!row) {
const res = await fetch(`/api/candidates/${id}/`);
row = await res.json();
}
// Build insights HTML
const html = `
<div class="mb-2"><span class="fw-bold text-white">Name:</span> ${row.name||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Email:</span> ${row.email||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Phone:</span> ${row.phone||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">LinkedIn:</span> ${row.linkedin?`<a href="${row.linkedin}" target="_blank">${row.linkedin}</a>`:'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Years exp:</span> ${row.years_experience||0}</div>
<div class="mb-2"><span class="fw-bold text-white">Location:</span> ${row.location||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Summary:</span><br><pre class="small text-muted" style="white-space:pre-wrap;">${row.summary||'-'}</pre></div>
<div class="mb-2"><span class="fw-bold text-white">Present keywords:</span> ${(row.present||'').split(';').filter(Boolean).join(', ')||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Missing keywords:</span> ${(row.missing||'').split(';').filter(Boolean).join(', ')||'-'}</div>
<div class="mb-2"><span class="fw-bold text-white">Subscores:</span>
<ul class="mb-0">
<li>Match: <span class="score-badge">${row.match_score||0}%</span></li>
<li>ATS: <span class="score-badge">${row.ats_score||0}</span></li>
<li>Skills: <span class="score-badge">${row.skills_score||0}</span></li>
<li>Readability: <span class="score-badge">${row.readability_score||0}</span></li>
<li>Structure: <span class="score-badge">${row.structure_score||0}</span></li>
</ul>
</div>
<div class="mb-2"><span class="fw-bold text-white">Notes:</span><br><pre class="small text-muted" style="white-space:pre-wrap;">${row.notes||'-'}</pre></div>
`;
document.getElementById('insightsBody').innerHTML = html;
new bootstrap.Modal(document.getElementById('insightsModal')).show();
});

// Add note modal
let currentNoteId = null;
document.addEventListener('click', (ev)=>{
const btn = ev.target.closest('.act-note');
if (!btn) return;
ev.preventDefault();
currentNoteId = +btn.dataset.id;
document.getElementById('noteInput').value = '';
new bootstrap.Modal(document.getElementById('noteModal')).show();
});
document.getElementById('noteSave')?.addEventListener('click', async ()=>{
if (!currentNoteId) return;
const saveBtn = document.getElementById('noteSave');
const originalText = saveBtn.textContent;
const note = document.getElementById('noteInput').value;

// Show loading state
saveBtn.textContent = 'Saving...';
saveBtn.disabled = true;

try {
  await fetch(`/api/candidates/${currentNoteId}/`, {
    method:'PATCH',
    headers:{ 'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '', 'Content-Type':'application/json' },
    body: JSON.stringify({ notes: note })
  });
  
  // Close modal and refresh table
  new bootstrap.Modal(document.getElementById('noteModal')).hide();
  if (typeof loadTable === 'function') loadTable(1);
  
} catch (error) {
  console.error('Error saving note:', error);
  // Show error state briefly
  saveBtn.textContent = 'Error - Try Again';
  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }, 2000);
  return;
}

// Reset button state
saveBtn.textContent = originalText;
saveBtn.disabled = false;
});

// -------- Analyze handler (detail page) --------
(() => {
const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
const $ = (id) => document.getElementById(id);

function getReqId(){
// safest order
if (window.FINDER_REQ_ID) return String(window.FINDER_REQ_ID);
const card = $('analyzeCard');
if (card?.dataset?.req) return card.dataset.req;
const m = location.pathname.match(/\/finder\/(\d+)\//);
return m ? m[1] : null;
}

async function analyzeResumes(){
const reqId = getReqId();
const btn = $('analyzeBtn');
const input = $('filesInput');
const alertBox = $('upAlert');

const showErr = (msg) => { if(alertBox){ alertBox.textContent = msg || 'Analyze failed'; alertBox.classList.remove('d-none'); } };
const clearErr = () => { if(alertBox){ alertBox.textContent = ''; alertBox.classList.add('d-none'); } };

clearErr();

if (!reqId){ showErr('Missing requisition id'); return; }
if (!input || !input.files || !input.files.length){
  showErr('Choose at least one PDF or DOCX.'); return;
}

// Build FormData (do NOT set Content-Type manually)
const fd = new FormData();
Array.from(input.files).forEach(f => fd.append('files', f, f.name));

// UI loading
const sp = btn?.querySelector('.spinner-border'); sp?.classList.remove('d-none');
if (btn) btn.disabled = true;

try{
  const res = await fetch(`/api/requisitions/${reqId}/upload/`, {
    method: 'POST',
    headers: { 'X-CSRFToken': getCsrf(), 'Accept':'application/json' },
    credentials: 'same-origin',
    body: fd
  });
  const ct = res.headers.get('content-type') || '';
  const body = await res.text();
  if (!res.ok){
    showErr(body || `Analyze failed (${res.status})`);
    throw new Error(body || `Analyze failed (${res.status})`);
  }
  let data = {};
  try { if (ct.includes('application/json')) data = JSON.parse(body); } catch(e){}
  const created = (data.created||[]).filter(x=>!x.dup).length;
  const dups = (data.created||[]).filter(x=>x.dup).length;
  if (!created && !dups){
    showErr('No resumes processed. Check file type or try again.');
  } else if (dups && !created){
    showErr(`${dups} duplicate file(s) skipped.`);
  }

  // Clear input
  if (input) input.value = '';

  // Refresh table + charts if functions exist
  if (typeof loadTable === 'function') await loadTable(1);
  if (typeof loadMetrics === 'function') await loadMetrics();

}catch(err){
  console.error('[Analyze] error', err);
}finally{
  sp?.classList.add('d-none');
  if (btn) btn.disabled = false;
}
}

// Delegated binding so it always fires
document.addEventListener('click', (ev)=>{
const b = ev.target.closest('#analyzeBtn');
if (b){ ev.preventDefault(); analyzeResumes(); }
});
})();

// -------- Re-score handler (detail page) --------
(() => {
const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
const $ = (id) => document.getElementById(id);

// Detect requisition id
const reqIdMatch = location.pathname.match(/\/finder\/(\d+)\//);
const reqId = reqIdMatch ? reqIdMatch[1] : null;

async function handleRescore(){
const btn = $('rescoreBtn');
const alertBox = $('resAlert');
if (!reqId || !btn) return;
const show = (m)=>{ if(alertBox){ alertBox.textContent=m; alertBox.classList.remove('d-none'); } };
const clear=()=>{ if(alertBox){ alertBox.textContent=''; alertBox.classList.add('d-none'); } };

clear();
const original = btn.textContent;
btn.disabled = true; btn.textContent = 'Re-scoring…';

try{
  const res = await fetch(`/api/requisitions/${reqId}/rescore/`, {
    method:'POST',
    headers:{ 'X-CSRFToken': getCsrf(), 'Accept':'application/json' },
    credentials:'same-origin'
  });
  const ct = res.headers.get('content-type')||'';
  const txt = await res.text();
  if (!res.ok){ show(txt || `Re-score failed (${res.status})`); throw new Error(txt||`Re-score failed (${res.status})`); }
  const data = ct.includes('application/json') ? JSON.parse(txt) : {};
  show(`Re-score complete — updated: ${data.updated||0}, shortlisted: ${data.shortlisted||0}, new: ${data.new||0}`);
  // Refresh table + charts
  if (typeof loadTable === 'function') await loadTable(1);
  if (typeof loadMetrics === 'function') await loadMetrics();
}catch(e){
  console.error('[Re-score] error', e);
}finally{
  btn.disabled = false; btn.textContent = original;
}
}

// Delegated binding
document.addEventListener('click', (ev)=>{
if (ev.target.closest('#rescoreBtn')){
ev.preventDefault(); handleRescore();
}
});
})();

// -------- Restart handler (detail page) --------
(() => {
const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
const $ = (id) => document.getElementById(id);
const reqId = (location.pathname.match(/\/finder\/(\d+)\//)||[])[1] || (window.FINDER_REQ_ID || null);

function showMsg(msg){
const el = $('resAlert'); if (!el) return;
el.textContent = msg || '';
el.classList.toggle('d-none', !msg);
}

function openRestartModal(){
const modalEl = $('restartModal'); if (!modalEl) return;
(bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).show();
}

async function doRestart(){
if (!reqId) return;
const btn = $('restartConfirm');
const sp = btn?.querySelector('.spinner-border');
sp?.classList.remove('d-none'); btn.disabled = true;

try{
  const res = await fetch(`/api/requisitions/${reqId}/reset/`, {
    method:'POST',
    headers:{ 'X-CSRFToken': getCsrf(), 'Content-Type':'application/json', 'Accept':'application/json' },
    credentials:'same-origin',
    body: JSON.stringify({ delete_files: true })   // always delete files
  });
  const ct = res.headers.get('content-type')||''; const txt = await res.text();
  if (!res.ok){ showMsg(txt || `Restart failed (${res.status})`); throw new Error(txt||`Restart failed (${res.status})`); }
  const data = ct.includes('application/json') ? JSON.parse(txt) : {};
  showMsg(`Restart complete — removed ${data.deleted||0} candidates and ${data.files_deleted||0} file(s).`);

  // Close modal
  const modalEl = $('restartModal');
  if (typeof bootstrap !== 'undefined' && modalEl){
    (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();
  }

  // Fresh UI — reset table and visualizations
  // 1) Table
  if (typeof loadTable === 'function') await loadTable(1);
  // 2) Visualize — force reload by clearing vizCard loaded flag
  const vizCard = $('vizCard');
  if (vizCard){ vizCard.dataset.loaded = ''; }
  if (typeof loadMetrics === 'function') await loadMetrics();

  // 3) Optional: clear filters and scroll to Analyze
  const minMatch = document.getElementById('fMinMatch'); if (minMatch) minMatch.value = '';
  const statusSel = document.getElementById('fStatus'); if (statusSel) statusSel.value = '';
  const analyzeCard = document.getElementById('analyzeCard'); analyzeCard?.scrollIntoView({ behavior:'smooth', block:'start' });

}catch(e){
  console.error('[Restart] error', e);
}finally{
  sp?.classList.add('d-none'); btn.disabled = false;
}
}

// Bind buttons (delegated)
document.addEventListener('click', (ev)=>{
if (ev.target.closest('#restartBtn')){ ev.preventDefault(); openRestartModal(); }
if (ev.target.closest('#restartConfirm')){ ev.preventDefault(); doRestart(); }
});
})();

})();
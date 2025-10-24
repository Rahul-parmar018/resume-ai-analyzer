(() => {
// Log so we know this file loaded
console.log('[Finder] finder_create.js loaded');

const API_URL = '/api/requisitions/'; // must match Django URL exactly
const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
const $ = (id) => document.getElementById(id);

function showAlert(msg){
const box = $('nrAlert');
if (!box) return;
box.textContent = msg || 'An error occurred';
box.classList.remove('d-none');
}
function clearAlert(){
const box = $('nrAlert');
if (!box) return;
box.textContent = '';
box.classList.add('d-none');
}

async function createRequisition(){
const btn = $('nrSave');
if (!btn) return;
clearAlert();

// Read and validate fields
const title = ($('nrTitle')?.value || '').trim();
let minExp = parseInt($('nrMinExp')?.value || '0', 10);
if (isNaN(minExp) || minExp < 0) minExp = 0;

if (!title){
  $('nrTitle')?.classList.add('is-invalid');
  const err = $('nrTitleErr'); if (err) err.style.display='block';
  showAlert('Please enter a title.');
  return;
} else {
  $('nrTitle')?.classList.remove('is-invalid');
  const err = $('nrTitleErr'); if (err) err.style.display='none';
}

const must = (($('nrMust')?.value)||'').split(',').map(s=>s.trim()).filter(Boolean);
const nice = (($('nrNice')?.value)||'').split(',').map(s=>s.trim()).filter(Boolean);
const location = ($('nrLoc')?.value||'').trim();
const notesBase = ($('nrNotes')?.value||'').trim();

// Advanced (just append to notes; no DB change needed)
const adv = [];
const t = $('advType')?.value || '';
const smin = parseInt($('advSalaryMin')?.value || '', 10);
const smax = parseInt($('advSalaryMax')?.value || '', 10);
const pri  = $('advPriority')?.value || '';
const tags = $('advTags')?.value || '';
if (t) adv.push(`Type: ${t}`);
if (!isNaN(smin) || !isNaN(smax)) adv.push(`Salary: ${isNaN(smin)?'—':smin}–${isNaN(smax)?'—':smax} USD`);
if (pri) adv.push(`Priority: ${pri}`);
if (tags) adv.push(`Tags: ${tags}`);

const payload = {
  title,
  must_have: must,
  nice_to_have: nice,
  min_exp: minExp,
  location,
  notes: [notesBase, adv.length?`[Advanced] ${adv.join(' | ')}`:''].filter(Boolean).join('\n')
};

// UI loading
const sp = btn.querySelector('.spinner-border');
sp?.classList.remove('d-none');
btn.disabled = true;

try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json', 'Accept':'application/json' },
    credentials: 'same-origin',    // send cookie
    body: JSON.stringify(payload)
  });

  const ct = res.headers.get('content-type') || '';
  const txt = await res.text();
  console.log('[Create] status', res.status, 'body', txt);

  if (!res.ok){
    showAlert(txt || `Create failed (${res.status})`);
    throw new Error(txt || `Create failed (${res.status})`);
  }

  let data = null;
  try { if (ct.includes('application/json')) data = JSON.parse(txt); } catch (e) {}
  if (!data?.id){
    // If server redirects instead of JSON: follow it
    if (res.redirected && res.url) { window.location.assign(res.url); return; }
    showAlert('Create succeeded but no id returned');
    throw new Error('No id returned');
  }

  // Redirect to detail + auto visualize
  window.location.assign(`/finder/${data.id}/?viz=1`);
} catch (e){
  console.error('[Create] error', e);
} finally {
  sp?.classList.add('d-none');
  btn.disabled = false;
}
}

// GUARANTEED binding: event delegation on the document
document.addEventListener('click', (ev) => {
const btn = ev.target.closest('#nrSave');
if (btn) { ev.preventDefault(); createRequisition(); }
});

console.log('[Finder] create handler bound');
})();

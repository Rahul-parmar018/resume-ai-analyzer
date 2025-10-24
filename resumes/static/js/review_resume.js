document.addEventListener('DOMContentLoaded', function() {
  console.log('Review resume script loaded');
  const $ = id => document.getElementById(id);
  const form = $('reviewForm');
  const file = $('reviewFile');
  const btn = $('reviewBtn');
  const spinner = $('reviewSpinner');
  const alertBox = $('reviewAlert');
  const result = $('reviewResult');
  const checklist = $('reviewChecklist');
  const readability = $('reviewReadability');
  const readMeterBar = $('readMeterBar');
  const readMeterLabel = $('readMeterLabel');
  const sections = $('reviewSections');
  const fixFirst = $('reviewFixFirst');
  const summary = $('reviewSummary');
  const healthEmoji = $('reviewHealthEmoji');
  const healthLabel = $('reviewHealthLabel');
  const nextSteps = $('reviewNextSteps');
  const mistakeCards = document.getElementById('mistakeCards');
  const improveBtn = document.getElementById('improveResumeBtn');

  function showAlert(msg){
    alertBox.textContent = msg;
    alertBox.classList.remove('d-none');
  }
  function clearAlert(){
    alertBox.textContent = '';
    alertBox.classList.add('d-none');
  }

  // Confetti
  function confettiBurst() {
    if (!window.confetti) return;
    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.2 },
      colors: ['#22c55e','#7c3aed','#fbbf24','#3b82f6']
    });
  }

  // Flip card logic
  function bindFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.onclick = () => card.classList.toggle('flipped');
    });
    document.querySelectorAll('.ai-fix-btn').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const card = btn.closest('.flip-card');
        if (card) card.classList.add('flipped');
      };
    });
  }

  // Animate in cards
  function animateCards() {
    const els = document.querySelectorAll('.sa');
    if (els.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
      }, { threshold: .14 });
      els.forEach(el => io.observe(el));
    }
  }


  if (form) {
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      clearAlert();
      result.classList.add('d-none');
      if (!file.files.length) return showAlert('Please select a PDF or DOCX.');
      btn.disabled = true; spinner.classList.remove('d-none');
      try{
        const fd = new FormData();
        fd.append('resume', file.files[0]);
        const res = await fetch('/api/review-resume/', { method:'POST', body: fd });
        const ct = res.headers.get('content-type')||'';
        const txt = await res.text();
        if (!res.ok) return showAlert(txt || `Review failed (${res.status})`);
        const data = ct.includes('application/json') ? JSON.parse(txt) : {};

        // AI summary
        healthEmoji.textContent = data.health_emoji || '';
        healthLabel.textContent = data.health_label || '';
        // Convert markdown formatting to HTML for better display
        const summaryText = data.summary || '';
        summary.innerHTML = summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        // Health progress bar
        const healthBar = document.getElementById('healthBar');
        if (healthBar) {
          let pct = (data.health_level||1) * 33;
          healthBar.style.width = pct + '%';
          healthBar.className = 'progress-bar bg-success';
        }
        if (data.confetti) confettiBurst();


        // Health checklist
        checklist.innerHTML = (data.checklist||[]).map(x=>{
          if (x.includes('⚠️')) return `<li><span class="text-warning"><i class="bi bi-exclamation-triangle"></i></span> ${x.replace('⚠️','')}</li>`;
          return `<li><span class="text-success"><i class="bi bi-check-circle-fill"></i></span> ${x.replace('found','found')}</li>`;
        }).join('');

        // Mistakes as flip cards
        mistakeCards.innerHTML = (data.mistakes||[]).map((m,i)=>{
          if (typeof m === 'string') return `
            <div class="col-md-6 col-lg-4">
              <div class="flip-card sa fade-up" style="min-height:180px;">
                <div class="flip-card-inner">
                  <div class="flip-card-front d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-icon"><i class="bi bi-exclamation-triangle text-warning"></i></div>
                    <div class="fix-title">${m}</div>
                  </div>
                  <div class="flip-card-back d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-why">Why: This can hurt your chances.</div>
                    <div class="fix-how">How to fix: See AI suggestion below.</div>
                    <button class="ai-fix-btn mt-2">Try AI Fix</button>
                  </div>
                </div>
              </div>
            </div>`;
          return `
            <div class="col-md-6 col-lg-4">
              <div class="flip-card sa fade-up" style="min-height:180px;">
                <div class="flip-card-inner">
                  <div class="flip-card-front d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-icon"><i class="bi bi-exclamation-triangle text-warning"></i></div>
                    <div class="fix-title">${m.what}</div>
                  </div>
                  <div class="flip-card-back d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-why">Why: ${m.why}</div>
                    <div class="fix-how">How to fix: ${m.fix}</div>
                    <button class="ai-fix-btn mt-2">Try AI Fix</button>
                  </div>
                </div>
              </div>
            </div>`;
        }).join('');
        if (!data.mistakes?.length) {
          mistakeCards.innerHTML = `
            <div class="col-12">
              <div class="flip-card sa fade-up" style="min-height:140px;">
                <div class="flip-card-inner">
                  <div class="flip-card-front d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-icon"><i class="bi bi-check-circle-fill text-success"></i></div>
                    <div class="fix-title">No major mistakes detected.</div>
                  </div>
                  <div class="flip-card-back d-flex flex-column align-items-center justify-content-center">
                    <div class="fix-why">Great job! Your resume is clear of major issues.</div>
                  </div>
                </div>
              </div>
            </div>`;
        }

        // Readability
        readability.innerHTML = `<span class="fw-bold">${data.readability||'-'}</span>`;
        let pct = Math.max(0, Math.min(100, parseInt(data.readability||0,10)));
        readMeterBar.style.width = pct + '%';
        let label = data.readability_meter || '';
        let color = data.readability_class || 'secondary';
        readMeterLabel.textContent = label;
        readMeterLabel.className = 'badge bg-' + color;

        // Section-by-section
        sections.innerHTML = (data.sections||[]).map(s=>{
          if (s.status === 'ok') return `<li class="ok">${s.section}: <span class="text-success">OK</span> <span class="text-muted">${s.suggestion||''}</span></li>`;
          return `<li class="missing">${s.section}: <span class="text-danger">Missing</span> <span class="text-warning">${s.suggestion||''}</span> <button class="btn btn-sm btn-outline-info ms-2">+ Add section</button></li>`;
        }).join('');

        // Fix this first
        fixFirst.innerHTML = (data.fix_first||[]).map((x,i)=>`<li><input type="checkbox" class="form-check-input me-2" id="quest${i}"><label for="quest${i}">${x}</label></li>`).join('') || '<li>No urgent fixes needed.</li>';

        // Suggestions card
        const suggestionsCard = document.getElementById('suggestionsCard');
        const suggestionsList = document.getElementById('suggestionsList');
        if (suggestionsCard && suggestionsList) {
          if (data.suggestions && data.suggestions.length) {
            suggestionsList.innerHTML = data.suggestions.map(s => `<li>${s}</li>`).join('');
            suggestionsCard.style.display = 'block';
          } else {
            suggestionsCard.style.display = 'none';
          }
        }

        // What recruiters see (ATS parse)
        document.getElementById('atsParse').textContent = (file.files[0]?.name || '') + '\n\n' + (data.ats_parse || '...');

        // What to do next
        nextSteps.innerHTML = (data.next_steps||[]).map(x=>`<li><i class="bi bi-arrow-right-circle me-1"></i>${x}</li>`).join('');

        // Save review data to localStorage for improve page
        localStorage.setItem('resumeReviewData', JSON.stringify(data));

        result.classList.remove('d-none');
        setTimeout(()=>result.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

        bindFlipCards();
        animateCards();

        // Swipe/toggle for before/after
        document.querySelectorAll('.toggle-btn').forEach(btn=>{
          btn.onclick = e => {
            const card = btn.closest('.swipe-card');
            if (card) card.classList.toggle('show-back');
          };
        });
        document.querySelectorAll('.copy-btn').forEach(btn=>{
          btn.onclick = e => {
            const txt = btn.closest('.swipe-back').querySelector('.text-success')?.textContent || '';
            navigator.clipboard.writeText(txt);
            btn.textContent = 'Copied!';
            setTimeout(()=>btn.textContent='Copy', 1200);
          };
        });

        // Animate checkboxes for quests
        document.querySelectorAll('.quest-list input[type="checkbox"]').forEach(cb=>{
          cb.addEventListener('change', ()=>{
            if (cb.checked) cb.parentElement.classList.add('completed');
            else cb.parentElement.classList.remove('completed');
          });
        });

        // Confetti on healthy
        if (data.confetti && window.confetti) setTimeout(confettiBurst, 400);
      }catch(e){
        showAlert('Review failed: ' + e.message);
      }finally{
        btn.disabled = false; spinner.classList.add('d-none');
      }
    });
  }

  // Improve Resume button
  if (improveBtn) {
    improveBtn.onclick = () => {
      window.location.href = '/improve-resume/';
    };
  }
});
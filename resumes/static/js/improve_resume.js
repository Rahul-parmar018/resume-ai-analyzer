document.addEventListener('DOMContentLoaded', function() {
  console.log('Improve Resume JS loaded');
  
  // CSRF token helper function
  const getCsrf = () => (document.cookie.match(/csrftoken=([^;]+)/)||[])[1] || '';
  
  // Animate in cards
  const els = document.querySelectorAll('.sa');
  if (els.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
    }, { threshold: .14 });
    els.forEach(el => io.observe(el));
  }

  // Video rotation - play all three videos one by one
  const heroVideo = document.getElementById('heroVideo');
  const videos = ['V1.mp4', 'V2.mp4', 'V3.mp4'];
  let currentVideoIndex = 0;
  
  if (heroVideo) {
    // Function to switch to next video
    function switchToNextVideo() {
      currentVideoIndex = (currentVideoIndex + 1) % videos.length;
      const videoSrc = `/static/img/templates/${videos[currentVideoIndex]}`;
      heroVideo.src = videoSrc;
      heroVideo.load();
      heroVideo.play();
    }
    
    // Switch video every 8 seconds
    setInterval(switchToNextVideo, 8000);
    
    // Handle video end event to ensure smooth transition
    heroVideo.addEventListener('ended', switchToNextVideo);
  }

  // Badge wall and XP bar (demo)
  const badgeWall = document.getElementById('improveBadgeWall');
  const xpBar = document.getElementById('improveXPBar');
  if (badgeWall && xpBar) {
    badgeWall.innerHTML = `<span class="badge">Action Verbs Pro</span> <span class="badge">ATS Ready</span> <span class="badge">Metrics Master</span> <span class="badge">Clarity Champ</span>`;
    setTimeout(() => { xpBar.style.width = '68%'; }, 400);
  }

  // Analyze & Improve Button Logic
  const improveForm = document.getElementById('improveForm');
  const improveText = document.getElementById('improveText');
  const improveFile = document.getElementById('improveFile');
  const improveAnalyzeBtn = document.getElementById('improveAnalyzeBtn');
  const improveSpinner = document.getElementById('improveSpinner');
  const improveAlert = document.getElementById('improveAlert');
  const fileUploadSection = document.getElementById('fileUploadSection');
  const analysisResultsSection = document.getElementById('analysisResultsSection');
  
  if (improveForm && improveAnalyzeBtn) {
    console.log('Form and button found, adding event listener');
    improveForm.addEventListener('submit', async (e) => {
      console.log('Form submitted');
      e.preventDefault();
      
      // Clear previous alerts
      if (improveAlert) {
        improveAlert.classList.add('d-none');
        improveAlert.textContent = '';
      }
      
      // Check if we have content
      const textContent = improveText ? improveText.value.trim() : '';
      const fileContent = improveFile ? improveFile.files[0] : null;
      
      console.log('Text content:', textContent);
      console.log('File content:', fileContent);
      
      if (!textContent && !fileContent) {
        showAlert('Please paste your resume text or upload a file.');
        return;
      }
      
      // Show loading state
      improveAnalyzeBtn.disabled = true;
      if (improveSpinner) improveSpinner.classList.remove('d-none');
      improveAnalyzeBtn.textContent = 'Analyzing...';
      
      console.log('Starting analysis...');
      
      try {
        let analysisResult;
        
        if (fileContent) {
          console.log('Processing file upload...');
          // Handle file upload
          const formData = new FormData();
          formData.append('resume', fileContent);
          
          const response = await fetch('/api/review-resume/', {
            method: 'POST',
            headers: { 'X-CSRFToken': getCsrf() },
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Analysis failed: ${response.status}`);
          }
          
          analysisResult = await response.json();
          console.log('File analysis result:', analysisResult);
        } else {
          console.log('Processing text input...');
          // Handle text input - simulate analysis
          analysisResult = analyzeTextContent(textContent);
          console.log('Text analysis result:', analysisResult);
        }
        
        console.log('Hiding file upload and showing results...');
        // Hide file upload section and show results
        hideFileUploadAndShowResults();
        
        // Display results in the new section
        displayAnalysisResultsInSection(analysisResult);
        
        // Update XP and badges
        updateProgressAndBadges(analysisResult);
        
        console.log('Analysis complete!');
        
      } catch (error) {
        console.error('Analysis error:', error);
        showAlert(`Analysis failed: ${error.message}`);
      } finally {
        // Reset button state
        improveAnalyzeBtn.disabled = false;
        if (improveSpinner) improveSpinner.classList.add('d-none');
        improveAnalyzeBtn.textContent = 'Analyze & Improve';
      }
    });
  }
  
  // Function to hide file upload section and show results
  function hideFileUploadAndShowResults() {
    // Hide the file upload section with animation
    if (fileUploadSection) {
      fileUploadSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      fileUploadSection.style.opacity = '0';
      fileUploadSection.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        fileUploadSection.classList.add('d-none');
        
        // Show the analysis results section
        if (analysisResultsSection) {
          analysisResultsSection.classList.remove('d-none');
          analysisResultsSection.style.opacity = '0';
          analysisResultsSection.style.transform = 'translateY(20px)';
          
          // Animate in the results
          setTimeout(() => {
            analysisResultsSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            analysisResultsSection.style.opacity = '1';
            analysisResultsSection.style.transform = 'translateY(0)';
          }, 100);
        }
      }, 300);
    }
  }
  
  // Function to reset the form (for "Analyze Another Resume" button)
  function resetFormForNewAnalysis() {
    // Hide results section
    if (analysisResultsSection) {
      analysisResultsSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      analysisResultsSection.style.opacity = '0';
      analysisResultsSection.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        analysisResultsSection.classList.add('d-none');
        
        // Show file upload section
        if (fileUploadSection) {
          fileUploadSection.classList.remove('d-none');
          fileUploadSection.style.opacity = '0';
          fileUploadSection.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            fileUploadSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            fileUploadSection.style.opacity = '1';
            fileUploadSection.style.transform = 'translateY(0)';
          }, 100);
        }
      }, 300);
    }
    
    // Clear form data
    if (improveText) improveText.value = '';
    if (improveFile) improveFile.value = '';
    if (improveAlert) {
      improveAlert.classList.add('d-none');
      improveAlert.textContent = '';
    }
  }
  
  // "Analyze Another Resume" button logic
  const analyzeAgainBtn = document.getElementById('analyzeAgainBtn');
  if (analyzeAgainBtn) {
    analyzeAgainBtn.addEventListener('click', () => {
      resetFormForNewAnalysis();
    });
  }
  
  // "Download Report" button logic
  const downloadReportBtn = document.getElementById('downloadReportBtn');
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', () => {
      // Create a simple text report
      const reportContent = generateReportContent();
      downloadTextFile(reportContent, 'resume-analysis-report.txt');
    });
  }
  
  
  // Helper Functions
  function showAlert(message) {
    console.log('Showing alert:', message);
    if (improveAlert) {
      improveAlert.textContent = message;
      improveAlert.classList.remove('d-none');
    } else {
      console.error('Alert element not found');
    }
  }
  
  function analyzeTextContent(text) {
    // Simulate AI analysis
    const wordCount = text.split(/\s+/).length;
    const hasMetrics = /\d+%|\d{4}|\$\d/.test(text);
    const hasWeakVerbs = /\b(responsible for|duties include|tasked with|help|assist|support|participate|involved)\b/i.test(text);
    const hasSections = {
      contact: /contact|email|phone|linkedin/i.test(text),
      experience: /experience|work history/i.test(text),
      education: /education/i.test(text),
      skills: /skills/i.test(text)
    };
    
    const healthLevel = Object.values(hasSections).filter(Boolean).length >= 3 && !hasWeakVerbs ? 3 : 
                       Object.values(hasSections).filter(Boolean).length >= 2 ? 2 : 1;
    
    return {
      health_level: healthLevel,
      health_emoji: healthLevel === 3 ? '😃' : healthLevel === 2 ? '🙂' : '😬',
      health_label: healthLevel === 3 ? 'Level 3 – Resume Pro' : healthLevel === 2 ? 'Level 2 – Resume Rookie' : 'Level 1 – Needs Work',
      summary: `Your resume has ${wordCount} words. ${hasMetrics ? 'Good use of metrics!' : 'Consider adding more numbers and percentages.'} ${hasWeakVerbs ? 'Try replacing weak verbs with strong action words.' : 'Great use of strong action verbs!'}`,
      mistakes: hasWeakVerbs ? [{
        what: "Weak verbs detected",
        why: "Strong verbs show leadership and results.",
        fix: "Replace 'helped' with 'led', 'delivered', etc."
      }] : [],
      readability: Math.min(95, Math.max(30, 80 - (hasWeakVerbs ? 20 : 0))),
      readability_meter: "Good",
      readability_class: "success",
      sections: Object.entries(hasSections).map(([section, found]) => ({
        section: section.charAt(0).toUpperCase() + section.slice(1),
        status: found ? "ok" : "missing",
        suggestion: found ? `${section} section found` : `Add a ${section} section`
      })),
      fix_first: hasWeakVerbs ? ["Replace weak verbs with strong action words"] : ["Add more metrics to your achievements"],
      before_after: hasWeakVerbs ? [{
        original: "Responsible for data entry",
        improved: "Led data entry operations, processing 1,000+ records daily with 99.9% accuracy"
      }] : [],
      confetti: healthLevel === 3
    };
  }
  
  function aiRewriteBullet(original) {
    let improved = original;
    
    // Replace weak verbs
    improved = improved.replace(/\b(responsible for|duties include|tasked with)\b/gi, "Led");
    improved = improved.replace(/\b(help|assist|support|participate|involved)\b/gi, "Delivered");
    improved = improved.replace(/\b(manage|handled|worked on)\b/gi, "Managed");
    improved = improved.replace(/\b(create|made|built)\b/gi, "Created");
    improved = improved.replace(/\b(improve|enhanced|better)\b/gi, "Improved");
    
    // Add metrics if missing
    if (!/\d/.test(improved)) {
      const metrics = [
        "by 25%",
        "by 30%", 
        "by 40%",
        "to 95% accuracy",
        "by $50K",
        "by 50%",
        "to 99.9%",
        "by 20%"
      ];
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      improved += ` ${randomMetric}`;
    }
    
    // Add impact words
    if (!/\b(increased|decreased|improved|reduced|enhanced|optimized|streamlined)\b/i.test(improved)) {
      const impactWords = ["significantly", "dramatically", "substantially", "effectively"];
      const randomImpact = impactWords[Math.floor(Math.random() * impactWords.length)];
      improved = improved.replace(/^(Led|Delivered|Managed|Created|Improved)/, `$1 ${randomImpact}`);
    }
    
    return improved;
  }
  
  function displayAnalysisResultsInSection(data) {
    // Update health summary
    const healthEmoji = document.getElementById('analysisHealthEmoji');
    const healthLabel = document.getElementById('analysisHealthLabel');
    const summary = document.getElementById('analysisSummary');
    const healthBar = document.getElementById('analysisHealthBar');
    
    if (healthEmoji) healthEmoji.textContent = data.health_emoji || '😐';
    if (healthLabel) healthLabel.textContent = data.health_label || 'Analysis Complete';
    if (summary) {
      // Convert markdown formatting to HTML for better display
      const summaryText = data.summary || 'Your resume has been analyzed.';
      summary.innerHTML = summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }
    if (healthBar) {
      const healthPercentage = (data.health_level || 1) * 33;
      healthBar.style.width = `${healthPercentage}%`;
      healthBar.className = `progress-bar bg-${data.health_level >= 3 ? 'success' : data.health_level >= 2 ? 'warning' : 'danger'}`;
    }
    
    // Update issues
    const issuesList = document.getElementById('analysisIssues');
    if (issuesList) {
      if (data.mistakes && data.mistakes.length > 0) {
        issuesList.innerHTML = data.mistakes.map(mistake => {
          if (typeof mistake === 'string') {
            return `<li class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>${mistake}</li>`;
          } else {
            return `<li class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i><strong>${mistake.what}:</strong> ${mistake.why}</li>`;
          }
        }).join('');
      } else {
        issuesList.innerHTML = '<li class="text-success"><i class="bi bi-check-circle me-2"></i>No major issues detected!</li>';
      }
    }
    
    // Update readability
    const readabilityScore = document.getElementById('analysisReadabilityScore');
    const readabilityLabel = document.getElementById('analysisReadabilityLabel');
    const readabilityBar = document.getElementById('analysisReadabilityBar');
    
    if (readabilityScore) readabilityScore.textContent = data.readability || 'N/A';
    if (readabilityLabel) {
      readabilityLabel.textContent = data.readability_meter || 'Unknown';
      readabilityLabel.className = `badge bg-${data.readability_class || 'secondary'}`;
    }
    if (readabilityBar) {
      const readabilityPercentage = Math.min(100, Math.max(0, data.readability || 0));
      readabilityBar.style.width = `${readabilityPercentage}%`;
      readabilityBar.className = `progress-bar bg-${data.readability_class || 'secondary'}`;
    }
    
    // Update sections
    const sectionsList = document.getElementById('analysisSections');
    if (sectionsList && data.sections) {
      sectionsList.innerHTML = data.sections.map(section => {
        const isOk = section.status === 'ok';
        return `<li class="${isOk ? 'text-success' : 'text-warning'}">
          <i class="bi bi-${isOk ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
          <strong>${section.section}:</strong> ${section.suggestion}
        </li>`;
      }).join('');
    }
    
    // Update AI rewrite example
    const rewriteCard = document.getElementById('analysisRewriteCard');
    const beforeText = document.getElementById('analysisBeforeText');
    const afterText = document.getElementById('analysisAfterText');
    
    if (data.before_after && data.before_after.length > 0) {
      if (rewriteCard) rewriteCard.classList.remove('d-none');
      if (beforeText) beforeText.textContent = data.before_after[0].original;
      if (afterText) afterText.textContent = data.before_after[0].improved;
    } else {
      if (rewriteCard) rewriteCard.classList.add('d-none');
    }
    
    // Store data for report generation
    window.currentAnalysisData = data;
  }
  
  function displayAnalysisResults(data) {
    // Legacy function - now redirects to the new section display
    displayAnalysisResultsInSection(data);
  }
  
  function updateProgressAndBadges(data) {
    // Update XP bar
    const xpBar = document.getElementById('improveXPBar');
    if (xpBar) {
      const xpPercentage = (data.health_level / 3) * 100;
      xpBar.style.width = `${xpPercentage}%`;
    }
    
    // Update badges
    const badgeWall = document.getElementById('improveBadgeWall');
    if (badgeWall) {
      let badges = [];
      if (data.health_level >= 3) badges.push('<span class="badge">Resume Pro</span>');
      if (data.readability_class === 'success') badges.push('<span class="badge">Easy to Read</span>');
      if (data.mistakes.length === 0) badges.push('<span class="badge">No Issues</span>');
      if (data.sections.filter(s => s.status === 'ok').length >= 3) badges.push('<span class="badge">Complete</span>');
      
      badgeWall.innerHTML = badges.join(' ');
    }
    
    // Trigger confetti if healthy
    if (data.confetti && window.confetti) {
      setTimeout(() => {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }
  
  function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('btn-success');
      button.classList.remove('btn-outline-light');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-light');
      }, 1500);
    });
  }
  
  function generateReportContent() {
    const data = window.currentAnalysisData;
    if (!data) return 'No analysis data available.';
    
    const report = `
AI RESUME SCREENER - ANALYSIS REPORT
=====================================

ANALYSIS SUMMARY
----------------
Health Level: ${data.health_emoji} ${data.health_label}
Readability Score: ${data.readability} (${data.readability_meter})
Overall Summary: ${data.summary}

ISSUES FOUND
------------
${data.mistakes && data.mistakes.length > 0 ? 
  data.mistakes.map(mistake => 
    typeof mistake === 'string' ? `• ${mistake}` : `• ${mistake.what}: ${mistake.why}`
  ).join('\n') : 
  '• No major issues detected!'}

RESUME SECTIONS
---------------
${data.sections ? data.sections.map(section => 
  `• ${section.section}: ${section.status === 'ok' ? '✓ Found' : '✗ Missing'} - ${section.suggestion}`
).join('\n') : '• No section data available'}

PRIORITY FIXES
--------------
${data.fix_first ? data.fix_first.map(fix => `• ${fix}`).join('\n') : '• No urgent fixes needed'}

AI REWRITE EXAMPLES
-------------------
${data.before_after && data.before_after.length > 0 ? 
  data.before_after.map(example => 
    `Before: ${example.original}\nAfter: ${example.improved}\n`
  ).join('\n') : 
  'No rewrite examples available'}

Generated on: ${new Date().toLocaleString()}
    `;
    
    return report.trim();
  }
  
  function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  // Fallback click handler for the analyze button
  if (improveAnalyzeBtn) {
    improveAnalyzeBtn.addEventListener('click', function(e) {
      console.log('Analyze button clicked directly');
      // Trigger form submission
      if (improveForm) {
        improveForm.dispatchEvent(new Event('submit'));
      }
    });
  }
  
  console.log('All event listeners added');
});
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  // Persistence check
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Single source of truth is body class
  const body = document.body;

  function setMode(isDark) {
    if (isDark) {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      localStorage.setItem('theme', 'light');
    }
  }

  // Initial load
  const startDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  setMode(startDark);

  btn.addEventListener('click', () => {
    const isCurrentlyDark = body.classList.contains('theme-dark');
    setMode(!isCurrentlyDark);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  function applyTheme(dark) {
    const html = document.documentElement;
    if (dark) {
      html.classList.remove('light-theme');
      btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
      localStorage.setItem('theme', 'dark');
      console.log('Applied dark theme - HTML classes:', html.className);
    } else {
      html.classList.add('light-theme');
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      localStorage.setItem('theme', 'light');
      console.log('Applied light theme - HTML classes:', html.className);
    }
  }

  applyTheme(isDark);

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentlyDark = !html.classList.contains('light-theme');
    const newTheme = currentlyDark ? 'light' : 'dark';
    console.log('Toggle clicked, currently:', currentlyDark ? 'dark' : 'light', 'switching to:', newTheme);
    applyTheme(newTheme === 'dark');
  });
});

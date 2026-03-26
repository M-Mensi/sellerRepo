// theme.js: dark <-> light
(function () {
  const STORAGE_KEY = 'snapchat-theme';
  const root = document.documentElement;
  const apply = (t) => t === 'light' ? root.classList.add('light-theme') : root.classList.remove('light-theme');

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return apply(saved);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(prefersDark ? 'dark' : 'light');
  }

  window.toggleTheme = function () {
    const next = root.classList.contains('light-theme') ? 'dark' : 'light';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  load();
})();
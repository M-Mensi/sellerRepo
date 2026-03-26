// unsolvedList.js: fetch unresolved issues and render table
(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzc0xIB57JQEedElAjNNaX5IR2y8HbOE5OC5iubHTzl6moz_XXNPoezN3CpoJ65fnKSuw/exec';
  const table = document.getElementById('unsolvedTable').querySelector('tbody');
  const statusEl = document.getElementById('unsolvedStatus');
  const refreshBtn = document.getElementById('refreshUnsolved');

  function setStatus(msg, tone = 'muted') {
    statusEl.textContent = msg || '';
    statusEl.className = 'status ' + tone;
  }

  async function load() {
    setStatus('Loading unresolved issues…', 'muted');
    table.innerHTML = '';
    try {
      const url = ENDPOINT + '?action=unsolved';
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const rows = Array.isArray(data?.rows) ? data.rows : [];

      if (!rows.length) {
        setStatus('No unresolved issues found. 🎉', 'ok');
        return;
      }
      setStatus(`Showing ${rows.length} unresolved issue(s).`, 'muted');

      const frag = document.createDocumentFragment();
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(r.timestamp || '')}</td>
          <td>${escapeHtml(r.sellerId || '')}</td>
          <td>${escapeHtml(r.issueType || '')}</td>
          <td>${escapeHtml(r.subcategory || '')}</td>
          <td>${escapeHtml(r.description || '')}</td>
          <td>${r.firstTime ? '✅' : ''}</td>
          <td>${r.solved ? '✅' : ''}</td>
          <td>${escapeHtml(r.guide || '')}</td>
        `;
        frag.appendChild(tr);
      });
      table.appendChild(frag);
    } catch (err) {
      console.error(err);
      setStatus('Failed to load unresolved issues. Check endpoint permissions.', 'no');
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c]));
  }

  // Public API
  window.UnsolvedList = {
    open() {
      window.Modals && window.Modals.openUnsolved();
      load();
    }
  };

  refreshBtn.addEventListener('click', (e) => { e.preventDefault(); load(); });
})();
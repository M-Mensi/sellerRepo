// addingIssue.js: populate lists, submit to Google Apps Script
(function () {
  // ====== CONFIG ======
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzc0xIB57JQEedElAjNNaX5IR2y8HbOE5OC5iubHTzl6moz_XXNPoezN3CpoJ65fnKSuw/exec';

  // Canonical taxonomy (also used to create per-category sheets on backend)
  const TAXONOMY = {
    'Account Related': ['Account Creation', 'Account Lockout', 'Password Reset', 'Profile/Role', 'Account Merge'],
    'Computer': ['Hardware', 'Network/VPN', 'OS Update', 'Browser', 'Security/Antivirus'],
    'Omni-channel': ['Status/Availability', 'Routing', 'Case Assignment', 'Chat/Voice', 'Notification'],
    'Access & Permissions': ['License', 'Profile/Role', 'Object Permission', 'Field Permission', 'Login IP Restriction'],
    'Salesforce Performance': ['Slow UI', 'Login Issues', 'Timeout', 'Search/Index', 'Lightning Errors'],
    'Data Sync': ['Duplication', 'Missing Records', 'Delayed Sync', 'Integration Error', 'Import/Export'],
    'Other': ['Other']
  };

  // ====== Cache DOM ======
  const modalId = 'issueModal';
  const form = document.getElementById('issueForm');
  const statusEl = document.getElementById('issueStatus');
  const submitBtn = document.getElementById('issueSubmitBtn');
  const sellerIdEl = document.getElementById('sellerId');
  const issueTypeEl = document.getElementById('issueType');
  const subcatEl = document.getElementById('subcategory');
  const descEl = document.getElementById('description');
  const firstTimeEl = document.getElementById('firstTime');
  const solvedEl = document.getElementById('solved');
  const guideNameEl = document.getElementById('guideName');

  // ====== Helpers ======
  function setStatus(msg, tone = 'muted') {
    statusEl.textContent = msg || '';
    statusEl.className = 'status ' + tone;
  }
  function clearStatus() { setStatus('', ''); }
  function populateIssueTypes() {
    issueTypeEl.innerHTML = '<option value="" selected disabled>Select issue type</option>';
    Object.keys(TAXONOMY).forEach(k => {
      const opt = document.createElement('option');
      opt.value = k; opt.textContent = k;
      issueTypeEl.appendChild(opt);
    });
  }
  function populateSubcats(type) {
    const items = TAXONOMY[type] || [];
    subcatEl.innerHTML = '<option value="" selected>Select subcategory</option>';
    Array.from(new Set(items)).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      subcatEl.appendChild(opt);
    });
  }

  // Populate lists on load
  populateIssueTypes();
  issueTypeEl.addEventListener('change', (e) => populateSubcats(e.target.value));

  // Public API (modal open)
  window.AddingIssue = {
    open() {
      window.Modals && window.Modals.openIssue();
      setTimeout(() => sellerIdEl && sellerIdEl.focus(), 50);
    }
  };

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    const sellerId = (sellerIdEl.value || '').trim();
    const issueType = issueTypeEl.value;
    const subcategory = subcatEl.value || '';
    const description = (descEl.value || '').trim();
    const firstTime = !!firstTimeEl.checked;
    const solved = !!solvedEl.checked;
    const guideName = guideNameEl.value || 'N/A';

    if (!sellerId || !issueType || !description) {
      setStatus('Please fill required fields (Seller ID, Issue Type, Description).', 'warn');
      return;
    }

    const payload = { sellerId, issueType, subcategory, description, firstTime, solved, guideName, action: 'append' };

    // UX
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    setStatus('Submitting to Google Sheets…', 'muted');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids preflight
        body: JSON.stringify(payload)
      });

      // JSON response (if available)
      let okay = res.ok;
      try {
        const data = await res.json();
        okay = okay && data && data.ok;
      } catch (_) {}

      if (okay) {
        setStatus('Saved. Thanks! Your issue has been logged.', 'ok');
        setTimeout(() => { window.Modals && window.Modals.closeIssue(); form.reset(); clearStatus(); }, 600);
      } else {
        throw new Error('Submission failed. Check endpoint or permissions.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Could not submit. Check connection/endpoint and try again.', 'no');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
})();
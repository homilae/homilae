document.addEventListener('DOMContentLoaded', function () {

  const raw = document.getElementById('raw-content');
  if (!raw) return;

  const originalSections = [];
  const translationSections = [];

  let inTranslation = false;
  Array.from(raw.children).forEach(node => {
    if (node.tagName === 'H2') {
      if (node.textContent.toLowerCase().includes('english') ||
          node.textContent.toLowerCase().includes('translation')) {
        inTranslation = true;
      }
      return;
    }
    if (node.classList && node.classList.contains('text-section')) {
      if (inTranslation) {
        translationSections.push(node.cloneNode(true));
      } else {
        originalSections.push(node.cloneNode(true));
      }
    }
  });

  const reader = document.getElementById('parallel-reader');
  if (!reader) return;

  reader.innerHTML = '';

  const count = Math.max(originalSections.length, translationSections.length);

  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = 'parallel-row';
    row.id = 'section-' + (i + 1);

    const origCell = document.createElement('div');
    origCell.className = 'parallel-cell cell-original';
    if (originalSections[i]) {
      originalSections[i].childNodes.forEach(child => {
        origCell.appendChild(child.cloneNode(true));
      });
    }

    const transCell = document.createElement('div');
    transCell.className = 'parallel-cell cell-translation';
    if (translationSections[i]) {
      translationSections[i].childNodes.forEach(child => {
        transCell.appendChild(child.cloneNode(true));
      });
    }

    row.appendChild(origCell);
    row.appendChild(transCell);
    reader.appendChild(row);
  }

  window.setView = function(view) {
    const r = document.getElementById('parallel-reader');
    if (!r) return;
    r.className = 'parallel-reader';
    if (view === 'original') r.classList.add('show-original');
    if (view === 'translation') r.classList.add('show-translation');
    document.querySelectorAll('.view-btn, .s-btn').forEach(b => {
      const oc = b.getAttribute('onclick') || '';
      if (!oc.startsWith('setView')) return;
      b.classList.toggle('active', oc.includes("'" + view + "'"));
    });
    localStorage.setItem('homiliae-view', view);
  };

  window.toggleSettings = function() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    if (!panel || !overlay) return;
    panel.classList.toggle('open');
    overlay.classList.toggle('open');
  };

  window.toggleInfo = function() {
    const modal = document.getElementById('info-modal');
    const overlay = document.getElementById('info-overlay');
    if (!modal || !overlay) return;
    modal.classList.toggle('open');
    overlay.classList.toggle('open');
  };

  window.setMode = function(mode) {
    document.body.classList.remove('dark-mode', 'sepia-mode');
    if (mode === 'dark') document.body.classList.add('dark-mode');
    if (mode === 'sepia') document.body.classList.add('sepia-mode');
    document.querySelectorAll('.s-btn').forEach(b => {
      const oc = b.getAttribute('onclick') || '';
      if (!oc.startsWith('setMode')) return;
      b.classList.toggle('active', oc.includes("'" + mode + "'"));
    });
    localStorage.setItem('homiliae-mode', mode);
  };

  window.setFontSize = function(size) {
    document.body.classList.remove('font-small','font-medium','font-large','font-xlarge');
    document.body.classList.add('font-' + size);
    document.querySelectorAll('.s-btn').forEach(b => {
      const oc = b.getAttribute('onclick') || '';
      if (!oc.startsWith('setFontSize')) return;
      b.classList.toggle('active', oc.includes("'" + size + "'"));
    });
    localStorage.setItem('homiliae-fontsize', size);
  };

  window.setLineHeight = function(lh) {
    document.body.classList.remove('lh-compact','lh-normal','lh-spacious');
    document.body.classList.add('lh-' + lh);
    document.querySelectorAll('.s-btn').forEach(b => {
      const oc = b.getAttribute('onclick') || '';
      if (!oc.startsWith('setLineHeight')) return;
      b.classList.toggle('active', oc.includes("'" + lh + "'"));
    });
    localStorage.setItem('homiliae-lineheight', lh);
  };

  window.setFont = function(font) {
    document.body.classList.remove('font-cardo','font-garamond');
    document.body.classList.add('font-' + font);
    document.querySelectorAll('.s-btn').forEach(b => {
      const oc = b.getAttribute('onclick') || '';
      if (!oc.startsWith('setFont')) return;
      b.classList.toggle('active', oc.includes("'" + font + "'"));
    });
    localStorage.setItem('homiliae-font', font);
  };

  window.toggleTooltips = function(enabled) {
    document.body.classList.toggle('no-tooltips', !enabled);
    localStorage.setItem('homiliae-tooltips', enabled ? 'on' : 'off');
  };

  const savedMode = localStorage.getItem('homiliae-mode');
  if (savedMode) setMode(savedMode);

  const savedSize = localStorage.getItem('homiliae-fontsize');
  if (savedSize) setFontSize(savedSize);

  const savedLH = localStorage.getItem('homiliae-lineheight');
  if (savedLH) setLineHeight(savedLH);

  const savedFont = localStorage.getItem('homiliae-font');
  if (savedFont) setFont(savedFont);

  const savedView = localStorage.getItem('homiliae-view');
  if (savedView) setView(savedView);

  const savedTooltips = localStorage.getItem('homiliae-tooltips');
  if (savedTooltips === 'off') {
    document.body.classList.add('no-tooltips');
    const toggle = document.getElementById('tooltip-toggle');
    if (toggle) toggle.checked = false;
  }

});

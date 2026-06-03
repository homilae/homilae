document.addEventListener('DOMContentLoaded', function () {

  const raw = document.getElementById('raw-content');
  if (!raw) return;

  const originalSections = [];
  const translationSections = [];

  let inTranslation = false;
  Array.from(raw.children).forEach(node => {
    if (node.tagName === 'H2') {
      const text = node.textContent.toLowerCase();
      if (text.includes('english') || text.includes('translation')) {
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

  const origCol  = document.getElementById('original-content');
  const transCol = document.getElementById('translation-content');

  const count = Math.max(originalSections.length, translationSections.length);

  for (let i = 0; i < count; i++) {
    const sectionNum = i + 1;

    const origCell = document.createElement('div');
    origCell.className = 'text-section';
    origCell.dataset.section = sectionNum;
    if (originalSections[i]) {
      const label = document.createElement('span');
      label.className = 'section-num';
      label.textContent = '§ ' + sectionNum;
      origCell.appendChild(label);
      originalSections[i].childNodes.forEach(child => {
        origCell.appendChild(child.cloneNode(true));
      });
    }

    const transCell = document.createElement('div');
    transCell.className = 'text-section';
    transCell.dataset.section = sectionNum;
    if (translationSections[i]) {
      const label = document.createElement('span');
      label.className = 'section-num';
      label.textContent = '§ ' + sectionNum;
      transCell.appendChild(label);
      translationSections[i].childNodes.forEach(child => {
        transCell.appendChild(child.cloneNode(true));
      });
    }

    origCol.appendChild(origCell);
    transCol.appendChild(transCell);
  }

  function alignSections() {
    const origCells  = origCol.querySelectorAll('.text-section');
    const transCells = transCol.querySelectorAll('.text-section');

    origCells.forEach(c => c.style.minHeight = '');
    transCells.forEach(c => c.style.minHeight = '');

    const len = Math.min(origCells.length, transCells.length);
    for (let i = 0; i < len; i++) {
      const origH  = origCells[i].getBoundingClientRect().height;
      const transH = transCells[i].getBoundingClientRect().height;
      const maxH   = Math.max(origH, transH);
      origCells[i].style.minHeight  = maxH + 'px';
      transCells[i].style.minHeight = maxH + 'px';
    }
  }

  alignSections();
  window.addEventListener('resize', alignSections);

  document.querySelectorAll('.text-section').forEach(cell => {
    cell.addEventListener('mouseenter', function () {
      const sec = this.dataset.section;
      document.querySelectorAll(`.text-section[data-section="${sec}"]`)
        .forEach(c => c.classList.add('highlighted'));
    });
    cell.addEventListener('mouseleave', function () {
      document.querySelectorAll('.text-section')
        .forEach(c => c.classList.remove('highlighted'));
    });
  });

  window.setView = function(view) {
    const reader = document.getElementById('parallel-reader');
    const buttons = document.querySelectorAll('.view-btn');

    reader.className = 'parallel-reader';
    buttons.forEach(b => b.classList.remove('active'));

    if (view === 'original') {
      reader.classList.add('show-original');
    } else if (view === 'translation') {
      reader.classList.add('show-translation');
    }

    setTimeout(alignSections, 50);

    buttons.forEach(b => {
      if (b.getAttribute('onclick').includes(view)) {
        b.classList.add('active');
      }
    });
  };

});
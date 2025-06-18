function startApp() {
  console.log('Start App button clicked');
  if (typeof miro === 'undefined') {
    alert('This must be run inside Miro.');
    return;
  }

  miro.onReady(() => {
    setupEventListeners();
    monitorSelection();
    showStatus('Ready to shuffle! Select objects and click shuffle.', 'success');
  });
}

// async function init() {
//   await miro.board.ui.openPanel({ url: 'index.html' });
// }

function setupEventListeners() {
  const shuffleButton = document.getElementById('shuffleButton');
  shuffleButton.addEventListener('click', async () => {
    const selectedWidgets = await miro.board.selection.get();

    if (selectedWidgets.length < 2) {
      showStatus('Select at least 2 objects to shuffle.', 'error');
      return;
    }

    handleShuffle(selectedWidgets);
  });
}

async function monitorSelection() {
  await miro.board.ui.on('SELECTION_UPDATED', async () => {
    const selectedWidgets = await miro.board.selection.get();
    const selectionCount = selectedWidgets.length;

    const selectionCountElem = document.getElementById('selectionCount');
    const button = document.getElementById('shuffleButton');
    const buttonText = document.getElementById('buttonText');

    selectionCountElem.textContent = selectionCount;

    if (selectionCount >= 2) {
      button.removeAttribute('disabled');
      buttonText.textContent = 'Shuffle Objects';
    } else {
      button.setAttribute('disabled', true);
      buttonText.textContent = 'Select objects to shuffle';
    }
  });
}

function handleShuffle(widgets) {
  const bounds = calculateBounds(widgets);

  if (!bounds) {
    showStatus('Could not calculate bounds.', 'error');
    return;
  }

  const positions = generateRandomPositions(bounds, widgets.length);
  applyPositions(widgets, positions);
  showStatus('Objects shuffled successfully!', 'success');
}

function calculateBounds(widgets) {
  if (!widgets || widgets.length === 0) return null;

  const minX = Math.min(...widgets.map(w => w.x));
  const maxX = Math.max(...widgets.map(w => w.x));
  const minY = Math.min(...widgets.map(w => w.y));
  const maxY = Math.max(...widgets.map(w => w.y));

  return { minX, maxX, minY, maxY };
}

function generateRandomPositions(bounds, count) {
  const positions = [];
  const { minX, maxX, minY, maxY } = bounds;

  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    positions.push({ x, y });
  }

  return positions;
}

async function applyPositions(widgets, positions) {
  const updates = widgets.map((widget, index) => ({
    id: widget.id,
    x: positions[index].x,
    y: positions[index].y
  }));

  await miro.board.widgets.update(updates);
}

function showStatus(message, type) {
  const statusElem = document.getElementById('statusMessage');
  statusElem.textContent = message;

  statusElem.classList.remove('error', 'success');
  statusElem.classList.add(type);

  setTimeout(() => {
    statusElem.textContent = '';
    statusElem.classList.remove('error', 'success');
  }, 3000);
}

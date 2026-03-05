const form = document.forms['generatePW'];
const range = form.elements['char-count'];

function initializeRange() {
  const defaultLength = 0;
  range.value = defaultLength;
  updateRange();
}

// Update Character Length and Range Increment
function updateRange() {
  const charCount = form.querySelector('[data-js="char-count"]');
  const trackIncrement =
    ((range.value - range.min) / (range.max - range.min)) * 100 || 0;

  charCount.textContent = range.value;
  range.style.setProperty('--progress', `${trackIncrement}%`);
}

initializeRange();

// Event Listeners
range.addEventListener('input', updateRange);

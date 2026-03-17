const form = document.forms['generatePW'];
const passwordInput = form.elements['password'];
const range = form.elements['char-count'];
const checkBoxes = form.querySelectorAll('input[type="checkbox"]');
const copyButton = form.querySelector('.btn--copy');
const copyMessage = form.querySelector('.js-success');
const lowercaseLetters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
const uppercaseLetters = lowercaseLetters.map((letter) =>
  letter.toUpperCase(),
);
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = [
  '~',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '=',
  '+',
  '[',
  ']',
  '{',
  '}',
  ';',
  ':',
  "'",
  '"',
  ',',
  '.',
  '<',
  '>',
  '/',
  '?',
  '|',
];
const errorMessages = {
  length: "Character length can't be zero",
  noCheckboxValues: 'Check some character types',
};
const ariaLiveRegion = document.getElementById('live-region');

// Range Setup
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

// Password Setup
function generatePassword(
  length,
  hasUppercase,
  hasLowercase,
  hasNumbers,
  hasSymbols,
) {
  let availableCharacters = [
    ...(hasUppercase ? uppercaseLetters : []),
    ...(hasLowercase ? lowercaseLetters : []),
    ...(hasNumbers ? numbers : []),
    ...(hasSymbols ? symbols : []),
  ];

  let password = '';

  if (availableCharacters.length === 0) return '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * availableCharacters.length,
    );
    password += availableCharacters[randomIndex];
  }
  return password;
}

function updatePassword() {
  const length = range.value;
  const checkboxValues = [...checkBoxes].map(
    (checkbox) => checkbox.checked,
  );
  let password = generatePassword(length, ...checkboxValues);
  passwordInput.value = password;
}

// Strength Meter Setup

// Copy to Clipboard Setup
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyMessage.classList.remove('hidden');
  } catch (err) {
    console.error('Failed to copy password: ', err);
  }
}

// Event Listeners
range.addEventListener('input', updateRange);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const error = form.querySelector('.error');

  if (range.value < 1) {
    // Show error message
    error.classList.remove('hidden');
    error.textContent = errorMessages.length;
    // Update live region for screen readers
    ariaLiveRegion.textContent = `Error: ${errorMessages.length}`;
    // Send focus to range input
    range.focus();
  } else if (![...checkBoxes].some((checkbox) => checkbox.checked)) {
    // Show error message
    error.classList.remove('hidden');
    error.textContent = errorMessages.noCheckboxValues;
    // Update live region for screen readers
    ariaLiveRegion.textContent = `Error: ${errorMessages.noCheckboxValues}`;
    // Send focus to first checkbox
    checkBoxes[0].focus();
  } else {
    // Remove error message
    error.classList.add('hidden');
    error.textContent = '';
    // Generate and display password
    updatePassword();
    ariaLiveRegion.textContent = `Your password is: ${passwordInput.value}`;
    // Enable copy button and send focus to it
    copyButton.removeAttribute('disabled');
    copyButton.focus();
  }
});
copyButton.addEventListener('click', copyToClipboard);

window.onload = () => {
  // Disable copy button on load
  copyButton.setAttribute('disabled', true);
  // Clear form inputs on load
  form.reset();
  // Reset range to zero and update display
  initializeRange();
};

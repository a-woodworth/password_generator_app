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
const ratings = [
  // Strength Rating, Strength CSS Class
  ['too weak!', 'too-weak'],
  ['weak', 'weak'],
  ['medium', 'medium'],
  ['strong', 'strong'],
];
const ariaLiveRegion = document.getElementById('live-region');

// Range Setup
function initializeRange() {
  const defaultLength = 0;

  range.value = defaultLength;
  updateRange();
}

// Update Range Track and Displayed Value
function updateRange() {
  const charCount = form.querySelector('[data-js="char-count"]');
  const trackIncrement =
    ((Number(range.value) - Number(range.min)) /
      (Number(range.max) - Number(range.min))) *
      100 || 0;

  charCount.textContent = Number(range.value);
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
  const availableCharacters = [
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
  const length = Number(range.value);
  const checkboxValues = [...checkBoxes].map(
    (checkbox) => checkbox.checked,
  );
  let password = generatePassword(length, ...checkboxValues);

  // Get number of character types selected for strength rating
  addStrengthRating(checkboxValues.filter(Boolean).length);
  passwordInput.value = password;
}

// Strength Meter Setup
function addStrengthRating(checkedOptions) {
  const strengthText = form.querySelector('.js-strength-rating');
  const strengthBars = form.querySelectorAll('.bar');
  const strengthRating = {
    // Rating based on number of character types selected, unless noted below
    1: ratings[0],
    2: ratings[1],
    3: ratings[2],
    4: ratings[3],
  };
  let strengthLevel;

  // If password is less than 8 characters, strength is too weak
  if (Number(range.value) < 8) {
    strengthLevel = 1;
  } else if (Number(range.value) > 16 && checkedOptions >= 2) {
    // If password is greater than 16 characters and has at least 2 character types, strength is strong
    strengthLevel = 4;
  } else {
    strengthLevel = checkedOptions;
  }

  // Clear previous strength rating
  strengthBars.forEach((bar) =>
    bar.classList.remove(...ratings.map((rating) => rating[1])),
  );
  strengthText.textContent = '';

  // Add new strength rating
  const strengthBar = document.querySelector(
    `[data-strength=${strengthRating[strengthLevel][1]}]`,
  );
  strengthBar.classList.add(strengthRating[strengthLevel][1]);
  strengthText.textContent = strengthRating[strengthLevel][0];

  return strengthLevel;
}

// Copy to Clipboard Setup
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyMessage.classList.remove('hidden');

    // Update live region for screen readers
    ariaLiveRegion.textContent = 'Password copied';

    // Clear copy success message after 5 seconds
    setTimeout(() => {
      copyMessage.classList.add('hidden');
      ariaLiveRegion.textContent = '';
    }, 5000);
  } catch (err) {
    console.error('Failed to copy password: ', err);
  }
}

// Event Listeners
range.addEventListener('input', updateRange);
copyButton.addEventListener('click', copyToClipboard);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const error = form.querySelector('.error');

  // Validate form inputs
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

    // Update live region for screen readers
    const currentStrengthLevel = form.querySelector(
      '.js-strength-rating',
    ).textContent;
    ariaLiveRegion.textContent = `
      Your password is: ${passwordInput.value}.
      Strength: ${currentStrengthLevel}.
    `;

    // Enable copy button and send focus to it
    copyButton.disabled = false;
    copyButton.focus();
  }
});

// Reset form on page refresh
window.onload = () => {
  // Disable copy button on load
  copyButton.disabled = true;

  // Clear form inputs on load
  form.reset();

  // Reset range to zero and update display
  initializeRange();
};

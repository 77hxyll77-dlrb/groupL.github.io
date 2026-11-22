const root = document.documentElement;
const smaller = document.querySelector('#smaller');
const larger = document.querySelector('#larger');
const reset = document.querySelector('#reset');
const key = 'ads401-report-text-size';
const sizes = [85, 100, 115, 130, 150];
let size = 100;

try {
  const saved = Number(localStorage.getItem(key));
  if (sizes.includes(saved)) size = saved;
} catch { /* Storage may be disabled. */ }

function renderSize() {
  root.style.fontSize = size + '%';
  reset.textContent = size + '%';
  reset.setAttribute('aria-label', 'Text size ' + size + ' percent. Reset to 100 percent');
  smaller.disabled = size === sizes[0];
  larger.disabled = size === sizes[sizes.length - 1];
}
function changeSize(next) {
  size = next;
  renderSize();
  try { localStorage.setItem(key, String(size)); } catch { /* Optional preference. */ }
}
smaller.onclick = () => changeSize(sizes[sizes.indexOf(size) - 1]);
larger.onclick = () => changeSize(sizes[sizes.indexOf(size) + 1]);
reset.onclick = () => changeSize(100);
document.querySelector('.sizes').hidden = false;
renderSize();

const mast = document.querySelector('.mast');
const entries = Array.from(mast.querySelectorAll('nav a'), link => ({
  link,
  section: document.getElementById(link.hash.slice(1))
})).filter(entry => entry.section);
function highlight() {
  const edge = mast.offsetHeight + 28;
  let current = entries[0];
  for (const entry of entries) {
    if (entry.section.getBoundingClientRect().top <= edge) current = entry;
  }
  if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) current = entries[entries.length - 1];
  for (const entry of entries) {
    if (entry === current) entry.link.setAttribute('aria-current', 'location');
    else entry.link.removeAttribute('aria-current');
  }
}
function measureHeader() {
  root.style.setProperty('--header-height', mast.offsetHeight + 'px');
  highlight();
}
new ResizeObserver(measureHeader).observe(mast);
window.addEventListener('scroll', highlight, { passive: true });
window.addEventListener('load', () => {
  measureHeader();
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
});
measureHeader();

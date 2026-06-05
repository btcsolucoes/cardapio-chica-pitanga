const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.menu-item img, .section-hero img').forEach((img) => {
  img.loading = 'lazy';
  img.decoding = 'async';
});

function activateTab(tab) {
  tabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    const isTarget = panel.id === tab.getAttribute('aria-controls');
    panel.classList.toggle('is-active', isTarget);
    panel.hidden = !isTarget;
  });

  tab.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab));
});

const qrstackDock = document.querySelector('.tab-dock');
const qrstackCover = document.querySelector('.cover');
const qrstackPrimaryTabs = Array.from(document.querySelectorAll('.tab-dock [role="tab"]'));
const qrstackPrimaryPanels = Array.from(document.querySelectorAll('.tab-panels > [role="tabpanel"]'));
let qrstackTabScrollLock = false;

qrstackPrimaryPanels.forEach((panel) => {
  panel.hidden = false;
});

function setQrStackActiveTab(tab) {
  qrstackPrimaryTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });

  tab.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

function activateQrStackTab(tab) {
  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  setQrStackActiveTab(tab);
  if (!panel) return;

  const offset = (qrstackDock?.offsetHeight || 0) + 18;
  const top = panel.getBoundingClientRect().top + window.scrollY - offset;
  qrstackTabScrollLock = true;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? 'auto' : 'smooth'
  });
  window.setTimeout(() => {
    qrstackTabScrollLock = false;
  }, reduceMotion ? 80 : 720);
}

qrstackPrimaryTabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    activateQrStackTab(tab);
  }, true);
});

const qrstackObserver = new IntersectionObserver((entries) => {
  if (qrstackTabScrollLock) return;

  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  const tab = qrstackPrimaryTabs.find((item) => item.getAttribute('aria-controls') === visible.target.id);
  if (tab) setQrStackActiveTab(tab);
}, {
  root: null,
  rootMargin: '-42% 0px -48% 0px',
  threshold: [0, .12, .24, .36]
});

qrstackPrimaryPanels.forEach((panel) => qrstackObserver.observe(panel));

function syncQrStackDock() {
  if (!qrstackDock || !qrstackCover) return;

  document.documentElement.style.setProperty('--dock-height', `${qrstackDock.offsetHeight}px`);
  document.body.classList.toggle('nav-is-fixed', window.scrollY >= qrstackCover.offsetHeight);
}

syncQrStackDock();
window.addEventListener('scroll', syncQrStackDock, { passive: true });
window.addEventListener('resize', syncQrStackDock);

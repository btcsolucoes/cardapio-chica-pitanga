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

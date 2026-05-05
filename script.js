const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

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
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab));
});

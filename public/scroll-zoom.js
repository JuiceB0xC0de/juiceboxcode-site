(() => {
  const panels = [...document.querySelectorAll('main figure')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;

  function update() {
    queued = false;
    const center = window.innerHeight / 2;
    const hold = window.innerHeight * 0.20;
    const scales = panels.map(panel => {
      if (reduced.matches) return 1;
      const rect = panel.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      const range = Math.max(1, center + panel.offsetHeight / 2);
      const progress = 1 - Math.min(1,
        Math.max(0, distance - hold) / Math.max(1, range - hold));
      const eased = progress * progress * (3 - 2 * progress);
      return 0.82 + 0.18 * eased;
    });
    panels.forEach((panel, i) => {
      panel.style.setProperty('--scroll-scale', scales[i].toFixed(4));
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', schedule);
  reduced.addEventListener('change', schedule);
  schedule();
})();

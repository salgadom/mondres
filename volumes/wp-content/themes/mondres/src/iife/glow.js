(() => {
  function enableGlowHover(selector = '[data-glow-hover]') {
    const preset_xy = [['right', 'top'], ['center', 'top'], ['left', 'center']]
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, i) => {
      el.style.setProperty('--x', preset_xy[0][0]);
      el.style.setProperty('--y', preset_xy[0][1]);
      el.style.setProperty('--x2', `calc(${preset_xy[0][0]} - 50px)`);
      el.style.setProperty('--y2', `calc(${preset_xy[0][1]} - 50px)`);

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', (e.clientX - rect.left + 25) + 'px');
        el.style.setProperty('--y', (e.clientY - rect.top + 25) + 'px');
        el.style.setProperty('--x2', (e.clientX - rect.left - 50) + 'px');
        el.style.setProperty('--y2', (e.clientY - rect.top - 50) + 'px');
      });
    });
  }

  window.enableGlowHover = enableGlowHover;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enableGlowHover());
  } else {
    enableGlowHover();
  }
})();
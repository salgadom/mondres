export default function manageScrollMemory(key = 'lastScrollY') {
  // Save scroll position on scroll (throttled)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      localStorage.setItem(key, window.scrollY);
    }, 100);
  });

  // Restore scroll position on load
  window.addEventListener('load', () => {
    const savedY = parseInt(localStorage.getItem(key), 10);
    if (!isNaN(savedY)) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY, behavior: 'auto' });
      });
    }
  });
}
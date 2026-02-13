const statusEl = document.getElementById('site-status');

fetch('/api/status.txt')
  .then(res => res.text())
  .then(text => {
    const statusText = text.trim();

    if (statusText) {
      statusEl.textContent = statusText;
      statusEl.style.display = "block";

      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--site-status-height',
          `${statusEl.offsetHeight}px`
        );
      });

    } else {
      statusEl.style.display = "none";
      document.documentElement.style.setProperty('--site-status-height', '0px');
    }
});
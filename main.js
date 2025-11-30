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

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scrollTrackContainer");
  const files = [
    "logs/endingController.txt",
    "logs/nikoController.txt",
    "logs/nikoScript.txt",
  ];

  Promise.all(files.map(f => fetch(f).then(r => r.text())))
    .then(results => {
      results.forEach((content, index) => {
        createScrollingColumn(content, index);
      });
    })
    .catch(err => console.error("Failed to load logs:", err));

  function createScrollingColumn(text, index) {
    const track = document.createElement("div");
    track.classList.add("scroll-track");
    track.style.left = `${index * 33}%`;
    container.appendChild(track);

    text.split("\n").forEach(line => {
      const div = document.createElement("div");
      div.textContent = line;
      track.appendChild(div);
    });
  }
});

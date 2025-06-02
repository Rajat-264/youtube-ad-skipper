document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-control-panel");

  openBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("control-panel.html") });
  });
});

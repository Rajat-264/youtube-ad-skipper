chrome.storage.local.get(["history"], (result) => {
  const history = result.history || [];
  const container = document.getElementById("history");
  container.innerHTML = history
    .map(entry => `<p>${entry.type} @ ${entry.time}</p>`)
    .join('');
});

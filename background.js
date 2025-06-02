chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "mutedAd" || message.type === "skippedAd") {
    chrome.storage.local.get(["history"], (result) => {
      const history = result.history || [];
      const newEntry = {
        type: message.type,
        time: new Date().toLocaleTimeString()
      };
      if (history.length >= 10) history.shift(); 
      history.push(newEntry);
      chrome.storage.local.set({ history });
    });

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "YouTube Ad Muter",
      message: message.type === "mutedAd" ? "Ad muted" : "Ad skipped"
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'SHOW_NOTIFICATION') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'YouTube Ad Skipper',
            message: msg.message,
            priority: 2
        });
    }
});


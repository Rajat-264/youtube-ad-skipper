let adBlockEnabled = true;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        adBlockEnabled = !adBlockEnabled;
        chrome.runtime.sendMessage({ type: 'TOGGLE_ADBLOCK', enabled: adBlockEnabled });

        chrome.runtime.sendMessage({ type: 'SHOW_NOTIFICATION', message: `Ad Skipper ${adBlockEnabled ? 'Enabled' : 'Disabled'}` });
    }
});

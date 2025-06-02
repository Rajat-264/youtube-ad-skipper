
function showNotification(message) {
    chrome.runtime.sendMessage({
        type: 'SHOW_NOTIFICATION',
        message: message
    });
}

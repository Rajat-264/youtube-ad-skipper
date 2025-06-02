let isMutedByExtension = false;

function simulateMouseClick(element) {
  ['mousedown', 'mouseup', 'click'].forEach(type => {
    const event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1
    });
    element.dispatchEvent(event);
  });
}

function findSkipAdButton() {
  const possibleSelectors = [
    '.ytp-ad-skip-button-modern',  
    '.ytp-ad-skip-button',         
    'button[aria-label*="Skip"]',  
    'button[class*="skip" i]'      
  ];

  for (const selector of possibleSelectors) {
    const btns = document.querySelectorAll(selector);
    for (const btn of btns) {
      if (btn.offsetParent !== null && getComputedStyle(btn).display !== 'none') {
        return btn;
      }
    }
  }

  return [...document.querySelectorAll('button')].find(btn =>
    btn.className.includes('ytp-skip-ad-button') &&
    btn.innerText.toLowerCase().includes('skip') &&
    btn.offsetParent !== null
  );
}

function tryToSkipAd() {
  const skipBtn = findSkipAdButton();

  if (skipBtn) {
    skipBtn.style.border = '3px solid red';
    skipBtn.style.boxShadow = '0 0 10px red';
    skipBtn.style.borderRadius = '6px';

    simulateMouseClick(skipBtn);

    recordSkippedAd(); 
  }
}

function isAdPlaying() {
  return document.querySelector('.ad-showing') !== null;
}

function handleAdMute() {
  const video = document.querySelector('video');

  if (!video) return;

  if (isAdPlaying()) {
    
    if (!video.muted) {
      video.muted = true;
      isMutedByExtension = true;
    }

    
    tryToSkipAd();

    
    if (video.duration > 5 && video.currentTime < video.duration - 1) {
      video.currentTime = video.duration - 0.5;
    }

  } else if (isMutedByExtension) {
    
    video.muted = false;
    isMutedByExtension = false;
  }
}

function recordSkippedAd() {
  try {
    if (typeof chrome !== 'undefined' &&
        chrome?.storage?.local?.get &&
        typeof chrome.storage.local.get === 'function') {

      chrome.storage.local.get(['skippedAds'], (data) => {
        let skippedAds = data?.skippedAds || [];
        skippedAds.unshift(new Date().toISOString());
        if (skippedAds.length > 10) skippedAds = skippedAds.slice(0, 10);
        chrome.storage.local.set({ skippedAds });
      });

    }
  } catch (err) {
    console.warn('[YT Ad Muter] ⚠️ Failed to record skipped ad:', err.message);
  }
}

setInterval(handleAdMute, 1000);
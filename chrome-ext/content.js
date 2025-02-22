function injectExternalScript () {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('pageScript.js');
  script.id = 'mashlom-datasource-script';

  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve();
    };
    script.onerror = (error) => {
      console.error('Mashlom Data Source Manager: Script loading failed', error);
      reject(error);
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

async function initialize () {
  try {
    await injectExternalScript();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_DATA_SOURCE') {
    const handleResponse = (event) => {
      if (event.data.type === 'DATA_SOURCE_RESPONSE') {
        window.removeEventListener('message', handleResponse);
        sendResponse({ currentSource: event.data.source });
      }
    };
    window.addEventListener('message', handleResponse);
    window.postMessage({ type: 'GET_DATA_SOURCE' }, '*');
    return true;
  } else if (request.type === 'TOGGLE_DATA_SOURCE') {
    window.postMessage({
      type: 'TOGGLE_DATA_SOURCE',
      useMongoDB: request.useMongoDB
    }, '*');
    sendResponse({ success: true });
    return true;
  }
});

// Initialize on load
initialize();

// Handle SPA navigation
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initialize();
  }
});

observer.observe(document, { subtree: true, childList: true });
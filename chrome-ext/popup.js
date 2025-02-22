document.addEventListener('DOMContentLoaded', async () => {
  const currentTab = await getCurrentTab();
  const content = document.getElementById('content');

  if (!currentTab?.url) {
    content.innerHTML = `
      <div class="disabled-message">
        Extension is only enabled on Mashlom applications
      </div>
    `;
    return;
  }

  const isAllowedDomain = checkAllowedDomain(currentTab.url);

  if (!isAllowedDomain) {
    content.innerHTML = `
      <div class="disabled-message">
        Extension is only enabled on Mashlom applications
      </div>
    `;
    return;
  }

  // First, show a loading state
  content.innerHTML = `
    <h3>Data Source Manager</h3>
    <div class="toggle-container">
      <span>Loading...</span>
    </div>
  `;

  try {
    // Query the active tab for current data source with timeout
    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for response'));
      }, 1000);

      chrome.tabs.sendMessage(currentTab.id, { type: 'GET_DATA_SOURCE' }, response => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    content.innerHTML = `
    <h3>Data Source Manager</h3>
    <div class="toggle-container">
      <span class="label json-label">JSON</span>
      <label class="switch">
        <input type="checkbox" id="sourceToggle" onchange="toggleLabels(this)" ${response.currentSource === 'mongodb' ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
      <span class="label server-label ${response.currentSource === 'mongodb' ? 'active' : ''}">Server</span>
    </div>
`;

    document.getElementById('sourceToggle').addEventListener('change', (e) => {
      chrome.tabs.sendMessage(currentTab.id, {
        type: 'TOGGLE_DATA_SOURCE',
        useMongoDB: e.target.checked
      });
    });
  } catch (error) {
    console.error('Error:', error);
    content.innerHTML = `
      <h3>Data Source Manager</h3>
      <div class="toggle-container">
        <span>Error loading data source state. Please refresh the page.</span>
      </div>
    `;
  }
});

async function getCurrentTab () {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function checkAllowedDomain (url) {
  const allowedDomains = [
    'localhost:',
    'trainings.mashlom.me',
    'my.mashlom.me',
    'my-stg.mashlom.me'
  ];
  return allowedDomains.some(domain => url.includes(domain));
}
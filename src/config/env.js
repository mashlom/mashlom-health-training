const environments = {
  development: {
    APP_ENV: 'development',
    API_BASE_URL: 'http://localhost:5000'
  },
  staging: {
    APP_ENV: 'staging',
    API_BASE_URL: 'https://mashlom-stg-api-gyefcpeqa3cnejfx.westus-01.azurewebsites.net'
  },
  production: {
    APP_ENV: 'production',
    API_BASE_URL: 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net'
  }
};

const getInitialEnvironment = () => {
  // Check localStorage first
  const savedEnv = localStorage.getItem('currentEnvironment');
  if (savedEnv && environments[savedEnv]) {
    return savedEnv;
  }

  const currentUrl = window.location.href.toLowerCase();

  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    return 'development';
  }

  if (currentUrl.includes('trainings.mashlom.me')) {
    return 'production';
  }

  return 'development';
};

// Initialize current environment from localStorage or default
let currentConfig = environments[getInitialEnvironment()];

// Initialize data source from localStorage or default to 'json'
let currentDataSource = localStorage.getItem('currentDataSource') || 'json';

// Extension message handler
window.addEventListener('message', (event) => {
  if (event.data.source !== 'mashlom-dev-tools') return;

  switch (event.data.type) {
    case 'GET_ENV':
      window.postMessage({
        source: 'mashlom-app',
        type: 'ENV_STATUS',
        data: {
          current: currentConfig.APP_ENV,
          available: Object.keys(environments)
        }
      }, '*');
      break;

    case 'SET_ENV':
      const newEnv = event.data.env;
      if (environments[newEnv]) {
        currentConfig = environments[newEnv];
        localStorage.setItem('currentEnvironment', newEnv);
        console.log(`[Dev Tools] Switched to ${newEnv} environment`, currentConfig);
        window.dispatchEvent(new CustomEvent('envChanged'));

        window.postMessage({
          source: 'mashlom-app',
          type: 'ENV_CHANGED',
          data: { current: newEnv }
        }, '*');
      }
      break;

    case 'GET_DATA_SOURCE':
      window.postMessage({
        source: 'mashlom-app',
        type: 'DATA_SOURCE_STATUS',
        data: { current: currentDataSource }
      }, '*');
      break;

    case 'SET_DATA_SOURCE':
      currentDataSource = event.data.dataSource;
      localStorage.setItem('currentDataSource', currentDataSource);
      console.log(`[Dev Tools] Switched to ${currentDataSource} data source`);
      window.dispatchEvent(new CustomEvent('dataSourceChanged'));

      window.postMessage({
        source: 'mashlom-app',
        type: 'DATA_SOURCE_CHANGED',
        data: { current: currentDataSource }
      }, '*');
      break;
  }
});

// Define window methods for controlling data source
window.toggleDataSource = (useMongoDB) => {
  const newDataSource = useMongoDB ? 'mongodb' : 'json';
  localStorage.setItem('currentDataSource', newDataSource);
  currentDataSource = newDataSource;
  console.log(`Switched to ${currentDataSource} data source`);
  window.dispatchEvent(new CustomEvent('dataSourceChanged'));
};

window.getCurrentDataSource = () => currentDataSource;

// Keep legacy console methods for backward compatibility
window.setEnv = (env) => {
  if (environments[env]) {
    currentConfig = environments[env];
    localStorage.setItem('currentEnvironment', env);
    console.log(`Environment switched to: ${env}`, currentConfig);
    window.dispatchEvent(new CustomEvent('envChanged'));
    return currentConfig;
  }
  console.error(`Invalid environment: ${env}. Available environments:`, Object.keys(environments));
  return null;
};

window.getEnv = () => currentConfig;
window.listEnvs = () => Object.keys(environments);

// Export the configuration
export const getConfig = () => currentConfig;
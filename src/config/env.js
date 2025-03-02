// config.js
const environments = {
  development: {
    REACT_APP_ENV: 'development',
    REACT_APP_API_BASE_URL: 'http://localhost:5001'
  },
  staging: {
    REACT_APP_ENV: 'staging',
    REACT_APP_API_BASE_URL: 'https://mashlom-stg-api-gyefcpeqa3cnejfx.westus-01.azurewebsites.net'
  },
  production: {
    REACT_APP_ENV: 'production',
    REACT_APP_API_BASE_URL: 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net' // Add your production URL
  }
};

// Store the current environment
let currentEnvironment = null;

// Function to determine environment based on URL
const getEnvironment = () => {
  const currentUrl = window.location.href.toLowerCase();
  
  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    return environments.development;
  }
  
  if (currentUrl.includes('trainings.mashlom.me')) {
    return environments.production;
  }
  
  return environments.development; // Default to development
};

// Function to set environment manually
const setEnvironment = (env) => {
  if (environments[env]) {
    currentEnvironment = environments[env];
    console.log(`Environment switched to: ${env}`, currentEnvironment);
    return currentEnvironment;
  }
  console.error(`Invalid environment: ${env}. Available environments:`, Object.keys(environments));
  return null;
};

// Initialize environment
currentEnvironment = getEnvironment();

// Expose configuration control to console
window.setEnv = setEnvironment;
window.getEnv = () => currentEnvironment;
window.listEnvs = () => Object.keys(environments);

// Export the configuration
export const getConfig = () => currentEnvironment;
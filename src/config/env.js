// config.js
const environments = {
    development: {
      REACT_APP_ENV: 'development',
      REACT_APP_API_BASE_URL: 'http://localhost:5000'
    },
    staging: {
      REACT_APP_ENV: 'staging',
      REACT_APP_API_BASE_URL: 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net'
    }
  };
  
  // Function to determine environment based on URL
  const getEnvironment = () => {
    const currentUrl = window.location.href.toLowerCase();
    
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return environments.development;
    }
    
    if (currentUrl.includes('trainings.mashlom.me')) {
      return environments.staging;
    }
    
    // Default to development if no matches
    return environments.development;
  };
  
  // Export the configuration based on URL
  export const config = getEnvironment();
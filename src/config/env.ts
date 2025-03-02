// Type definitions for TypeScript
type DataSource = 'json' | 'mongodb';

// API URL based on environment
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_APP_ENV === 'staging'
    ? 'https://mashlom-stg-api-gyefcpeqa3cnejfx.westus-01.azurewebsites.net'
    : 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net';
};

// Data source management
let currentDataSource: DataSource =
  (localStorage.getItem('currentDataSource') as DataSource) || 'json';

// Window method declarations for TypeScript
declare global {
  interface Window {
    toggleDataSource: (useMongoDB: boolean) => void;
    getCurrentDataSource: () => DataSource;
  }
}

// Data source control methods
window.toggleDataSource = (useMongoDB: boolean) => {
  currentDataSource = useMongoDB ? 'mongodb' : 'json';
  localStorage.setItem('currentDataSource', currentDataSource);
  console.log(`Switched to ${currentDataSource} data source`);
  window.dispatchEvent(new CustomEvent('dataSourceChanged'));
};

window.getCurrentDataSource = () => currentDataSource;

// Export getCurrentDataSource for components that need it
export const getCurrentDataSource = window.getCurrentDataSource;

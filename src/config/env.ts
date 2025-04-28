// Type definitions for TypeScript
type DataSource = 'json' | 'mongodb';

// Add Vite-specific type definitions
interface ImportMetaEnv {
  VITE_APP_ENV: string;
  // Add other environment variables as needed
}

// Augment the ImportMeta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// API URL based on environment
export const getApiBaseUrl = () => {
  // Check if we're in dev mode and should use localhost
  if (import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'local') {
    return 'http://localhost:5001';
  }
  
  // Otherwise use the appropriate environment URL
  return import.meta.env.VITE_APP_ENV === 'staging'
    ? 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net'// should be stg
    : 'https://mashlom-prod-api-dwdvhvaxadbgfahv.westus-01.azurewebsites.net';
};

// Data source management
let currentDataSource: DataSource =
  (localStorage.getItem('currentDataSource') as DataSource) || 'mongodb';

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
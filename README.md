# Mashlom Health Training

Emergency Medicine Exam Preparation Questionnaire

## Development Environment

### Data Source Toggle

The application supports two data sources: JSON and MongoDB. You can toggle between them using either:

1. Chrome Extension (recommended):

   - Located in the `chrome-ext` directory
   - Install by going to `chrome://extensions/`, enabling "Developer mode", and clicking "Load unpacked"
   - Click the extension icon to toggle between JSON and MongoDB data sources

2. Browser Console:
   ```javascript
   window.toggleDataSource(true); // Switch to MongoDB
   window.toggleDataSource(false); // Switch to JSON
   window.getCurrentDataSource(); // Check current data source
   ```

## Deployment

The application uses GitHub Pages with two environments:

### Production

- Deploys automatically when changes merge to main branch
- URL: https://trainings.mashlom.me/

### Staging

- Deploys automatically on PR commits
- URL: https://trainings.mashlom.me/staging/
- Check the browser console to see:
  - Current PR number
  - Commit hash
  - Environment details

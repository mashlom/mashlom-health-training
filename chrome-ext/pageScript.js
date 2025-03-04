// Check if currentDataSource already exists in window scope to avoid redeclaration
if (!Object.prototype.hasOwnProperty.call(window, 'mashlomDataManager')) {
// Use window property instead of local variable to avoid conflict
if (!Object.prototype.hasOwnProperty.call(window, 'currentDataSource')) {
    window.currentDataSource = localStorage.getItem('currentDataSource') || 'json';
}

window.mashlomDataManager = {
    getCurrentDataSource: function () {
        try {
            if (window.getCurrentDataSource) {
                return window.getCurrentDataSource();
            }
            return window.currentDataSource;
        } catch (error) {
            console.error('Error getting data source:', error);
            return window.currentDataSource;
        }
    },

    toggleDataSource: function (useMongoDB) {
        try {
            if (window.toggleDataSource) {
                window.toggleDataSource(useMongoDB);
            } else {
                window.currentDataSource = useMongoDB ? 'mongodb' : 'json';
                localStorage.setItem('currentDataSource', window.currentDataSource);
                window.dispatchEvent(new CustomEvent('dataSourceChanged'));
            }
        } catch (error) {
            console.error('Error toggling data source:', error);
        }
    }
};

window.addEventListener('message', function (event) {
    if (event.data.type === 'GET_DATA_SOURCE') {
        const source = window.mashlomDataManager.getCurrentDataSource();
        window.postMessage({
            type: 'DATA_SOURCE_RESPONSE',
            source: source
        }, '*');
    } else if (event.data.type === 'TOGGLE_DATA_SOURCE') {
        window.mashlomDataManager.toggleDataSource(event.data.useMongoDB);
    }
});
}
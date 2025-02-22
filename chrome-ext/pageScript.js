let currentDataSource = localStorage.getItem('currentDataSource') || 'json';

window.mashlomDataManager = {
    getCurrentDataSource: function () {
        try {
            if (window.getCurrentDataSource) {
                return window.getCurrentDataSource();
            }
            return currentDataSource;
        } catch (error) {
            console.error('Error getting data source:', error);
            return currentDataSource;
        }
    },

    toggleDataSource: function (useMongoDB) {
        try {
            if (window.toggleDataSource) {
                window.toggleDataSource(useMongoDB);
            } else {
                currentDataSource = useMongoDB ? 'mongodb' : 'json';
                localStorage.setItem('currentDataSource', currentDataSource);
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
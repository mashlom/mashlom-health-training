while on the questions page you can do these commands:

// To switch to MongoDB
window.toggleDataSource(true)

// To switch to JSON
window.toggleDataSource(false)

// To check current data source
window.getCurrentDataSource()

everywhere you can change where the api eill go to using this commands:

// View current environment
window.getEnv()

// Switch environments
window.setEnv('staging')
window.setEnv('development')

// List all available environments
window.listEnvs()

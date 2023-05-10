// next.config.js

module.exports = {
    staticPageGenerationTimeout: 1500,
    webpack: config => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      return config
    }
  }
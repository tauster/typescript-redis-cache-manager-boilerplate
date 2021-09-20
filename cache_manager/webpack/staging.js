const config = require('./base'); // load base configuration

config.mode = "development";

config.optimization = {
    // We no not want to minimize our code.
    minimize: false
};

config.plugins.push(
    // Staging specific plugins
);

module.exports = config;
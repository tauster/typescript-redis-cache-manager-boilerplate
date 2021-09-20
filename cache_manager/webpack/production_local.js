const config = require('./base'); // load base configuration

config.mode = "production";

config.optimization = {
    // We want to minimize our code.
   minimize: true
};

config.plugins.push(
    // Production specific plugins
);

module.exports = config;
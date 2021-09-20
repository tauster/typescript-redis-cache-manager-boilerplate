// Webpack 3 config based on:
// http://devcanvas.org/how-to-create-a-new-typescript-project-using-webpack-3/
// Broken up into base/production/development based on
// https://github.com/CodingZeal/react-boilerplate/tree/master/webpack

/**
 * Resolves the runtime environment from NODE_ENV to decide
 * which webpack configuration to use.
 * 
 * @returns {string}
 */
function getBuildConfig() {

    // attempt to resolve the runtime environment in node's environment variables
    switch (process.env.NODE_ENV) {

        // development build
        case 'development':
            console.log('Building DEVELOPMENT bundle as NODE_ENV=development');
            process.env.CLIENT_NODE_ENV = 'development';
            return 'development';
        
        // staging build
        case 'staging':
            console.log('Building STAGING bundle as NODE_ENV=staging.');
            return 'staging';

            // production build
        case 'production':
            console.log('Building PRODUCTION bundle as NODE_ENV=production.');
            return 'production';
        
        // not specified, so set to development build
        default:
            process.env.NODE_ENV == 'development';
            console.log('NO RUNTIME ENVIRONMENT SPECIFIED. Building DEVELOPMENT bundle as NODE_ENV!=development.');
            return 'development';
    }
}

// export the webpack config based on the runtime environment
module.exports = require('./webpack/' + getBuildConfig() + '.js');
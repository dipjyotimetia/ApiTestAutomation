const { defaults } = require('jest-config');
module.exports = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'ts', 'tsx'],
    testEnvironment: "node",
};
const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../tsconfig');

module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    resetMocks: true,
    globals: {
        'ts-jest': {
            tsConfig: path.resolve(__dirname + '/tsconfig.json'),
        },
    },
    moduleDirectories: [
        'src',
        'node_modules'
    ],
    rootDir: '../',
    collectCoverageFrom: ['src/**/*.ts'],
    testMatch: ['**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' })
    }
};

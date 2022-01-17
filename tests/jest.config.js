const path = require('path');

module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    resetMocks: true,
    globals: {
        'ts-jest': {
            tsconfig: path.resolve(__dirname + '/tsconfig.json'),
        },
    },
    moduleDirectories: [
        'src',
        'node_modules',
    ],
    rootDir: '../',
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    testMatch: [
        '**/*.spec.ts',
    ],
    moduleNameMapper: {},
}


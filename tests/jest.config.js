// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    preset: 'ts-jest',

    clearMocks: true,
    errorOnDeprecated: true,
    globals: {
        'ts-jest': {
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        },
    },
    moduleDirectories: [
        'src',
        'node_modules',
    ],
    moduleNameMapper: {},
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'build/jest/',
                outputName: 'junit.xml',
                suiteNameTemplate: '{filepath}',
                classNameTemplate: '{classname}',
                titleTemplate: '{title}',
            },
        ],
    ],
    resetMocks: true,
    rootDir: '../',
    testMatch: [
        '**/*.spec.ts',
    ],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
    coverageDirectory: 'build/jest/coverage',
    coveragePathIgnorePatterns: [
        '/index\\.[jt]sx?$',
        '.+\\.d\\.ts$',
    ],
    coverageProvider: 'v8',
    coverageReporters: [
        // Supported reporters: https://istanbul.js.org/docs/advanced/alternative-reporters/
        'text',
        'html',
        'clover', // ADR-05
    ],
};

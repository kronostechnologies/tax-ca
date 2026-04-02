/* eslint-disable @typescript-eslint/no-require-imports */
const { createJestConfig } = require('@equisoft/jest-utils');

const config = {
    moduleNameMapper: {},

    rootDir: './../',
    roots: [
        '<rootDir>/src',
    ],

    collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],

    testEnvironment: 'node',

    restoreMocks: true,

    transformIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.[tj]s$': ['@swc/jest', {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
                target: 'esnext',
            },
            module: {
                type: 'commonjs',
            },
        }],
    },

};

module.exports = createJestConfig(config);
/* eslint-enable @typescript-eslint/no-var-requires */

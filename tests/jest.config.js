/* eslint-disable @typescript-eslint/no-var-requires */
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
        '^.+\\.ts?$': ['ts-jest', {
            tsconfig: './tsconfig.json',
        },
        ],
        '^.+\\.(js)$': 'babel-jest',
    },

};

module.exports = createJestConfig(config);
/* eslint-enable @typescript-eslint/no-var-requires */

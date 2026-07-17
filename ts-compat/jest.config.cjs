/* eslint-disable @typescript-eslint/no-require-imports */
// Compatibility gate #1: run the ORIGINAL jest specs, unmodified, against the built
// Kotlin/JS npm package instead of the TypeScript sources. Every relative import inside
// a spec is remapped to the built bundle (all legacy modules re-export at the package
// root, so named imports resolve); test fixtures keep resolving to their real files.
//
// Usage: yarn build && yarn jest --config=ts-compat/jest.config.cjs

const config = {
    rootDir: './../',
    roots: ['<rootDir>/src'],

    testEnvironment: 'node',
    restoreMocks: true,

    moduleNameMapper: {
        // Fixtures are test data, not package exports — resolve them to the real files.
        '^\\./fixtures/(.*)$': '<rootDir>/src/investments/tests/fixtures/$1',
        // Relative imports used by the specs/fixtures point at legacy source modules
        // whose exports all live at the package root in the Kotlin/JS build. The set is
        // enumerated (not a catch-all) because moduleNameMapper also applies inside
        // node_modules and to the bundle's own relative requires.
        ['^\\.\\.?(/\\.\\.)*/(misc|utils|math|date|collections|income-tax|old-age-security|'
            + 'canada-pension-plan|quebec-pension-plan|life-income-fund|locked-in-retirement-account|'
            + 'non-registered-savings-plan|registered-retirement-income-fund|savings-grant|income-level|'
            + 'canada-education-savings-grant|canada-learning-bond|'
            + 'british-columbia-training-and-education-savings-grant)$']:
            '<rootDir>/dist/index.js',
    },

    transformIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
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

module.exports = config;

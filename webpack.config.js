const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env = {}) => {
    const isDev = !!env.dev;
    const mode = isDev ? 'development' : 'production';

    return {
        mode: mode,

        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, './lib/'),
            libraryTarget: 'umd',
            globalObject: 'this'
        },

        resolve: {
            extensions: ['.ts', '.js', '.json'],
            plugins: [new TsconfigPathsPlugin()],
        },

        module: {
            rules: [
                { test: /\.ts$/, loader: 'awesome-typescript-loader', options: { errorsAsWarnings: !!isDev } },
            ]
        },
    };
};

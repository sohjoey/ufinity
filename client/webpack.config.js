const path = require('path');

module.exports = {
    entry: {
        app: path.join(__dirname, 'src', 'main.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    devServer: {
        inline: true,
        port: 8082,
        hot: true,
        contentBase: "./build"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/react'],
                },
            }
        ]
    }
}
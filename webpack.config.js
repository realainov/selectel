const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
	entry: './src/static/js/app/index.js',
    output: {
      filename: 'scripts.js',
      path: path.join(__dirname, 'public/js')
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public/js'),
      compress: true,
      watchContentBase: true
    },
    module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
    },
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()]
	}
};

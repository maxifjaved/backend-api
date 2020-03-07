const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: [ './public/css/index.css', './public/js/index.js' ],
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'public/dist')
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'bundle.css'
		})
	],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},
			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
			}
		]
	}
};

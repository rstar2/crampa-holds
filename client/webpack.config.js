const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// TODO: Add copy plugin to copy all needed assets ?
// TODO: Add multiple build files (multiple entries - this is not a real SPA)
// TODO: Add commons-chunk extract
// TODO: Add vendor extract

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, '../public/js'),
		publicPath: '/public/js',
		filename: 'build.js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
					},
					// other vue-loader options go here
				},
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'vue-style-loader',
			// 		'css-loader',
			// 	],
			// },
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',
					outputPath: '../images',
					publicPath: '/public/images',
				},
			},
		],
	},
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.esm.js',
		},
		extensions: ['*', '.js', '.vue', '.json'],
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true,
	},
	performance: {
		hints: false,
	},
	plugins: [new ExtractTextPlugin('../styles/build.css')],
	devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map';
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	]);
}

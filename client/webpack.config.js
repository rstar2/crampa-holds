const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		boot: './src/boot.js',
		site: './src/site/index.less',
		admin_fileupload: './src/admin/fileupload.js',
	},
	output: {
		path: path.resolve(__dirname, '../public/js'),
		publicPath: '/public/js',
		filename: 'build.[name].js',
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
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					// use style-loader in development
					fallback: 'style-loader',
					use: ['css-loader', 'less-loader'],
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
	plugins: [
		// extract CSS nad LESS into own files
		new ExtractTextPlugin({ filename: '../styles/build.[name].css' }),

		// copy custom static files
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, './static'),
				to: '../',
				ignore: ['.*'],   //ignore dot-files like .gitkeep
			},
		]),
	],
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

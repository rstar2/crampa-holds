const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const publicPathName = '/public';
const outputPath = path.resolve(__dirname, '../public');


// dynamically map site entry pages like:
// 'home': './src/site/pages/home',
// 'gallery': './src/site/pages/gallery',
const pageFiles = require('glob').sync('./src/site/pages/**/index.js');
const sitePages = pageFiles.reduce((acc, indexFile) => {
	const name = path.basename(path.dirname(indexFile));
	acc[name] = indexFile;
	return acc;
}, {});


const options = {
	entry: {
		// this is for bundling only Vue, Bootstrap and BootstrapVue
		boot: './src/boot.js',

		// this is bundle for the custom admin SPA pages
		admin: './src/admin',

		// this is the common bundle for all main/client site pages
		// mainly CSS/LESS files for the main site and also registering common  Vue components
		site: './src/site',

		// these are bundles for a specific main/client site pages
		...sitePages,
	},
	output: {
		path: path.join(outputPath, 'js'),              // path.resolve(__dirname, '../public/js'),
		publicPath: path.join(publicPathName, 'js'),   // '/public/js',
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
					outputPath: '../images',                      // this is relative to the JS webpack output file, e.g '../public/js'
					publicPath: path.join(publicPathName, 'images'),    // '/public/images',
				},
			},

			{
				test: /\.(woff|woff2|eot|ttf)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',
					outputPath: '../fonts',                      // this is relative to the JS webpack output file, e.g '../public/js'
					publicPath: path.join(publicPathName, 'images'),    // '/public/images',
				},
			},

			// Wow.js in not exporting anything - so a plugin should be used
			{
				test: require.resolve('wowjs'),
				loader: 'exports-loader?this.WOW',
				// adds the following code to the 'wowjs' source:
				//  module.exports = this.WOW;
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
		// clean the output folder
		new CleanWebpackPlugin([outputPath], { allowExternal: true, verbose: true }),


		// extract the 'boot' entry, the one containing Vue, Bootstrap and BootstrapVue as
		// it will be included in every page
		new webpack.optimize.CommonsChunkPlugin({
			name: 'boot',
			// minChunks: function (module, count) {
			//   // any required modules inside node_modules are extracted to vendor
			//   return (
			// 	module.resource &&
			// 	/\.js$/.test(module.resource) &&
			// 	module.resource.indexOf(
			// 	  path.join(__dirname, '../node_modules')
			// 	) === 0
			//   )
			// }
		}),

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

		// common Defined props
		new webpack.DefinePlugin({
		}),
	],
	devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	// mp source-map
	options.devtool = false;


	options.plugins = (options.plugins || []).concat([
		// http://vue-loader.vuejs.org/en/workflow/production.html
		// https://vuejs.org/v2/guide/deployment.html
		// Run Vue.js in production mode - less warnings and etc...

		// Note that because the plugin does a direct text replacement,
		// the value given to it must include actual quotes inside of the string itself.
		// Typically, this is done either with alternate quotes, such as '"production"',
		// or by using JSON.stringify('production').
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
			// 'process.env.NODE_ENV': JSON.stringify('production'), - the same
		}),

		// Uglify and compress
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: !!options.devtool,
			compress: {
				warnings: false,
			},
		}),

		// The LoaderOptionsPlugin is unlike other plugins in that
		// it is built for migration from webpack 1 to 2
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),

		// TODO: Fix - it needs index.html to serve it - have to find a way to integrate it with the Keystone server
		new PrerenderSPAPlugin({
			// Required - The path to the webpack-outputted app to prerender.
			staticDir: path.join(__dirname, 'dist'),

			// Optional - The path your rendered app should be output to.
			// (Defaults to staticDir.)
			outputDir: path.join(__dirname, 'public_prerendered'),

			// Required - Routes to render.
			routes: ['/', '/about', '/contact'],

			renderer: new Renderer({
				// Optional - The name of the property to add to the window object with the contents of `inject`.
				// injectProperty: '__PRERENDER_INJECTED',
				// // Optional - Any values you'd like your app to have access to via `window.injectProperty`.
				// inject: {
				//   foo: 'bar'
				// },

				headless: false,

				// Optional - Wait to render until the specified event is dispatched on the document.
				// eg, with `document.dispatchEvent(new Event('render-event'))`
				renderAfterDocumentEvent: 'render-event',

				renderAfterTime: 5000, // Wait 5 seconds.
			}),
		}),
	]);
}

module.exports = options;

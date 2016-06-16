const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pluginsConfigs = require('../pluginsConfigs');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

/**
 * Returns an array of plugins to be used in a webpack config
 * @param  {object} CONSTS an object of options
 * @param  {loader[]} loaders an array of loaders
 */
module.exports = function getPlugins(CONSTS,loaders){

	const 
		{ DEV
		, PROD
		, DEBUG
		, PATHS
		, GLOBALS
		, OUT
		, BUILD_TYPE_SERVER
		, BUILD_TYPE_CLIENT
		} = CONSTS;

	const INCLUDE_TYPESCRIPT = loaders && loaders.some(function(loader){loader.extensions.indexOf('ts')>=0})

	// Ignore CSS:
	// new webpack.IgnorePlugin(/\.(css|less|stylus|styl|scss|sass)$/)

	const GLOBS = {};
	Object.keys(GLOBALS).forEach(function(name){
		GLOBS[name] = JSON.stringify(GLOBALS[name]);
	});

	return (
		[ DEV && BUILD_TYPE_SERVER && new webpack.BannerPlugin
			( 'require("source-map-support").install();'
			, { raw: true, entryOnly: false }
			)
		, BUILD_TYPE_CLIENT && PROD && new CopyWebpackPlugin
			([
				{ from: PATHS.ASSETS
				, to:   OUT.ASSETS
				}
			])
		//, new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js')
		, new webpack.DefinePlugin(GLOBS)
		, INCLUDE_TYPESCRIPT && new ForkCheckerPlugin()
		, DEV && new webpack.optimize.OccurenceOrderPlugin()
		, DEV && new webpack.HotModuleReplacementPlugin()
		, new webpack.NoErrorsPlugin()
		, PROD && new webpack.optimize.DedupePlugin()
		, BUILD_TYPE_CLIENT && PROD && new webpack.optimize.UglifyJsPlugin(pluginsConfigs.uglify)
		, BUILD_TYPE_CLIENT && PROD && new ExtractTextPlugin(OUT.STYLES,pluginsConfigs.extractText)
		].filter(Boolean)
	);
}
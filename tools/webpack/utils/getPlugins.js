const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pluginsConfigs = require('../pluginsConfigs');

module.exports = function getPlugins(CONSTS){

	const {DEV,PROD,DEBUG,PATHS,GLOBALS,OUT,BUILD_TYPE_SERVER} = CONSTS;

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
		, PROD && new CopyWebpackPlugin
			([
				{ from: PATHS.ASSETS
				, to: OUT.IMAGES
				}
			])
		, new webpack.optimize.CommonsChunkPlugin
			('vendor', 'js/vendor.bundle.js')
		, new webpack.DefinePlugin(GLOBS)
		, DEV && new webpack.optimize.OccurenceOrderPlugin()
		, DEV && new webpack.HotModuleReplacementPlugin()
		, new webpack.NoErrorsPlugin()
		, PROD && new webpack.optimize.DedupePlugin()
		, PROD && new webpack.optimize.UglifyJsPlugin(pluginsConfigs.uglify)
		, PROD && new ExtractTextPlugin(OUT.CSS,pluginsConfigs.extractText)
		].filter(Boolean)
	);
}
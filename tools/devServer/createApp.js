const express = require('express');
const webpackHotMiddleware = require('webpack-hot-middleware');
const requestHandlerWrapper = require('./requestHandlerWrapper');

/**
 * Creates an express app that can answer to hot middleware
 * The app is augmented with a `swap` method that allows to swap
 * the main request handler for hot reloading server routes 
 * @param  {webpack compiled} compiler
 * @param  {webpack config} webpackConfig
 * @param  {string} localAssetsPath the assets path relative string ('assets')
 * @param  {string} globalAssetsPath the complete real assets path (not the assets path of the distribution, but the assets path of the source)
 */
module.exports = function createApp(compiler,webpackConfig,localAssetsPath,globalAssetsPath){

	const app = express();
	const wrappedHandler = requestHandlerWrapper();
	const pathRegex = new RegExp(`^\/${localAssetsPath.replace(/^\//,'')}`);

	app.use(function(req,res,next){
		if(pathRegex.test(req.url)){
			req.url = req.url.replace(pathRegex,'');
		}
		return next();
	});

	app.use(webpackHotMiddleware(compiler));
	

	app.use(express.static(webpackConfig.devServer.contentBase));
	app.use(express.static(globalAssetsPath));
	
	app.use(wrappedHandler);

	app.swap = wrappedHandler.swap;

	return app;

}


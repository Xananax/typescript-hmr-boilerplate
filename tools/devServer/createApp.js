const express = require('express');
const webpackHotMiddleware = require('webpack-hot-middleware');
const requestHandlerWrapper = require('./requestHandlerWrapper');


module.exports = function createApp(compiler,webpackConfig,assetsPath){

	const app = express();
	const wrappedHandler = requestHandlerWrapper();
	const pathRegex = new RegExp(`^\/${assetsPath.replace(/^\//,'')}`);

	app.use(function(req,res,next){
		if(pathRegex.test(req.url)){
			req.url = req.url.replace(pathRegex,'');
		}
		return next();
	});

	app.use(webpackHotMiddleware(compiler));
	
	app.use(express.static(webpackConfig.devServer.contentBase));

	app.use(wrappedHandler);
	app.swap = wrappedHandler.swap;

	return app;

}


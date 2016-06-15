import http from 'http';
import express from 'express';
//const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
let requestHandler = require('./server/handler').requestHandler;

interface WrappedHandler{
	(req,res,next):any;
	swap(r):this
}

function requestHandlerWrapper(requestHandler){
	const wrappedHandler:WrappedHandler = <WrappedHandler>function(req,res,next){
		return requestHandler(req,res,next);
	}
	wrappedHandler.swap = function(newRequestHandler){
		requestHandler = newRequestHandler;
		return this;
	}
	return wrappedHandler;
}

const wrappedHandler = requestHandlerWrapper(requestHandler);

const app = express();


export default function listen(compiler,webpackConfig,webpackMiddleware,cb){

	app.use(function(req,res,next){
		console.log('request:',req.url);
		return next();
	});

	//app.use(webpackMiddleware);

	app.use(webpackHotMiddleware(compiler));
	
	app.use(express.static(webpackConfig.devServer.contentBase));

	app.use(wrappedHandler);

	const server = http.createServer(app);

	server.listen(__PORT__,()=>{
		console.log(`listening on ${__URL__}`);
		cb && cb();
	});

	return server;

}

if(module.hot) {
	module.hot.accept("./server/handler",()=>{
		requestHandler = require("./server/handler").requestHandler;
		wrappedHandler.swap(requestHandler);
	});
}
import http from 'http';
import express from 'express';

let requestHandler = require('./handler').requestHandler;
let swap;

export default function listen(app,cb,devApp){

	devApp.swap(requestHandler);
	swap = devApp.swap;

	app.use(devApp);

}

if(module.hot) {
	module.hot.accept("./handler",()=>{
		requestHandler = require("./handler").requestHandler;
		swap && swap(requestHandler);
	});
}
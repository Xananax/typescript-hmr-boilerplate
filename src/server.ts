import http from 'http';
import express from 'express';

let requestHandler = require('./server/handler').requestHandler;
let swap;
const app = express();

export default function listen(devApp,cb){

	devApp.swap(requestHandler);
	swap = devApp.swap;

	app.use(devApp);

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
		swap && swap(requestHandler);
	});
}
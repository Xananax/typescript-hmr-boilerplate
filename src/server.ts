import http from 'http';
import express from 'express';

let requestHandler = __DEV__ ? 
	require('./server/server.dev').default : 
	require('./server/server.prod').default
;

const PORT = process.env.PORT || __PORT__;

export default function listen(devApp?,cb?){

	const app = express();

	requestHandler(app,cb,devApp)

	const server = http.createServer(app);

	server.listen(PORT,()=>{
		console.log(`listening on ${__URL__}`);
		cb && cb();
	});

	return server;
}
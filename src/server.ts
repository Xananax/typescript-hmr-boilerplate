import http from 'http';

let app = require('./server/handler').app;

const server = http.createServer();

server.on("request", app);

server.listen(__PORT__,()=>{
	console.log(`listening on ${__URL__}`);
});


if(module.hot) {
	module.hot.accept("./server/handler",()=>{
		server.removeListener("request", app);
		app = require("./server/handler").app;
		server.on("request", app);
	});
}
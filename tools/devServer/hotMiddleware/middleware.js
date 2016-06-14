module.exports = function hotHandler(compiler, opts) {

	opts = opts || {};
	opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
	opts.path = opts.path || '/__webpack_hmr';
	opts.heartbeat = opts.heartbeat || 10 * 1000;

	const eventStream = createEventStream(opts.heartbeat);

	function compilePlugin(){
		if(opts.log){
			opts.log("webpack building...");
		}
		eventStream.publish({action: "building"});
	}

	function donePlugin(statsResult) {

		statsResult = statsResult.toJson();

		//for multi-compiler, stats will be an object with a 'children' array of stats
		const bundles = extractBundles(statsResult);
		
		bundles.forEach(function(stats) {
			if (opts.log) {
				opts.log("webpack built " + (stats.name ? stats.name + " " : "") +
					stats.hash + " in " + stats.time + "ms");
			}
			eventStream.publish({
				name: stats.name,
				action: "built",
				time: stats.time,
				hash: stats.hash,
				warnings: stats.warnings || [],
				errors: stats.errors || [],
				modules: buildModuleMap(stats.modules)
			});
		});
	}

	compiler.plugin("compile",compilePlugin);

	compiler.plugin("done",donePlugin);

	function middleware(req, res, next) {
		if (!pathMatch(req.url, opts.path))
			{ return next(); }
		eventStream.handler(req, res);
	};
	middleware.publish = eventStream.publish;
	return middleware;

}

function pathMatch(url, path) {
	if (url == path) return true;
	var q = url.indexOf('?');
	if (q == -1) return false;
	return url.substring(0, q) == path;
}

function createEventStream(heartbeat) {

	var clientId = 0;
	var clients = {};

	function everyClient(fn) {
		Object.keys(clients).forEach(function(id) {
			fn(clients[id]);
		});
	}

	setInterval(function heartbeatTick() {
		everyClient(function(client) {
			client.write("data: \uD83D\uDC93\n\n");
		});
	}, heartbeat).unref();

	return {
		handler: function(req, res) {
			req.socket.setKeepAlive(true);
			res.writeHead(200, {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/event-stream;charset=utf-8',
				'Transfer-Encoding': 'chunked',
				'Cache-Control': 'no-cache, no-transform',
				'Connection': 'keep-alive'
			});
			res.write('\n');
			var id = clientId++;
			clients[id] = res;
			req.on("close", function(){
				delete clients[id];
			});
		},
		publish: function(payload) {
			everyClient(function(client) {
					client.write("data: " + JSON.stringify(payload) + "\n\n");
			});
		}
	};
}

function extractBundles(stats) {
	if (stats.modules) 
		{ return [stats]; }
	if (stats.children && stats.children.length)
		{ return stats.children; }
	return [stats];
}

function buildModuleMap(modules) {
	var map = {};
	modules.forEach(function(module) {
		map[module.id] = module.name;
	});
	return map;
}

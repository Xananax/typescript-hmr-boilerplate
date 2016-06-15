const webpack = require('webpack');
const path = require('path');
const getConfig = require('../webpack/utils/getConfig');
const getOptions = require('../webpack/utils/getOptions');
const webpackWatcher = require('./webpackWatcher');
const makeWatcherOptions = require('./makeWatcherOptions');
const createApp = require('./createApp');

function assign(obj1,obj2){
	return Object.assign({},obj1,obj2);
}

module.exports = function(CONSTS,cb){

	const SERVER_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'server'}));
	const CLIENT_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'client'}));

	const server_config = getConfig(SERVER_CONSTS);
	const client_config = getConfig(CLIENT_CONSTS);

	const server_compiler = webpack(server_config);
	const client_compiler = webpack(client_config);
	
	const { OUT, DIRS, SERVER_BUNDLE_NAME , CLIENT_BUNDLE_NAME } = SERVER_CONSTS;

	const root_path = path.resolve(DIRS.ROOT,DIRS.DISTRIBUTION); 
	const server_bundle_path = path.resolve(root_path, OUT.SERVER, SERVER_BUNDLE_NAME)+'.js';
	const client_bundle_path = path.resolve(root_path, OUT.CLIENT, CLIENT_BUNDLE_NAME)+'.js';

	const server_watcherOptions = makeWatcherOptions(server_config.devServer);
	const client_watcherOptions = makeWatcherOptions(client_config.devServer);

	const server_watcher = webpackWatcher('server',server_compiler,server_watcherOptions);
	const client_watcher = webpackWatcher('client',client_compiler,client_watcherOptions);
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	//const middleware = connectMiddleware(client_compiler,client_watcherOptions,client_watcher);

	const app = createApp(client_compiler,client_config,OUT.ASSETS)

	let first = true

	function once(){
		first && require(server_bundle_path).default
			( app
			, function()
				{
					console.log('first compilation succeeded');
					cb && cb();
				}
			);
		first = false;
	}

	client_watcher.watch(function(){

		console.log('client file created at',client_bundle_path);

		server_watcher.watch(function(){
			
			console.log('path',server_bundle_path);
			//const server = require(bundle_path);
			//console.log('server',server);
			once();
		});
	})

}
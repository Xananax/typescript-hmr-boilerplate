const webpack = require('webpack');
const path = require('path');
const getConfig = require('../webpack/utils/getConfig');
const getOptions = require('../webpack/utils/getOptions');
const webpackWatcher = require('./webpackWatcher');
const makeWatcherOptions = require('./makeWatcherOptions');
const createApp = require('./createApp');
const assign = require('./assign');

/**
 * Creates two compilers, one for the server and one for the client
 * Runs them, then runs the server file
 * 
 * @param  {Object} CONSTS an object of options (optional)
 * @param  {nodeback} cb a callback to run when compilation is finished (optional) 
 */
module.exports = function devServer(CONSTS,cb){

	const SERVER_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'server'}));
	const CLIENT_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'client'}));

	const server_config = getConfig(SERVER_CONSTS);
	const client_config = getConfig(CLIENT_CONSTS);

	const server_compiler = webpack(server_config);
	const client_compiler = webpack(client_config);
	
	const { OUT, DIRS, PATHS, SERVER_BUNDLE_NAME , CLIENT_BUNDLE_NAME } = SERVER_CONSTS;

	const root_path = path.resolve(DIRS.ROOT,DIRS.DISTRIBUTION); 
	const server_bundle_path = path.resolve(root_path, OUT.SERVER, SERVER_BUNDLE_NAME)+'.js';
	const client_bundle_path = path.resolve(root_path, OUT.CLIENT, CLIENT_BUNDLE_NAME)+'.js';

	const server_watcherOptions = makeWatcherOptions(server_config.devServer);
	const client_watcherOptions = makeWatcherOptions(client_config.devServer);

	const server_name = `webpack [server]`;
	const client_name = `webpack [client]`;
	const server_watcher = webpackWatcher(server_name,server_compiler,server_watcherOptions);
	const client_watcher = webpackWatcher(client_name,client_compiler,client_watcherOptions);
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	//const middleware = connectMiddleware(client_compiler,client_watcherOptions,client_watcher);

	const app = createApp(client_compiler,client_config,OUT.ASSETS,PATHS.ASSETS)

	let first = true

	function once(){
		first && require(server_bundle_path).default
			( app
			, function()
				{
					console.log(`${server_name}: first compilation succeeded`);
					cb && cb();
				}
			);
		first = false;
	}

	client_watcher.watch(function(){

		console.log(`${client_name}: client file created at \`${client_bundle_path}\``);

		server_watcher.watch(function(){
			
			console.log(`${server_name}: server path \`${server_bundle_path}\``);

			once();
		});
	})

}
const webpack = require('webpack');
const path = require('path');
const getConfig = require('../webpack/utils/getConfig');
const getOptions = require('../webpack/utils/getOptions');
const webpackWatcher = require('./webpackWatcher');
const makeWatcherOptions = require('./makeWatcherOptions');

function assign(obj1,obj2){
	return Object.assign({},obj1,obj2);
}

module.exports = function(CONSTS,cb){

	const SERVER_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'client'}));
	const CLIENT_CONSTS = getOptions(assign(CONSTS,{BUILD_TYPE:'server'}));

	const server_config = getConfig(SERVER_CONSTS);
	const client_config = getConfig(CLIENT_CONSTS);

	const webpackConfig =  
		[ server_config
		, client_config
		];

	const compiler = webpack(webpackConfig);
	
	const { OUT, DIRS, SERVER_BUNDLE_NAME , CLIENT_BUNDLE_NAME } = CLIENT_CONSTS;

	const root_path = path.resolve(DIRS.ROOT,DIRS.DISTRIBUTION); 

	const server_bundle_path = path.resolve(root_path, OUT.SERVER, SERVER_BUNDLE_NAME)+'.js';

	const client_bundle_path = path.resolve(root_path, OUT.CLIENT, CLIENT_BUNDLE_NAME)+'.js';

	const controller = webpackWatcher(compiler,makeWatcherOptions(webpackConfig.devServer));
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	controller.watch(function(){
		console.log('path',server_bundle_path);
		//const server = require(bundle_path);
		//console.log('server',server);
		require(server_bundle_path);
		cb && cb()
	});

}
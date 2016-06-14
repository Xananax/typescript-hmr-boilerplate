const webpack = require('webpack');
const path = require('path');
const getConfig = require('../webpack/utils/getConfig');
const webpackWatcher = require('./webpackWatcher');
const makeWatcherOptions = require('./makeWatcherOptions');

module.exports = function(CONSTS){

	const webpackConfig = getConfig(CONSTS);
	const compiler = webpack(webpackConfig);
	const serverBundleName = CONSTS.SERVER_BUNDLE_NAME;
	
	const { OUT, DIRS, SERVER_BUNDLE_NAME } = CONSTS;

	const bundle_path = path.resolve(
		DIRS.ROOT
	,	DIRS.DISTRIBUTION
	,	OUT.SERVER
	,	SERVER_BUNDLE_NAME
	)+'.js';

	const controller = webpackWatcher(compiler,makeWatcherOptions(webpackConfig.devServer));
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	controller.watch(function(){
		console.log('path',bundle_path);
		//const server = require(bundle_path);
		//console.log('server',server);
		require(bundle_path);
	});

}
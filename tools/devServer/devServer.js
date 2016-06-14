const webpack = require('webpack');
const path = require('path');
const getConfig = require('../webpack/utils/getConfig');
const webpackWatcher = require('./webpackWatcher');
const makeWatcherOptions = require('./makeWatcherOptions');

module.exports = function(CONSTS){

	const webpackConfig = getConfig(CONSTS);
	const compiler = webpack(webpackConfig);
	const serverBundleName = CONSTS.SERVER_BUNDLE_NAME;
	
	const bundle_path = path.resolve(
		webpackConfig.output.path
	,	webpackConfig.output.filename.replace(/\[name\]/,serverBundleName)
	);

	const controller = webpackWatcher(compiler,makeWatcherOptions(webpackConfig.devServer));
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	controller.watch(function(){
		console.log('path',bundle_path);
		const server = require(bundle_path);
		console.log('server',server);
	});

}
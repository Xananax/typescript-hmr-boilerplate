const webpack = require('webpack');
const getConfig = require('./utils/getConfig');
const path = require('path');
//const MemoryFs = require('memory-fs');


module.exports = function(CONSTS){

	const webpackConfig = getConfig(CONSTS);
	const compiler = webpack(webpackConfig);
	const serverBundleName = CONSTS.SERVER_BUNDLE_NAME;
	const bundle_path = path.resolve(
		webpackConfig.output.path
	,	webpackConfig.output.filename.replace(/\[name\]/,serverBundleName)
	);
	//const fs = new MemoryFS();
	//compiler.outputFileSystem = fs;

	console.log(webpackConfig);
	console.log('bundle_path',bundle_path);
	
	compiler.watch(
		webpackConfig.devServer.watchOptions
	,	function(err,stats){
			if(err){throw err;}
			const jsonStats = stats.toJson();
			if(jsonStats.errors.length > 0){
				jsonStats.errors.forEach(function(err){
					console.error(err);
				});
			}
			if(jsonStats.warnings.length > 0){
				jsonStats.warnings.forEach(function(err){
					console.warning(arr);
				});
			}
			console.log('----compiled')
		}
	);

}
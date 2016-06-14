const webpack = require('webpack');
const MemoryFS = require("memory-fs");

const getOptions = require('../webpack').getOptions;
const webpackConfigMaker = require('../webpack').serverDev;
const userOptions = require('../../config');
const CONSTS = getOptions(userOptions);
const fs = new MemoryFS();

const webpackConfig = webpackConfigMaker(CONSTS);

const compiler = webpack(webpackConfig);
compiler.outputFileSystem = fs;

compiler.watch(webpackConfig.devServer.watch,(err, stats)=>{
	if(err){throw err;}
	const jsonStats = stats.toJson();
	if(jsonStats.errors.length > 0){
		jsonStats.errors.forEach((err)=>console.error(err));
	}
	if(jsonStats.warnings.length > 0){
		jsonStats.warnings.forEach((err)=>console.warn(err));
	}
	console.log('compiled');
});



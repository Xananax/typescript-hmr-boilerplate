const options = require('../../config');
const getOptions = require('../webpack/utils/getOptions');
const getConfig = require('../webpack/utils/getConfig');
const webpackErrorHandler = require('../webpack/utils/webpackErrorHandler');
const webpack = require('webpack');

function compile(CONSTS,cb){
	const config = getConfig(CONSTS);
	const compiler = webpack(config);
	compiler.run(function(err, stats){

		webpackErrorHandler(err,stats,function(err){

			if(err){return cb(err);}

			if(cb){
				return cb();
			}
			console.log(` -- build: webpack compilation done`);

		})

	});
}

function buildServer(cb){
	
	console.log(`-- build: building server`);
	
	const CONSTS = getOptions({
		BUILD_TYPE:'server'
	,	ENV:'production'
	,	PROD:true
	});

	compile(CONSTS,function(err){
		console.log(`-- build: server built`);
		cb && cb(err,CONSTS);
	});
}

function buildClient(cb){
	
	console.log(`-- build: building client`);
	
	const CONSTS = getOptions({
		BUILD_TYPE:'client'
	,	ENV:'production'
	,	PROD:true
	});

	compile(CONSTS,function(err){
		console.log(`-- build: client built`);
		cb && cb(err,CONSTS);
	});
}

module.exports = function build(_,__,cb,only){
	if(only && only == 'server'){
		return buildServer(cb);
	}
	if(only && only == 'client'){
		return buildClient(cb);
	}
	return buildClient(function(){
		return buildServer(cb);
	})
} 

module.exports.help = `
 - Builds the server file in Production mode
 - Builds the client files in Production mode
 - Builds the css file
 - Copies the files in the static directory to the distribution directory
`;
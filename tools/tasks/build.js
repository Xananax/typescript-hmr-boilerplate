const options = require('../../config');
const getOptions = require('../webpack/utils/getOptions');
const getConfig = require('../webpack/utils/getConfig');
const webpack = require('webpack');

function compile(CONSTS,cb){
	const config = getConfig(CONSTS);
	const compiler = webpack(config);
	compiler.run(function(err, stats){
		if(err){
			return cb(err);
		}

		const jsonStats = stats.toJson();
		if(jsonStats.errors.length > 0){
			jsonStats.errors.forEach(function(e){
				console.error(e);
			});
			cb(new Error(`webpack has errors`));
		}
		if(jsonStats.warnings.length > 0){
			jsonStats.warnings.forEach(function(e){
				console.warning(e);
			});
		}
		if(cb){
			return cb();
		}
		console.log(`webpack compilation done`);
	});
}

function buildServer(cb){
	
	console.log(`-- build: building server`);
	
	const CONSTS = getOptions({
		BUILD_TYPE:'server'
	,	ENV:'production'
	,	PROD:true
	});

	compile(CONSTS,function(){
		console.log(`-- build: server built`);
		cb && cb();
	});
}

function buildClient(cb){
	
	console.log(`-- build: building client`);
	
	const CONSTS = getOptions({
		BUILD_TYPE:'client'
	,	ENV:'production'
	,	PROD:true
	});

	compile(CONSTS,function(){
		console.log(`-- build: client built`);
		cb && cb();
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
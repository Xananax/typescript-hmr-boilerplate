const babelConfig = require('./webpack/pluginsConfigs').babel;
require('babel-register')(babelConfig);

function parseArgs(){
	const [node_path,file_path,command,...args] = process.argv 
	const params = {};
	const _args = args.filter(function(p){
		const m = p.match(/(.*?)=(.+)/);
		if(m){
			const [,key,value] = m;
			params[key] = value;
			return false;
		}
		return true;
	});
	params.args = _args;
	run(command,params);
}

function run(command,params){
	require(`./tasks/${command}`)(params);
}

if(process.argv.length > 2){
	parseArgs();
}
const babelConfig = require('./webpack/pluginsConfigs').babel;
require('babel-register')(babelConfig);
const fs = require('fs');
const path = require('path');
const getOptions = require('./webpack/utils/getOptions');
const options = require('../config');
const CONSTS = getOptions(options);

const modules = fs.readdirSync(path.resolve(__dirname,'tasks')).map(m=>m.replace(/\.js$/,''));

const helpCommands = ['h','-h','help','--help']

function help(){
	console.log(`valid commands: \n - ${modules.join('\n - ')}`);
	process.exit(0);
}

function commandExists(command){
	return (modules.indexOf(command)>=0)
}

function parseParams(args){
	if(!args || !args.length){return null;}
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
	return params;
}

function run(command,params,next){
	if(helpCommands.indexOf(command)>=0){
		return help();
	}
	if(modules.indexOf(command)>=0){
		require(`./tasks/${command}`)(params,CONSTS,next);
	}else{
		return help();
	}
}

function parseArgs(){
	const [node_path,file_path,_command,...args] = process.argv;
	const params = parseParams(args);
	const commands = _command.split(':');
	let error = false;
	commands.forEach(function(command){
		if(!commandExists(command)){
			console.error(`\`${command}\` does not exist!\n`);
			error = true;
		}
	});
	if(error){
		help();
		return process.exit(1);
	}
	function next(err){
		if(err){throw err;}
		const command = commands.shift();
		if(!command){return;}
		console.log(` -- running: \`${command}\``)
		run(command,params,next);
	}
	next();
}

if(process.argv.length > 2){
	parseArgs();
}
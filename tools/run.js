//const babelConfig = require('./webpack/pluginsConfigs').babel;
//
const fs = require('fs');
const path = require('path');
const getOptions = require('./webpack/utils/getOptions');
const options = require('../config');
const CONSTS = getOptions(options);

const modules = fs.readdirSync(path.resolve(__dirname,'tasks')).map(m=>m.replace(/\.js$/,''));

const helpCommands = ['h','-h','help','--help']

function help(commands){
	if(commands && commands.length){
		console.log(' this command will run:...\n')
		commands.forEach(function(command){
			console.log(` -- ${command.toUpperCase()}`);
			try{
				const mod = require(`./tasks/${command}`);
				help = mod.help;
				if(!help){
					console.log(' ...does not provide help')
				}else{
					console.log(help);
				}
			}catch(e){
				console.log(`${command} does not exist`);
			}
		})
	}
	else{
	console.log(`
 -- TASK RUNNER

 use it by stringing commands like this:
 command1:command2:command3

 valid commands:
   - help
   - ${modules.join('\n   - ')}

 get help about a command or string of commands:
 help:command1:command2
`)
	}
}

function commandExists(command){
	return (modules.indexOf(command)>=0)
}

function isHelpCommand(command){
	return (helpCommands.indexOf(command)>=0);	
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
	if(isHelpCommand(command)){
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
	let isHelp = false;
	commands.forEach(function(command){
		if(isHelpCommand(command)){
			isHelp = true;
		}
		if(!isHelp && !commandExists(command)){
			console.error(`\`${command}\` does not exist!\n`);
			error = true;
		}
	});
	if(isHelp){
		help(commands.slice(1));
		return process.exit(0);
	}
	if(error){
		help();
		return process.exit(1);
	}
	function next(err){
		if(err){
			console.log(`ERROR:`)
			console.error(err.message);
			process.exit(1);
		}
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
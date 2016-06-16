const createApp = require('./createApp');
const MemoryFS = require('memory-fs');
const RealFs = require('fs');

const maybeFs = {};
const MemoryFsMethods = Object.keys(MemoryFS.prototype);

const modules = Object.keys(JSON.parse(RealFs.readFileSync('../../package.json')).dependencies);

const coreModules = {};

modules.concat(['path','http']).forEach(function(moduleName){
	coreModules[moduleName] = require(moduleName);
});

const globals = 
	{ console:console
	,	process:process
	}

module.exports = function(fs){

	MemoryFsMethods.forEach(function(name){
		const memoryFsFunc = fs[name].bind(fs);
		if(!RealFs[name]){
			maybeFs[name] = memoryFsFunc;
			return;
		}
		const realFsFunc = RealFs[name].bind(fs);
		maybeFs[name] = function(){
			const length = arguments.length
			const args = new Array(length);
			let i = 0;
			while(i < length){args[i] = arguments[i++];}
			try {
				return fs[name].apply(fs,args);
			}catch(e){}
			return RealFs[name].apply(RealFs,args);
		}
	});

	const _coreModules = Object.assign({},coreModules);
	_coreModules.fs = maybeFs;

	const sandbox = require('playpit').create(fs,_coreModules,globals);

	return sandbox;

}
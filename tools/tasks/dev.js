const compileServer = require('../devServer');

module.exports = function devServer(_,CONSTS,cb){
	console.log(`starting dev environment`);
	compileServer(null,cb);
} 

const compileServer = require('../devServer');

module.exports = function devServer(_,CONSTS,cb){
	console.log(`-- dev: starting dev environment`);
	compileServer(null,cb);
} 

module.exports.help = `
 - Builds the server file in development mode with hot reloading enabled 
 - Builds the client files in development mode with hot reloading enabled
 - Runs the dev server
`;
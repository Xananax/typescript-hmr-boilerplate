const path = require('path');
const options = require('../../config');
const getOptions = require('../webpack/utils/getOptions');

const CONSTS = getOptions(options);
const dist = CONSTS.PATHS.DISTRIBUTION;
const filename = CONSTS.SERVER_BUNDLE_NAME;
const server_path = path.join(dist,filename)+'.js';

module.exports = function(){
	console.log(' -- start: starting the server')
	require(server_path).default();
}

module.exports.help = `
 - Runs the server in the distribution directory 
   (the server must have been built, of course)
`;
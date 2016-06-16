const build = require('./build');

module.exports = function buildServer(_,__,cb){
	build(_,__,cb,'server');
}

module.exports.help = `
 - Builds the server file in production mode
`;
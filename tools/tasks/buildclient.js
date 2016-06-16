const build = require('./build');

module.exports = function buildClient(_,__,cb){
	build(_,__,cb,'client');
}

module.exports.help = `
 - Builds the client files in production mode
 - Builds the css file
 - Copies the files in the static directory
`;
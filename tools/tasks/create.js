const mkdirp = require('mkdirp');


module.exports = function create(_,CONSTS,cb){

	const dir = CONSTS.PATHS.DISTRIBUTION;

	mkdirp(dir,(err)=>{
		if(err){return  cb(err);}
		console.log(`-- create: created \`${dir}\``);
		cb();
	})
}

module.exports.help = `
 - creates the distribution directory
`;
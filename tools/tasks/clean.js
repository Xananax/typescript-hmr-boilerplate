const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const create = require('./create');

module.exports = function clean(_,CONSTS,cb){
	
	const dir = CONSTS.PATHS.DISTRIBUTION;

	rimraf(dir,(err)=>{

		if(err){return cb(err);}

		console.log(`-- clean: cleaned \`${dir}\``);

		cb();
	});
} 


module.exports.help = `
 - removes the distribution directory 
`;
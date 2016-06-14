const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getOptions = require('../webpack/utils/getOptions');
const options = require('../../config');

const CONSTS = getOptions(options);
const dir = CONSTS.PATHS.DISTRIBUTION;

rimraf(dir,(err)=>{

	if(err){throw err;}
	
	if (process.argv.indexOf("createdir") >= 0) {
		mkdirp(dir,(err)=>{
			if(err){throw err;}
		})
	}
});

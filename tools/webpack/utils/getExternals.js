const fs = require('fs');

/**
 * Creates a function used by webpack to skip dependencies
 * used in `node` context
 * @param  {string} node_modules_dir
 */
module.exports = function getExternals(node_modules_dir){

	const node_modules = fs
		.readdirSync(node_modules_dir)
		.filter((x)=>(x !== '.bin'))
	;

	return function externals(context,request,cb){
		if(node_modules.indexOf(request) !== -1){
			cb(null, 'commonjs ' + request);
			return;
		}
		cb();
	}
} 
const fs = require('fs');

/**
 * Creates a function used by webpack to skip dependencies
 * used in `node` context
 * @param  {string} node_modules_dir
 */
export default function getExternals(node_modules_dir:string){

	const node_modules = fs
		.readdirSync(node_modules_dir)
		.filter((x)=>(x !== '.bin'))
	;

	return function externals(context:string,request:string,cb:(err?,str?:string)=>void){
		if(node_modules.indexOf(request) !== -1){
			cb(null, 'commonjs ' + request);
			return;
		}
		cb();
	}
} 
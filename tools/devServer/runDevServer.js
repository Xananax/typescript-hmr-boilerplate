const createApp = require('./createApp');

module.exports = function runDevServer(server_name,client_compiler,client_config,CONSTS,server_bundle_path,fs,cb){

	let first = true

	const { OUT, SERVER_BUNDLE_NAME, PATHS, DIRS } = CONSTS;

	const app = createApp(client_compiler,client_config,OUT.ASSETS,PATHS.ASSETS);

	function once(server){
		first && server( 
			app
			, function()
				{
					console.log(`${server_name}: first compilation succeeded`);
					cb && cb();
				}
			)
		;
		first = false;
	}

	if(!fs){
		const server = require(server_bundle_path).default;
		return once(server);
	}

	
	const server_file_name = '/'+SERVER_BUNDLE_NAME+'.js';
	
	throw new Error('memory does not work yet!')

}
const webpack = require('webpack');
const getConfig = require('./utils/getConfig');
const webpackDevServer = require('webpack-dev-server');
const httpProxy = require('http-proxy');

module.exports = function addWebpack(app,CONSTS){


	const {HOT_PORT,HOSTNAME,HOT_URL} = CONSTS;

	const webpackConfig = getConfig(CONSTS);
	const proxy = httpProxy.createProxyServer();
	const compiler = webpack(webpackConfig);
	
	let bundleStart = null;
	
	// We give notice in the terminal when it starts bundling and
	// set the time it started
	compiler.plugin
		( 'compile'
		, 	()=>{
				console.log('Bundling...');
				bundleStart = Date.now();
			}
		);

	// We also give notice when it is done compiling, including the
	// time it took. Nice to have
	compiler.plugin
		( 'done'
		,	()=>{
				console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms -- listening on `'+HOT_URL+'`');
			}
		);

	const bundler = new webpackDevServer
		( compiler
		, webpackConfig.devServer
		);

	
	bundler.listen
		( HOT_PORT
		, HOSTNAME
		, 	()=>{
				console.log('Bundling project, please wait...');
			}
		);


	app.use
		( ''
		, (req, res)=>
			{ 
				proxy.web
					( req
					, res
					, { target:HOT_URL }
					);
			}
		);

	proxy.on
		( 'error'
		, (e)=>
			{ console.log('Could not connect to proxy, please try again...'); 
			}
		);

	return app;

}
const getOptions = require('./getOptions');
const getLoaders = require('./getLoaders');
const parseLoaders = require('./parseLoaders');
const getPlugins = require('./getPlugins');
const getExternals = require('./getExternals');
  

module.exports = function(CONSTS){

	const extensions = ['','.web.js','.webpack.js'];
	const rawLoaders = getLoaders(CONSTS);
	const loaders = parseLoaders(CONSTS,rawLoaders,extensions);
	const plugins = require('./getPlugins')(CONSTS);
	const vendor = 
		[ 'react'
		, 'redux'
		, 'react-redux'
		];

	const 
		{ PATHS
		, DEV
		, PROD
		, REACT
		, PORT
		, HOT_PORT
		, BUILD_TYPE_SERVER
		, BUILD_TYPE_CLIENT
		, CLIENT_BUNDLE_NAME
		, SERVER_BUNDLE_NAME
		, HOT_URL
		} = CONSTS;

	const target = BUILD_TYPE_SERVER ? 'node' : 'web'; 

	const externals = BUILD_TYPE_SERVER ? getExternals(PATHS.ROOT+'/node_modules') : null;

	const mainFile = BUILD_TYPE_SERVER ? 
		{ [SERVER_BUNDLE_NAME]:
			[ DEV && 'webpack/hot/poll?1000'
			, PATHS.SERVER_FILE
			].filter(Boolean)
		} :
		{ [CLIENT_BUNDLE_NAME]:
			[ DEV && `webpack-hot-middleware/client?path=${HOT_URL}/__webpack_hmr`,
			, PATHS.CLIENT_FILE
			].filter(Boolean)
		}

	const entry = Object.assign
		( 	mainFile
		,	REACT && 
			{ vendor }
		);

	const output = 
		{ path: PATHS.DISTRIBUTION
		, filename: 'js/[name].js'
		, publicPath: '/'
		, libraryTarget: BUILD_TYPE_SERVER ? 'commonjs2' : 'var'
		};

	const _module = Object.assign
		( {}
		, PROD && 
			{ noParse:/\.min\.js$/
			}
		, DEV &&
			{ preLoaders: 
				[
					{ test: /\.js$/
					, loader: "source-map-loader" 
					}
				]
			}
		, { loaders }
		);



	const node = 
		BUILD_TYPE_SERVER &&
		{ console: false
		, global: true
		, process: true
		, Buffer: true
		, __filename: "mock"
		, __dirname: "mock"
		, setImmediate: true
		}

	return (
		{ target
		, entry
		, externals
		, output
		, preloaders:[]
		, stats:
			{ colors: true
			, reasons: false
			}
		, resolve:
			{ extensions
			, modulesDirectories:
				[ 'node_modules'
				, 'shared'
				]
			}
		, module:_module
		, plugins
		, postcss:()=>
				[ require('autoprefixer')(
						{ browsers: [ 'last 2 versions' ]
						})
				]
		, devServer:
			{ contentBase: PATHS.PUBLIC
			, port: HOT_PORT
			, noInfo: true
			, quiet: false
			, lazy: false
			, publicPath: '/'
			, stats:
				{ colors: true
				}
			, watchOptions:{}
				/*
				{ aggregateTimeout: 300
				, poll: 1000
				}
				*/
			}
		, env : DEV && process.env.NODE_ENV
		, devtool: DEV ? 'eval' : 'source-map'
		, node
		}
	)

}


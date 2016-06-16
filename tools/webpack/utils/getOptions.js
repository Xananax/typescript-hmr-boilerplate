const path = require('path');
const DEF = require('../defaultOptions');

const p = (arr)=>arr.filter(Boolean).join('/');

/**
 * Takes a simple options object and returns a complex options object
 * The return from this function is an object of options suitable in
 * any of the wepackConfig functions
 * @param  {object} env optional options
 */
module.exports = function getOptions(env){

	env = env || DEF;

	const PROD = (env.PROD) || false;
	const DEV = !PROD;
	const ROOT = (env.ROOT_DIR || env.DIRS && env.DIRS.ROOT) || DEF.ROOT_DIR;

	const DIRS = Object.assign({},env.DIRS,
		{ ROOT 
		, SOURCES: (env.SOURCES_DIR || env.DIRS && env.DIRS.SOURCES) || DEF.SOURCES_DIR
		, DISTRIBUTION: (env.DISTRIBUTION_DIR || env.DIRS && env.DIRS.DISTRIBUTION) || DEF.DISTRIBUTION_DIR
		, ASSETS: (env.ASSETS_DIR || env.DIRS && env.DIRS.ASSETS) || DEF.ASSETS_DIR
		, PUBLIC:(env.PUBLIC_DIR || env.DIRS && env.DIRS.PUBLIC) || DEF.PUBLIC_DIR
		, CLIENT:(env.CLIENT_DIR || env.DIRS && env.DIRS.CLIENT) || DEF.CLIENT_DIR
		, SERVER:(env.SERVER_DIR || env.DIRS && env.DIRS.SERVER) || DEF.SERVER_DIR
		, STYLES:(env.STYLES_DIR || env.DIRS && env.DIRS.STYLES) || DEF.STYLES_DIR
		, CLIENT_OUTPUT: (env.CLIENT_OUTPUT_DIR || env.DIRS && env.DIRS.CLIENT_OUTPUT) || DEF.CLIENT_OUTPUT_DIR
		, SERVER_OUTPUT: (env.SERVER_OUTPUT_DIR || env.DIRS && env.DIRS.SERVER_OUTPUT) || DEF.SERVER_OUTPUT_DIR
		, ASSETS_OUTPUT: (env.ASSETS_OUTPUT_DIR || env.DIRS && env.DIRS.ASSETS_OUTPUT) || DEF.ASSETS_OUTPUT_DIR
		, STYLES_OUTPUT: (env.STYLES_OUTPUT_DIR || env.DIRS && env.DIRS.STYLES_OUTPUT) || DEF.STYLES_OUTPUT_DIR
		, FONTS_OUTPUT: (env.FONTS_OUTPUT_DIR || env.DIRS && env.DIRS.FONTS_OUTPUT) || DEF.FONTS_OUTPUT_DIR
		, IMAGES_OUTPUT: (env.IMAGES_OUTPUT_DIR || env.DIRS && env.DIRS.IMAGES_OUTPUT) || DEF.IMAGES_OUTPUT_DIR
		}
	);

	const FILES = Object.assign({},env.FILES,
		{ CLIENT: (env.CLIENT_ENTRY || env.FILES && env.FILES.CLIENT) || DEF.CLIENT_ENTRY
		, SERVER: (env.SERVER_ENTRY || env.FILES && env.FILES.SERVER) || DEF.SERVER_ENTRY
		}
	);

	const CLIENT_PATH =  (env.PATHS && env.PATHS.CLIENT) || path.resolve(ROOT,DIRS.CLIENT);
	const SERVER_PATH = (env.PATHS && env.PATHS.SERVER) || path.resolve(ROOT,DIRS.SERVER);

	const PATHS = 
		{ ROOT:(env.PATHS && env.PATHS.ROOT) || ROOT
		, SOURCES:(env.PATHS && env.PATHS.SOURCES) || path.resolve(ROOT,DIRS.SOURCES)
		, DISTRIBUTION:(env.PATHS && env.PATHS.DISTRIBUTION) || path.resolve(ROOT,DIRS.DISTRIBUTION)
		, PUBLIC:(env.PATHS && env.PATHS.PUBLIC) || path.resolve(ROOT,DIRS.DISTRIBUTION,DIRS.PUBLIC)
		, STYLES:(env.PATHS && env.PATHS.STYLES) || path.resolve(ROOT,DIRS.DISTRIBUTION,DIRS.STYLES)
		, ASSETS:(env.PATHS && env.PATHS.ASSETS) || path.resolve(ROOT,DIRS.ASSETS)
		, CLIENT:CLIENT_PATH
		, SERVER:SERVER_PATH
		, CLIENT_FILE:(env.PATHS && env.PATHS.CLIENT_FILE) || path.resolve(CLIENT_PATH,FILES.CLIENT)
		, SERVER_FILE:(env.PATHS && env.PATHS.SERVER_FILE) || path.resolve(SERVER_PATH,FILES.SERVER)
		, CLIENT_OUTPUT:(env.PATHS && env.PATHS.CLIENT_OUTPUT) || path.join(ROOT,DIRS.CLIENT_OUTPUT)
		, SERVER_OUTPUT:(env.PATHS && env.PATHS.CLIENT_OUTPUT) || path.resolve(ROOT,DIRS.CLIENT_OUTPUT)
		, ASSETS_OUTPUT:(env.PATHS && env.PATHS.CLIENT_OUTPUT) || path.resolve(ROOT,DIRS.CLIENT_OUTPUT)
		};


	const SERVER_BUNDLE_NAME = (env.SERVER_BUNDLE_NAME) || DEF.SERVER_BUNDLE_NAME;
	const STYLE_BUNDLE_NAME = (env.STYLE_BUNDLE_NAME) || DEF.STYLE_BUNDLE_NAME;
	const CLIENT_BUNDLE_NAME = (env.CLIENT_BUNDLE_NAME) || DEF.CLIENT_BUNDLE_NAME;
	const OUT = 
		{ ASSETS:p([DIRS.ASSETS_OUTPUT])
		, STYLES:p([DIRS.ASSETS_OUTPUT,DIRS.STYLES_OUTPUT,STYLE_BUNDLE_NAME+'.css'])
		, CLIENT:p([DIRS.ASSETS_OUTPUT,DIRS.CLIENT_OUTPUT])
		, FONTS:p([DIRS.ASSETS_OUTPUT,DIRS.FONTS_OUTPUT])
		, IMAGES:p([DIRS.ASSETS_OUTPUT,DIRS.IMAGES_OUTPUT])
		, SERVER:p([DIRS.SERVER_OUTPUT])
		}

	const RELATIVE = 
		{ CLIENT:'/'+p([DIRS.CLIENT_OUTPUT,CLIENT_BUNDLE_NAME+'.js'])
		, STYLE:'/'+p([DIRS.STYLES_OUTPUT,STYLE_BUNDLE_NAME+'.css'])
		, FONTS:'/'+p([DIRS.FONTS_OUTPUT])
		, IMAGES:'/'+p([DIRS.IMAGES_OUTPUT])
		}

	const BUILD_TYPE = env.BUILD_TYPE || DEF.BUILD_TYPE;
	const BUILD_TYPE_SERVER = BUILD_TYPE == 'server';
	const BUILD_TYPE_CLIENT = !BUILD_TYPE_SERVER;
	const PORT = env.PORT || DEF.PORT;
	const HOT_PORT = env.HOT_PORT || DEF.HOT_PORT;
	const HOSTNAME = (env.HOSTNAME) || DEF.HOSTNAME;
	const URL = (env.URL) || ((PORT == 80) ? `http://${HOSTNAME}` :`http://${HOSTNAME}:${PORT}`);
	const HOT_URL = (env.HOT_URL) || ((HOT_PORT == 80) ? `http://${HOSTNAME}` : `http://${HOSTNAME}:${HOT_PORT}`);
	const DEBUG =  ('DEBUG' in env) ? env.DEBUG : DEF.DEBUG;

	const ENV = (env.ENV || env.NODE_ENV) || DEF.ENV;
	const GLOBALS = 
		{ 'process.env':
			{ NODE_ENV:ENV
			}
		, __DEV__:DEV
		, __PROD__:PROD
		, __DEBUG__:DEBUG
		, __CLIENT__:BUILD_TYPE_CLIENT
		, __SERVER__:BUILD_TYPE_SERVER
		, __PORT__:PORT
		, __URL__:URL
		, __HOT_PORT__:HOT_PORT
		, __HOT_URL__:HOT_URL
		, __HOSTNAME__:HOSTNAME
		, __STYLE_FILE__:RELATIVE.STYLE
		, __JS_FILE__:RELATIVE.CLIENT
		, __FONTS_DIR__:RELATIVE.FONTS
		, __IMAGES_DIR__:RELATIVE.IMAGES
		, __STATIC_RELATIVE_DIR__:DIRS.ASSETS
		};

	const STORAGE =  (env.STORAGE) || DEF.STORAGE;

	return (
		{ DEV
		, PROD
		, BUILD_TYPE
		, BUILD_TYPE_CLIENT
		, BUILD_TYPE_SERVER
		, PORT
		, HOT_PORT
		, HOSTNAME
		, URL
		, HOT_URL
		, DEBUG
		, DIRS
		, FILES
		, PATHS
		, OUT
		, ENV
		, RELATIVE
		, STORAGE
		, STORAGE_IS_MEMORY: (STORAGE == 'memory')
		, GLOBALS
		, SERVER_BUNDLE_NAME
		, STYLE_BUNDLE_NAME
		, CLIENT_BUNDLE_NAME
		, VERSION: (env.VERSION) || DEF.VERSION
		, TITLE: (env.TITLE) || DEF.TITLE
		, LOADERS: (env.LOADERS) || DEF.LOADERS
		, LOADERS_SKIP: (env.LOADERS_SKIP) || DEF.LOADERS_SKIP
		, REACT:('REACT' in env) ? env.REACT : DEF.REACT
		}
	);

}
const ROOT_DIR = process.cwd();
const PKG = require(ROOT_DIR+'/package.json');

const DEF = 
	{ ROOT_DIR
	, PROD:              process.env.NODE_ENV == 'production'
	, DEV:               process.env.NODE_ENV != 'production'
	, ENV:               process.env.NODE_ENV
	, VERSION:           process.env.VERSION            || PKG.version
	, TITLE:             process.env.TITLE              || 'test'
	, REACT:             !!(process.env.REACT)          || true
	, PORT:              process.env.PORT               || 3000
	, HOT_PORT:          process.env.HOT_PORT           || 3000
	, HOSTNAME:          process.env.HOSTNAME           || 'localhost'
	, SOURCES_DIR:       process.env.SOURCES_DIR        || 'src'
	, ASSETS_DIR:        process.env.ASSETS_DIR         || 'static'
	, PUBLIC_DIR:        process.env.PUBLIC_DIR         || 'static'
	, DISTRIBUTION_DIR:  process.env.DISTRIBUTION_DIR   || 'dist'
	, DEBUG:             !!(process.env.DEBUG)          || false
	, CLIENT_DIR:        process.env.CLIENT_DIR         || 'src'
	, SERVER_DIR:        process.env.SERVER_DIR         || 'src'
	, CLIENT_ENTRY:      process.env.CLIENT_ENTRY       || 'client.tsx'
	, SERVER_ENTRY:      process.env.SERVER_ENTRY       || 'server.ts'
	, CLIENT_BUNDLE_NAME:process.env.CLIENT_BUNDLE_NAME || 'app'
	, SERVER_BUNDLE_NAME:process.env.SERVER_BUNDLE_NAME || 'server'
	, STYLE_BUNDLE_NAME: process.env.STYLE_BUNDLE_NAME  || 'app'
	, CLIENT_OUTPUT_DIR: process.env.CLIENT_OUTPUT_DIR  || 'js'
	, STYLES_OUTPUT_DIR:  process.env.STYLE_OUTPUT_DIR   || 'css'
	, FONTS_OUTPUT_DIR:  process.env.FONTS_OUTPUT_DIR   || 'fonts'
	, IMAGES_OUTPUT_DIR: process.env.IMAGES_OUTPUT_DIR  || 'images'
	, SERVER_OUTPUT_DIR: process.env.SERVER_OUTPUT_DIR  || ''
	, ASSETS_OUTPUT_DIR: process.env.ASSETS_OUTPUT_DIR  || 'static'
	, STYLES_DIR:        process.env.STYLES_DIR         || 'src/styles'
	, BUILD_TYPE:        process.env.BUILD_TYPE         || 'client'
	, LOADERS:           process.env.LOADERS            || 'js,ts,css,scss,stylus,less,images,fonts'
	, LOADERS_SKIP:      process.env.LOADERS_SKIP       || ''
	, STORAGE:            process.env.STORAGE           || 'disk' // used for dev server, can be 'disk' or 'memory'
	};

DEF.DIRS =
	{ ROOT:ROOT_DIR
	, SOURCES:DEF.SOURCES_DIR
	, PUBLIC:DEF.PUBLIC_DIR
	, DISTRIBUTION:DEF.DISTRIBUTION_DIR
	, ASSETS:DEF.ASSETS_DIR
	, CLIENT:DEF.CLIENT_DIR
	, STYLES:DEF.STYLES_DIR
	, SERVER:DEF.SERVER_DIR
	}
DEF.FILES =
	{ CLIENT:DEF.CLIENT_ENTRY
	, SERVER:DEF.SERVER_ENTRY
	}

module.exports = DEF;
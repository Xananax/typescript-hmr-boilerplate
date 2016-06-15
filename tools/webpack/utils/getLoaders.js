const combineLoaderLoaders = require('./combineLoaderLoaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const babelConfig = require('../pluginsConfigs').babel;

const stylesLoaders = 
	[	[ 'css-loader'
		, {sourceMap:true}
		]
	, 	[ 'postcss-loader' ]
	]


function doInclude(include,str){
	return (include && include.indexOf(str) >= 0);
}

function _doSkip(include,skip,str){
	const _doInclude = doInclude(include,str);
	if(_doInclude){return false;}
	const _doSkip = skip ? skip.indexOf(str) >= 0 : false;
	if(_doSkip){return true;}
	return false;
}

/**
 * Returns an object of loaders.
 * This object should be put through `parseLoaders` before
 * being usable in a webpack config object.
 * @param  {object} CONSTS an object of options
 */
module.exports = function getLoaders(CONSTS){
	
	const 
		{ DEV
		, PROD
		, PATHS
		, OUT
		, BUILD_TYPE_SERVER
		, BUILD_TYPE_CLIENT
		, LOADERS
		, LOADERS_SKIP
		} = CONSTS;

	const node_modules_regexp = /node_modules/;

	const include = LOADERS.split(',');
	const skip = LOADERS_SKIP.split(',');
	const doSkip = _doSkip.bind(null,include,skip);

	const sassLoader = 
		[ 'sass-loader'
		, { outputStyle: PROD ? 'compressed':'expanded'}
		];

	return (
		{ 'js':
			{ extensions:[ 'js', 'jsx' ]
			, loader:
				[	DEV && BUILD_TYPE_CLIENT && [ 'react-hot' ]
				,	[ 'babel', babelConfig ]
				]
			, include: PATHS.CLIENT
			, exclude: node_modules_regexp
			, skip: doSkip('js') || doSkip('javascript') || doSkip('scripts')
			}
		, 'ts':
			{ extensions:[ 'ts', 'tsx' ]
			, loader:
				[	DEV && BUILD_TYPE_CLIENT && [ 'react-hot' ]
				//,	[ 'babel', babelConfig ]
				,	[ 'awesome-typescript-loader'
					,	{ library:"es6"
						, doTypeCheck:true
						, forkChecker:true
						, useBabel:true
						, babelOptions:babelConfig
						, useCache:true
						}
					]
				]
			, include: PATHS.CLIENT
			, exclude: node_modules_regexp
			, skip: doSkip('ts') || doSkip('typescript')  || doSkip('scripts')
			}
		, 'scss':
			{ extensions:[ 'scss' , 'sass' ]
			, loader: BUILD_TYPE_SERVER ?
				'ignore-loader' : 
				DEV ?
					[ 'style-loader'
					, ...stylesLoaders
					, sassLoader
					] :
					ExtractTextPlugin.extract('style-loader',combineLoaderLoaders([...stylesLoaders,sassLoader]))
			, skip:doSkip('scss') || doSkip('styles')
			}
		, 'styl':
			{ extensions:[ 'styl' , 'stylus' ]
			, loader: BUILD_TYPE_SERVER ?
				'ignore-loader' : 
				DEV ?
					[ 'style-loader'
					, ...stylesLoaders
					, 'stylus-loader'
					] :
					ExtractTextPlugin.extract('style-loader',combineLoaderLoaders([...stylesLoaders,'stylus-loader']))
			, skip:doSkip('stylus') || doSkip('styl') || doSkip('styles')
			}
		, 'less':
			{ extensions:[ 'less' ]
			, loader: BUILD_TYPE_SERVER ?
				'ignore-loader' : 
				DEV ?
					[ 'style-loader'
					, ...stylesLoaders
					, 'less-loader'
					] :
					ExtractTextPlugin.extract('style-loader',combineLoaderLoaders([...stylesLoaders,'less-loader']))
			, skip: doSkip('less') || doSkip('styles')
			}
		, 'css':
			{ extensions:[ 'css' ]
			, loader: BUILD_TYPE_SERVER ?
				'ignore-loader' : 
				DEV ? 
					[ 'style-loader'
					, ...stylesLoaders
					] :
					ExtractTextPlugin.extract('style-loader',combineLoaderLoaders([...stylesLoaders]))
			, skip: doSkip('css') || doSkip('styles')
			}
		, 'images':
			{ extensions:['png','jpg','jpeg','gif','svg']
			, loader: 
				[ 
					[ 'url-loader'
					,	{ limit:8192
						, name:`${OUT.IMAGES}/[name].[ext]?[hash]` 
						}
					]
				]
			, skip: doSkip('images') || doSkip('assets')
			}
		, 'fonts':
			{ extensions:['woff','woff2','ttf']
			, loader: 
				[ 
					[ 'url-loader'
					,	{ limit:8192
						, name:`${OUT.FONTS}/[name].[ext]?[hash]` 
						}
					]
				]
			, skip: doSkip('fonts') || doSkip('assets')
			}
	});
}
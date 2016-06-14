const combineLoaderLoaders = require('./combineLoaderLoaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const babelConfig = require('../pluginsConfigs').babel;

const stylesLoaders = 
	[	[ 'css-loader'
		, {sourceMap:true}
		]
	, 	[ 'postcss-loader' ]
	]


module.exports = function(CONSTS){
	
	const {DEV,PROD,PATHS,OUT,BUILD_TYPE_SERVER} = CONSTS;
	const node_modules_regexp = /node_modules/;

	const sassLoader = 
		[ 'sass-loader'
		, { outputStyle: PROD ? 'compressed':'expanded'}
		];

	return (
		{ 'js':
			{ extensions:[ 'js', 'jsx' ]
			, loader:
				[	DEV && [ 'react-hot' ]
				,	[ 'babel', babelConfig ]
				]
			, include: PATHS.CLIENT
			, exclude: node_modules_regexp
			}
		, 'ts':
			{ extensions:[ 'ts', 'tsx' ]
			, loader:
				[	DEV && [ 'react-hot' ]
				,	[ 'babel', babelConfig ]
				,	'ts-loader'
				]
			, include: PATHS.CLIENT
			, exclude: node_modules_regexp
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
			}
	});
}
const ExtractTextPlugin = require('extract-text-webpack-plugin');
import Loader from './Loader';
import combineLoaders from './combineLoaders';

const stylesLoaders = 
	[	[ 'css-loader'
		, {sourceMap:true}
		]
	, 	[ 'postcss-loader' ]
	]

export default function StyleLoader
	( name:string
	, extensions:string[]
	, specificStyleLoader:string|any[]
	, o:WPACK_OPTS.Loader
	)
	{ 

		const isDev = !o.isProd;

		const loadersArray = 
			[  isDev && 'style-loader'
			, ...stylesLoaders
			, specificStyleLoader
			].filter(Boolean);

		const loaders = o.isServer ? 
			'ignore-loader' :
			isDev ? 
				loadersArray : 
				ExtractTextPlugin.extract('style-loader',combineLoaders(loadersArray)) 

		return Loader(name,'style',extensions,loaders,o);
	}
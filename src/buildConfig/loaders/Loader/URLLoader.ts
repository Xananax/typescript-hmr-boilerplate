import Loader from './Loader';

const defaults = 
	{ outputContext:''
	, limit:8192
	}

export default function URLLoader	
	( name:string
	, extensions:string[]
	, o:WPACK_OPTS.Loader
	, opts:WPACK_OPTS.URLLoader
	){

		const limit = opts.limit || defaults.limit;
		const exportPath = opts.outputContext || defaults.outputContext;

		const loaders = [
			[ 'url-loader'
			,	{ limit
				, name:`${exportPath}/[name].[ext]?[hash]` 
				}
			]
		];

		return Loader(name,'url',extensions,loaders,o)

	}
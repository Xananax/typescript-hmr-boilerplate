const preLoaders = 
	[
		{ test: /\.js$/
		, loader: "source-map-loader" 
		}
	] 

export default function modules(config:WPACK_OPTS.Modules,loaders:WPACK_INTERNAL.Loader[]):any{

	const isProd = config.isProd;
	const isDev = !isProd;

	if(isDev){
		return (
			{ noParse:/\.min\.js$/
			, loaders
			}
		)
	}else{
		return (
			{ preLoaders
			, loaders
			}
		)
	}

}
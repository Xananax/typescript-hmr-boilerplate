
export default function buildEntry(o:WPACK_OPTS.Entry){

	const isProd = o.isProd;
	const isDev = !isProd;
	const isServer = o.isServer;
	const isClient = !isServer;
	const react = !!o.react;
	const bundleName = o.bundleName;
	const source = o.sourceFile;

	const includeHot = isDev;
	const hot = isServer ? 
		'webpack/hot/poll?1000':  
		`webpack-hot-middleware/client?path=${o.hot_url}/__webpack_hmr`
	;

	const vendor = react &&
		{ vendor:
			[ 'react'
			, 'redux'
			, 'react-redux'
			, ...o.vendor
			].filter(Boolean)
		}

	const mainFile = 
		{ [bundleName]:
			[ hot 
			, source
			].filter(Boolean)
		}

	return Object.assign(mainFile,vendor);
}
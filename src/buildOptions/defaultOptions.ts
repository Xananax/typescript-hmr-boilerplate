
const calling_dir = process.cwd();

const defaultOpts = 
	{ hostname:'hostname'
	, hot_port:80080
	, isProd:false
	, isServer:false
	, outputContext:calling_dir
	, sources:'src'
	, storage:'disk'
	, devtool:'source-map'
	, debug:false
	, react:true
	, loaders:'*'
	, outputPath:'js'
	, stylesDestination:'css'
	, bundleName:'bundle'
	, sourceFile:'index.js'
	, copy_from:''
	, copy_to:''
	}


export default defaultOpts;
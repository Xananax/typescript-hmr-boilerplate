import extend from 'extend';

const defaults = 
	{ noInfo: true
	, quiet: false
	, lazy: false
	, publicPath: '/'
	, hot:
		{ overlay: false
		, reload: false
		}
	, stats:
		{ colors: true
		}
	, watchOptions:
		{ 
		/*
			aggregateTimeout: 300
		, poll: 1000
		*/
		}
	}

export default function buildDevServer(contentBase:string,port:number,conf:any){
	return extend
		( true
		, { contentBase, port }
		, conf
		)
}
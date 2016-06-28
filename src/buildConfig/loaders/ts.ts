import {CodeLoader} from './Loader';
import babelConfig from './Loader/babel';

const ts = function ts
	( o:WPACK_OPTS.Loader
	, opts:WPACK_OPTS.CodeLoader
	)
	{

		const loaders = 
			[ 'awesome-typescript-loader'
			,	{ library:"es6"
				, doTypeCheck:true
				, forkChecker:true
				, useBabel:true
				, babelOptions:babelConfig(opts.babel)
				, useCache:true
				}
			];
		return CodeLoader('ts',['ts','tsx','web.ts','web.tsx'],loaders,o,opts)
	} as WPACK_INTERNAL.CodeLoaderGenerator;

ts.type = 'code';
export default ts;
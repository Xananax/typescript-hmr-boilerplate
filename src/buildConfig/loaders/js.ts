import {CodeLoader} from './Loader';
import babelConfig from './Loader/babel';

const js = function js
	( o:WPACK_OPTS.Loader
	, opts:WPACK_OPTS.CodeLoader
	)
	{
		const loaders = 
			[ 'babel', babelConfig(opts.babel) ]
			
		return CodeLoader('js',['js','jsx','web.js','web.jsx'],loaders,o,opts)
	} as WPACK_INTERNAL.CodeLoaderGenerator;

js.type = 'code';
export default js;
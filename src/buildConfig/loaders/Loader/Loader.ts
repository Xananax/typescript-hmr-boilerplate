import makeExtensions from './extensions';
import extsToRegExp from './extsToRegExp';
import combineLoaders from './combineLoaders';

const nodeModulesRegexp = /node_modules/;

export default function Loader
	( name:string
	, type:WPACK_OPTS.LOADER_TYPE
	, extensions:string|string[]
	, loaders:string|Array<any[]|string>
	, o:WPACK_OPTS.Loader
	):WPACK_INTERNAL.Loader
	{

		const exts = makeExtensions(extensions);
		const test = extsToRegExp(exts);
		const include = o.isExternal ? nodeModulesRegexp : o.sources;
		const exclude = o.isExternal ? o.sources : nodeModulesRegexp;
		const loader = combineLoaders(loaders);

		return (
			{ name
			, test
			, type
			, extensions:exts
			, loader
			, include
			, exclude
			}
		);

	}
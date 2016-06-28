import buildModules from './modules';
import buildPlugins from './plugins';
import buildLoaders from './loaders';
import buildEntry from './entry';
import buildOutput from './output';
import buildStats from './stats';
import buildExternals from './utils/externals';
import buildPostcss from './postcss';
import buildDevServer from './devServer';
import buildNode from './node';
import buildResolve from './resolve';


export function buildConfig
	( opts:WPACK_OPTS.Config
	, modulesOpts:WPACK_OPTS.Modules
	, pluginsOpts:WPACK_OPTS.Plugins
	, entryOpts:WPACK_OPTS.Entry
	, outputOpts:WPACK_OPTS.Output
	):any
	{

		const isProd = !!opts.isProd;
		const isDev = !isProd;
		const isServer = !!opts.isServer;
		const isClient = !isServer;
		const outputContext = opts.outputContext;

		const isDevServer = isDev;

		const loaders = buildLoaders(modulesOpts);

		const extensions = loaders.reduce((arr:string[],loader)=>arr.concat(loader.extensions),[])
		const types = loaders.map(loader=>loader.type);

		const modules = buildModules(modulesOpts,loaders);
		const plugins = buildPlugins(pluginsOpts,extensions);
		const entry = buildEntry(entryOpts);
		const output = buildOutput(outputOpts);
		const resolve = buildResolve(extensions);
		const stats = buildStats();
		const devServer = isDevServer && buildDevServer(opts.contentBase,opts.hot_port,opts.devServer); 
		const env = isProd ? 'production' : 'development';
		const devtool = opts.devtool || 'source-map';
		const postcss = buildPostcss(types);
		const debug = opts.debug;

		if(isServer){
			const externals = buildExternals(`${outputContext}/node_modules`);
			const node = buildNode();

			return (
				{ target:'node'
				, entry
				, externals
				, output
				, stats
				, resolve
				, module:modules
				, plugins
				, postcss
				, devServer
				, env
				, devtool
				, node
				, debug
				}
			)
		}

		return (
			{ target:'web'
			, entry
			, output
			, stats
			, resolve
			, module:modules
			, plugins
			, postcss
			, devServer
			, env
			, devtool
			, debug
			}
		);
	}

export default function config(opts:WPACK_OPTS.GlobalConfig){
	return buildConfig(opts,opts,opts,opts,opts);
} 
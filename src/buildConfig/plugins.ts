const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
import webpack from 'webpack';
import buildGlobs from './utils/buildGlobs';
import extend from 'extend';

const uglifyDefaults = 
	{ compress:
		{ warnings:false
		, unused:true
		, dead_code:true 
		}
	, output:
		{ comments:true
		}
	};

const extractTextDefaults = {allChunks:true}

export default function getPlugins(o:WPACK_OPTS.Plugins,extensions:string[]){

	const isProd = !!o.isProd;
	const isDev = !isProd;
	const isServer = !!o.isServer;
	const isClient = !o.isServer;
	const isDevServer = isClient && isDev;

	const USES_TYPESCRIPT = extensions.indexOf('ts')>=0;
	
	const doCopyFiles = isClient && isProd && ( o.copyFiles && o.copyFiles.from && o.copyFiles.to );

	const copyConfig = doCopyFiles &&
		{ from: o.copyFiles.from
		, to:   o.copyFiles.to
		}; 

	const doCompileStyles = isClient && isProd && ('stylesDestination' in o);

	const GLOBS = buildGlobs(o);

	return (
		[ new webpack.DefinePlugin(GLOBS)
		, isProd && 
			new webpack.optimize.DedupePlugin()
		, isProd && 
			new webpack.optimize.OccurenceOrderPlugin(true)
		
		, isDevServer && 
			new webpack.NoErrorsPlugin()
		, isDevServer && 
			new webpack.HotModuleReplacementPlugin()

		, isServer && isDev && 
			new webpack.BannerPlugin
				( 'require("source-map-support").install();'
				, { raw: true, entryOnly: false }
				)
		, isClient && isProd && 
			new webpack.optimize.UglifyJsPlugin(extend(true,{},uglifyDefaults,o.uglify))
		, doCompileStyles &&
			new ExtractTextPlugin(o.stylesDestination,extend(true,{},extractTextDefaults,o.extractText))
		, doCopyFiles && 
			new CopyWebpackPlugin
				([ copyConfig ])
		, USES_TYPESCRIPT && 
			new ForkCheckerPlugin()
		].filter(Boolean)
	);
	
}

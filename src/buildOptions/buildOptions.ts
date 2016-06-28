import path from 'path';
import extend from 'extend';
import stringToArr from '../utils/stringToArr';
import defaultOptions from './defaultOptions';

export function readLoaders
	( opts:WPACK.Options
	)
	{
		const loaders = opts.loaders;
		return stringToArr(loaders);
	}

export function readVendors
	( opts:WPACK.Options
	)
	{
		const vendors = opts.vendors
		return stringToArr(vendors);
	}

export function readCopyFiles
	( opts:WPACK.Options
	)
	{
		const {copy_from,copy_to} = opts;
		if(!copy_from || !copy_to){return;}
		return (
			{ from:copy_from
			, to:copy_to
			}
		);
	}

export function readURLLoader
	( name:string
	, opts:WPACK.Options
	):any
	{
		const limit = opts[`${name}_limit`]
		const outputContext = opts[`${name}_output`];
		if(!limit && !outputContext){return;}
		if(limit && outputContext){
			return {limit,outputContext};
		}
		if(limit){
			return {limit};
		}
		return {outputContext}
	}

export default function buildConfig
	( opts:WPACK.Options
	):WPACK_OPTS.GlobalConfig
	{

		opts = extend(true,{},defaultOptions,opts);

		const 
			{ hostname
			, hot_port
			, isProd
			, isServer
			, outputContext
			, sources
			, storage
			, devtool
			, debug
			, react
			, outputPath
			, stylesDestination
			, bundleName
			, sourceFile
			, copy_from
			, copy_to
			} = opts;

		const isDev = !isProd;
		const loaders = readLoaders(opts);
		const vendor = readVendors(opts);
		const copyFiles = readCopyFiles(opts);
		const hot_url = `http://${hostname}${hot_port==80?'':':'+hot_port}`;

		return ( 
			{ isProd
			, isServer
			, outputContext
			, contentBase:'/'
			, hot_port
			, devServer:{}
			, devtool
			, debug
			, loaders
			, react
			, sources
			, storage
			, outputPath
			, hot_url
			, bundleName:bundleName.replace(/\.js$/,'')
			, sourceFile
			, vendor
			, globals:
				{ debug:isDev
				, hostname
				}
			, copyFiles
			, stylesDestination
			, uglify:{}
			, extractText:{}
			, images:readURLLoader('images',opts)
			, fonts:readURLLoader('fonts',opts)
			, url:readURLLoader('url',opts)
			}
		);

	}
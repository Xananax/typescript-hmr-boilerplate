declare var __DEV__:boolean;
declare var __CLIENT__:boolean;
declare var __PROD__:boolean;
declare var __SERVER__:boolean;
declare var __DEBUG__:boolean;
declare var __PORT__:number;
declare var __URL__:string;
declare var __HOT_PORT__:number;
declare var __HOT_URL__:string;
declare var __HOSTNAME__:string;
declare var __STYLE_FILE__:string;
declare var __CLIENT_FILE__:string;
declare var __FONTS_DIR__:string;
declare var __IMAGES_DIR__:string;
declare var __STATIC_RELATIVE_DIR__:string;

declare namespace WPACK{

	interface Options{
		hostname:string;
		hot_port:number;
		isProd:boolean;
		isServer:boolean;
		outputContext:string;
		sources:string;
		storage:'disk'|'memory';
		devtool:'source-map'|'eval';
		debug:boolean;
		react:boolean;
		loaders:string|string[];
		outputPath:string;
		stylesDestination:string;
		bundleName:string;
		sourceFile:string;
		copy_from:string;
		copy_to:string;
		images_output?:string;
		images_limit?:number;
		fonts_output?:string;
		fonts_limit?:number;
		url_output?:string;
		url_limit?:number;
		vendors:string|string[];
	}

	interface ENV{
		HOT_PORT:number;
		HOSTNAME:string;
		SERVER:string;
		DIR_OUT:string;
		DIR_SRC:string;
		STORAGE:string;
		DEVTOOL:string;
		DEBUG:boolean;
		REACT:boolean;
		LOADERS:string|string[];
		DESTINATION:string;
		STYLES:string;
		BUNDLE:string;
		SOURCE:string;
		COPY_FROM:string;
		COPY_TO:string;
		VENDORS:string|string[];
		IMAGES_OUT:string;
		IMAGES_LIMIT:string;
		FONTS_OUT:string;
		FONTS_LIMIT:string;
		URL_OUT:string;
		URL_LIMIT:string;
	}

}

declare namespace WPACK_OPTS{

	type GlobalConfig = Config & Modules & Output & Entry & Plugins
	type DEVTOOL_TYPE =  'source-map'|'eval'
	type STORAGE_TYPE = 'disk'|'memory'

	interface Config{
		isProd:boolean;
		isServer:boolean;
		outputContext:string; //full path to root context; usually __dirname
		contentBase:string//passed to devServer
		hot_port:number; //
		devServer?:any; // additional options to pass to the dev server
		devtool:DEVTOOL_TYPE
		debug:boolean; //switches loaders to debug mode
	}


	interface GlobalLoaderConfig{
		isProd:boolean; //true if the bundle is a production bundle
		isServer:boolean; //true if the bundle is intended for server usage
		react:boolean; // true if using react
		sources:string|string[]; // directory for all the sources
	}

	interface Modules extends GlobalLoaderConfig{
		isProd:boolean; // true if building a production bundle
		loaders:string[]; //array of loaders that are wanted, e.g. ['js','css']
		code?:CodeLoader; //
		url?:URLLoader; //
		//js?:CodeLoader; //
		//ts?:CodeLoader; //
		images?:URLLoader; //
		fonts?:URLLoader; //
	}

	interface Loader extends GlobalLoaderConfig{
		isExternal?:boolean; //if true, the loader will *not* ignore node_modules
	}

	interface Output{
		isServer:boolean; // true if the bundle is a server bundle 
		storage:STORAGE_TYPE //memory doesn't work yet
		outputContext:string; //the distribution directory, full path, e.g, __dirname+'/dist'
		outputPath:string; //the sub-directory where files are output, e.g, 'js/'
		hot_url:string; // localhost:8080
	}

	interface Entry{
		isProd:boolean; // true if development mode
		isServer:boolean; //true if building a server bundle
		react:boolean; // true if using react
		bundleName:string; //name of the generated bundle, without the extension
		sourceFile	:string; //name of the entry file, relative to `sources`
		hot_url:string; // http://localhost:8080
		vendor:string[]; // an optional array of files to add to the `vendor` bundle 
	}

	interface Plugins{
		isProd:boolean; // true if production bundle
		isServer:boolean; // true if server bundle
		globals:{ // global variables to use in your files
			debug:boolean;
			hostname:string;
		}
		copyFiles?:{
			from:string;
			to:string;
		}
		stylesDestination:string; // name of the css bundle, relative to the outputContext
		uglify:Uglify
		extractText?:{
			allChunks?:boolean;
		}
	}

	interface CodeLoader{
		babel:any; // optional babel configuration
	}

	interface URLLoader{
		outputContext?:string; // path for exported assets
		limit?:number //maximal number of bytes
	}

	interface Uglify{
		compress?:{ 
			warnings?:boolean;
			unused?:boolean;
			dead_code?:boolean 
		};
		output?:{ 
			comments?: boolean;
			code?:string;
			map?:string;
		};
	}

	type LOADER_TYPE = 'code'|'style'|'url'
}

declare namespace WPACK_INTERNAL{

	interface LoaderGenerator<T,O>{
		(options:WPACK_OPTS.Loader,additionalOptions?:O):Loader
		type:WPACK_OPTS.LOADER_TYPE;
	}
	
	interface URLLoaderGenerator extends LoaderGenerator<'url',WPACK_OPTS.URLLoader>{}

	interface StyleLoaderGenerator extends LoaderGenerator<'style',void>{}

	interface CodeLoaderGenerator extends LoaderGenerator<'code',WPACK_OPTS.CodeLoader>{}


	interface Loader{
		name:string;
		test:RegExp;
		type:WPACK_OPTS.LOADER_TYPE;
		extensions:string[]
		loader:string;
		include:RegExp|string|Array<RegExp|String>;
		exclude:RegExp|string|Array<RegExp|String>;
	}
}

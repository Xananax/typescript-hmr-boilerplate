const calling_dir = process.cwd();

function defaultProvider(containers:Array<any>){
	const {length} = containers;
	return function def<T>(prop:string,defaultValue:T):T{
		let i = 0;
		while(i < length){
			const curr = containers[i++];
			if(curr == null){continue;}
			if(prop in curr){
				return curr[prop];
			}
		}
		return defaultValue;
	}
}

export default function setFlags
	( O:WPACK.ENV
	):WPACK.Options
	{

		const env = process.env;
		const def = defaultProvider([O,env]);
		const NODE_ENV = def('NODE_ENV','development');
		const isProd = NODE_ENV == 'production';
		const isDev = !isProd;

		return (
			{ isProd
			, hot_port:          def('HOT_PORT',8080)
			, hostname:          def('HOSTNAME','0.0.0.0')
			, isServer:          def('SERVER',false)
			, outputContext:     def('DIR_OUT','')
			, sources:           def('DIR_SRC','src')
			, storage:         ( def('STORAGE','disk') as WPACK_OPTS.STORAGE_TYPE )
			, devtool:         ( def('DEVTOOL','source-map') as WPACK_OPTS.DEVTOOL_TYPE )
			, debug:             def('DEBUG',false)
			, react:             def('REACT',true)
			, loaders:           def('LOADERS','*')
			, outputPath:        def('DESTINATION','dist')
			, stylesDestination: def('STYLES','styles')
			, bundleName:        def('BUNDLE','bundle')
			, sourceFile:        def('SOURCE','index.js')
			, copy_from:         def('COPY_FROM','')
			, copy_to:           def('COPY_TO','')
			, vendors:           def('VENDORS',[])
			, images_output:     def('IMAGES_OUT','')
			, images_limit:      def('IMAGES_LIMIT',0)
			, fonts_output:      def('FONTS_OUT','')
			, fonts_limit:       def('FONTS_LIMIT',0)
			, url_output:        def('URL_OUT','')
			, url_limit:         def('URL_LIMIT',0)
			}
		)

	}


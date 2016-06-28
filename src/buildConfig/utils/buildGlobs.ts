export default function buildGlobs(o:WPACK_OPTS.Plugins){

	const isProd = !!o.isProd;
	const isDev = !isProd;
	const isServer = !!o.isServer;
	const isClient = !o.isServer;
	const isDevServer = isClient && isDev;
	const ENV = isProd ? 'production' : 'development';

	const GLOBS = {
		'process.env.NODE_ENV':JSON.stringify(ENV)
	};

	[ [ 'DEV',      isDev ]
	, [ 'CLIENT',   isClient ]
	, [ 'SERVER',   isServer ]
	, [ 'PROD',     isProd ]
	, [ 'DEBUG',    o.globals.debug ]
	, [ 'HOSTNAME', o.globals.hostname ]
	, [ 'ENV',      ENV ]
	].forEach(function([name,value]){
		GLOBS[`__${name}__`] = JSON.stringify(value);
	})

	return GLOBS;
}
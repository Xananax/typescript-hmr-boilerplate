import {URLLoader} from './Loader';

const fonts = function fonts	
	( o:WPACK_OPTS.Loader
	, opts:WPACK_OPTS.URLLoader
	){

		return URLLoader('fonts',['woff','woff2','ttf'],o,opts)

	} as WPACK_INTERNAL.URLLoaderGenerator;

fonts.type = 'url';

export default fonts;
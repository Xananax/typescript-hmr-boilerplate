import {URLLoader} from './Loader';

const images = function images	
	( o:WPACK_OPTS.Loader
	, opts:WPACK_OPTS.URLLoader
	){

		return URLLoader('images',['png','jpg','jpeg','gif','svg'],o,opts)

	} as WPACK_INTERNAL.URLLoaderGenerator;

images.type = 'url';

export default images;
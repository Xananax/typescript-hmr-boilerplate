import {StyleLoader} from './Loader';

const styl = function styl
	( o:WPACK_OPTS.Loader
	):WPACK_INTERNAL.Loader
	{

		return StyleLoader('styl',['styl','stylus'],'stylus-loader',o);

	} as WPACK_INTERNAL.StyleLoaderGenerator;

styl.type = 'style';

export default styl;


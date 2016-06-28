import {StyleLoader} from './Loader';

const css = function css
	( o:WPACK_OPTS.Loader
	)
	{

		return StyleLoader('css',['css'],'',o);

	} as WPACK_INTERNAL.StyleLoaderGenerator;

css.type = 'style'

export default css;
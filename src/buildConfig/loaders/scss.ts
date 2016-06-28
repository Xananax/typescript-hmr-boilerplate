import {StyleLoader} from './Loader';


const css = function scss
	( o:WPACK_OPTS.Loader
	)
	{
		
		const sassLoader = 
			[ 'sass-loader'
			, { outputStyle: o.isProd ? 'compressed':'expanded'}
			];

		return StyleLoader('scss',['scss','sass'],sassLoader,o);

	} as WPACK_INTERNAL.StyleLoaderGenerator;
css.type = 'style';

export default css;
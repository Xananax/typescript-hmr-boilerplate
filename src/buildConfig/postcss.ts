export default function postcss(types:WPACK_OPTS.LOADER_TYPE[]){

	const usesCSS = types.some(type=>type=='style');

	if(!usesCSS){return;}
	return ()=>
		[ require('autoprefixer')(
				{ browsers: [ 'last 2 versions' ]
				})
		]

}
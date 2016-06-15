const types = 
	[	[ /[jt]sx?|coffee/i
		, 'script' 
		]
	,	[ /css|s[ac]ss|less|styl|stylus/i
		, 'style' 
		]
	,	[ /png|jpe?g|bmp|gif|tiff|woff|woff2|ttf|ico/i
		, 'asset' 
		]	
	]

/**
 * takes an array of extensions and returns a generic type.
 * Used in `parseLoaders` to add a `type` property to loaders
 * This property does nothing, it's just useful for further processing
 * in case any is needed:
 * 
 * ```
 * 	config.loaders.forEach(function(loader){
 * 		if(loader.type == 'style'){
 * 		// do something
 * 		}
 * 	})
 * ```
 * @param  {string[]} exts an array of extensions (without leading dot)
 */
module.exports = function getLoaderType(exts){
	let j = exts.length;
	while(j--){
		const ext = exts[j];
		let i = types.length;
		while(i--){
			const [re,type] = types[i];
			const match = re.test(ext);
			if(match){
				return type;
			}
		}
	}
	return 'unknown';
}
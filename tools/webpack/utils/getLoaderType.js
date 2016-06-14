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
const qs = require('qs');

/**
 * @param  {Array} loaders a mixed array of strings or [string,query]
 * @return {string} a stringified loader
 */
module.exports = function combineLoaderLoaders(loaders){
	if(typeof loaders == 'string'){return loaders;}
	return loaders.map(function(loader){
		if(!loader){return;}
		if(typeof loader == 'string'){return loader;}
		const [name,query] = loader;
		if(!query){return name;}
		return `${name}?${JSON.stringify(query,{encode:false})}`;
	}).filter(Boolean).join('!');
}
const parseLoader = require('./parseLoader');


module.exports = function parseLoaders(CONSTS,loaders,extensions){
	const {DEV,PROD,LOADERS,SKIPLOADERS} = CONSTS;
	const allowed = LOADERS && LOADERS.split(',');
	const denied = SKIPLOADERS && SKIPLOADERS.split(',');
	return Object.keys(loaders).map(function(name){
		const loader = loaders[name];
		return parseLoader(CONSTS,name,loader,extensions,allowed,denied);
	}).filter(Boolean);
}
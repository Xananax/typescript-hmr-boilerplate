const parseLoader = require('./parseLoader');

/**
 * Takes an object of loaders as returned by `getLoaders`
 * and returns an array of loaders suitable for including in 
 * a webpack config object
 * @param  {object} CONSTS an object of options
 * @param  {Object} loaders an object of loaders
 * @param  {string[]} extensions an array of extensions to which append the extensions returned by the loaders
 */
module.exports = function parseLoaders(CONSTS,loaders,extensions){
	return Object.keys(loaders).map(function(name){
		const loader = loaders[name];
		return parseLoader(CONSTS,name,loader,extensions);
	}).filter(Boolean);
}
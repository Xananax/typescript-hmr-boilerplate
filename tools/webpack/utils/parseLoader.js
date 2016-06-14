const combineLoaderLoaders = require('./combineLoaderLoaders');
const getLoaderType = require('./getLoaderType');

/**
 * parseLoader(name[,extensions[,allowed[,denied]]])
 * 
 * Returns a webpack-suitable loader
 * @param  {Object} CONSTS an object that must contain 'DEV' and 'PROD' keys 
 * @param  {string} name name of the loder (used to determine if it should be skipped)
 * @param  {Object} loader an unparsed loader
 * @param  {string[]} extensions an array to append extensions the loader uses to
 * @param  {string[]} allowed
 * @param  {string[]} denied
 * @return {Object} a loader to tuck in a `loaders` array
 */
module.exports = function parseLoader(CONSTS,name,_loader,extensions,allowed,denied){

	if(!_loader || _loader.skip){return;}

	if(
		(allowed && allowed.length && allowed.indexOf(name) < 0) || 
		(denied && denied.length && denied.indexOf(name) >= 0)
	){
		return;
	}

	const {DEV,PROD} = CONSTS;
	const exts = _loader.extensions && _loader.extensions.slice();
	const loaders = _loader.loader.slice();
	const loader = Object.assign({},_loader,{extensions:exts});

	if(exts && exts.length){
		loader.test = _loader.test || new RegExp(`\\.(${exts.join('|')})$`);
		loader.type = _loader.type || getLoaderType(exts);
		extensions && exts.forEach(function(e){
			((extensions.indexOf(e) < 0) && extensions.push(`.${e}`));
		});
	}

	loader.loader = combineLoaderLoaders(loaders);
	
	return loader;
}
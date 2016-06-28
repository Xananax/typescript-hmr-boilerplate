import css from './css';
import fonts from './fonts';
import images from './images';
import js from './js';
import less from './less';
import scss from './scss';
import styl from './styl';
import ts from './ts';
import extend from 'extend';

export const loaders:{[name:string]:WPACK_INTERNAL.LoaderGenerator<any,any>} = 
	{ css
	, fonts
	, images
	, js
	, less
	, scss
	, styl
	, ts
	}

export const loadersArray:WPACK_INTERNAL.LoaderGenerator<any,any>[] = Object.keys(loaders).map(name=>loaders[name]);

export const loadersByType:{[name:string]:WPACK_INTERNAL.LoaderGenerator<any,any>[]} = {};
loadersArray.forEach(
	loader=>
		(loadersByType[loader.type] = loadersByType[loader.type] || []).push(loader)
)

export function getLoaderGeneratorByType(config:WPACK_OPTS.Modules,loaderType:string):WPACK_INTERNAL.Loader[]{
	if(!(loaderType in loadersByType)){return;}
	return loadersByType[loaderType].map(loader=>setLoader(config,loader));
}

export function getLoaderGeneratorByName(config:WPACK_OPTS.Modules,name:string):WPACK_INTERNAL.Loader[]{
	if(!(name in loaders)){return;}
	return [setLoader(config,loaders[name])]
}

export function getLoader(config:WPACK_OPTS.Modules,name:string){
	const loaders = getLoaderGeneratorByType(config,name) || getLoaderGeneratorByName(config,name);
	if(!loaders){
		throw new Error(`There is no configuration available for loader or loader type \`${name}\``);
	}
	return loaders;
}

export function setLoader(config:WPACK_OPTS.Modules,loaderGenerator:WPACK_INTERNAL.LoaderGenerator<any,any>):WPACK_INTERNAL.Loader{
	const {type,name} = loaderGenerator;
	const additionalOptions = extend(true,{},config[type],config[name]);
	const loader = loaderGenerator(config,additionalOptions);
	return loader;
}


export default function getLoadersArray(config:WPACK_OPTS.Modules):WPACK_INTERNAL.Loader[]{
	if(
		!config.loaders.length ||
		( 
			config.loaders.length == 1 &&
			(
				config.loaders[0] == '*' || config.loaders[0] == 'all'	
			)
		)
	){
		return loadersArray.map(loaderGenerator=>setLoader(config,loaderGenerator))
	}
	const loaders = 
		config.loaders.reduce
			( (ls,name) => 
				ls.concat( getLoader(config,name) )
			, []
			);

	return loaders;
}

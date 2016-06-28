import isString from '../../../utils/isString';
/**
 * @param  {Array} loaders a mixed array of strings or [string,query]
 * @return {string} a stringified loader
 */
export default function combineLoaders
	( loaders:string|Array<any[]|string>
	):string
	{
		if(isString(loaders)){return loaders;}
		else{
			return loaders.map(function(loader)
				{
					if(!loader){return '';}
					if(isString(loader)){return loader;}
					else{
						const [name,query] = loader;
						if(!query){return name;}
						const ret = `${name}?${JSON.stringify(query)}`;
						return ret;
					}
				}
			).filter(Boolean).join('!');
		}
	}
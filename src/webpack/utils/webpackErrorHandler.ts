import isBoolean from '../../utils/isBoolean';

export default function webpackErrorHandler(err?:Error,stats?:any,cb:(err?:Error)=>void|boolean){

	let doThrow = false;
	if(isBoolean(cb) && cb){
		doThrow = true;
		cb = null;
	}

	if(err){
		if(cb){
			return cb(err);
		}
		if(doThrow){
			throw err;
		}
		if(err instanceof Error){
			console.error(err.message);
		}else{
			console.error(err);
		}
		return;
	}

	const jsonStats = stats.toJson();

	if(jsonStats.errors.length > 0){
		jsonStats.errors.forEach(e=>console.error(e));
		if(cb){
			return cb(new Error(`webpack has errors`));
		}	
	}

	if(jsonStats.warnings.length > 0){
		jsonStats.warnings.forEach(e=>console.warn(e));
	}
	if(cb){
		return cb();
	}
}
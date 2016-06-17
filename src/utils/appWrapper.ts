interface Response{
	send(thing:any):this;
	status(num:number):this;
}

interface Request{
	url:string;
}

interface NodeBack{
	(err?:Error,val?:any):void;
}

interface RequestHandler{
	(req:Request,res:Response,next?:NodeBack):void;
}

interface ExpressUse{
	(path:string|RequestHandler,handler?:RequestHandler):this;
}

interface ExpressApp{
	(req:Request,res:Response,next?:NodeBack):void;
	use:ExpressUse;
	get:ExpressUse;
}

interface ExpressWrapperApp extends ExpressApp{
	swap(path:string,method:string,handler:RequestHandler):this;
}

const methods = ['get','use']

export default function appWrapper(expressApp:ExpressApp){

	const cache = {}

	function wrap(method:string,path:string,handler:RequestHandler){
		cache[method] = cache[method] || {};
		cache[method][path] = handler;
		return function(req,res,next){
			return cache[method][path](req,res,next);
		}
	}

	function swap(method:string,path:string|RequestHandler,handler?:RequestHandler){
		if(typeof path !== 'string'){
			handler = path as RequestHandler;
			path = '/';
		}
		const wrappedHandler = wrap(method,path as string,handler);  
		expressApp[method](path,handler);
		return this;
	}

	const wrapper:ExpressWrapperApp = function(req:Request,res:Response,next?:NodeBack):void{
		
	} as ExpressWrapperApp;

	methods.forEach(function(method){
		wrapper[method] = swap.bind(wrapper,method);
	});
	wrapper.swap = swap;

	return wrapper;

}
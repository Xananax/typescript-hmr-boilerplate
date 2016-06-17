/**
 * Returns a connect/express request handler that has a `swap` method
 * This swap method allows to change the internal request handler
 * 
 * It should be called at least once, as the handler will do nothing
 * without an internal handler
 * 
 * ```
 * const requestHandler = function(req,res,next){}
 * const swappableHandler = requestHandlerWrapper();
 * swappableHandler.swap(requestHandler);
 * ```
 * 
 */
export default function moduleWrapper(requestHandler?):RequestHandler{
	const conf = {
		requestHandler:requestHandler
	}
	const wrappedHandler:RequestHandler = <RequestHandler>function(req,res,next){
		if(!conf.requestHandler){return next();}
		return conf.requestHandler(req,res,next);
	}
	function swap(newRequestHandler){
		conf.requestHandler = newRequestHandler;
		return wrappedHandler;
	}
	wrappedHandler.swap = swap;
	return wrappedHandler;
}

interface RequestHandler{
	(req,res,next):void;
	swap(newRequestHandler):RequestHandler;
}
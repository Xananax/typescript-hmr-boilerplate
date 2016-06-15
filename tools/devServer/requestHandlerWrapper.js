module.exports = function requestHandlerWrapper(){
	const conf = {
		requestHandler:null
	}
	const wrappedHandler = function(req,res,next){
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
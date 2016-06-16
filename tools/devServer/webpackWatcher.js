function noOp(){};

/**
 * Creates a watcher for webpack
 * @param  {string} name a name to prepend to log output
 * @param  {webpack compiler} compiler
 * @param  {object} options an option of objects (must have been put through `makeWatcherOptions`)
 */
module.exports = function webpackWatcher(name,compiler,options){

	let state = false;
	let forceRebuild = false;
	let callbacks = [];
	let watching;

	function invalidPlugin()
		{
			if(state && (!options.noInfo && !options.quiet))
				{ 
					console.info(`${name}: bundle is now INVALID.`); 
				}
			state = false;
		}

	function invalidAsyncPlugin(compiler, callback)
		{
			invalidPlugin();
			callback();
		}

	function ready(fn, req)
		{
			if(state)
				{ return fn(); }
			if(!options.noInfo && !options.quiet)
				{ 
					console.log(`${name}: wait until bundle finished: ` + (req.url || fn.name)); 
				}
			callbacks.push(fn);
		}

	function rebuild()
		{
			if(state){
				state = false;
				compiler.run(function(err) {
					if(err) throw err;
				});
			} else {
				forceRebuild = true;
			}
		}

	function donePlugin(stats)
		{

			state = true;
			process.nextTick(()=>{
				if(!state)
					{ 
						return; 
					}
					
				var displayStats = (!options.quiet && options.stats !== false);

				if(	displayStats && 
					! (	stats.hasErrors() || 
						stats.hasWarnings()
					) && 
					options.noInfo
				){ displayStats = false; }

				if(displayStats) {
					console.log(stats.toString(options.stats));
				}
				if(!options.noInfo && !options.quiet){
					console.info(`${name}: bundle is now VALID.`);
				}

				console.info(`${name}: rebuilt`);
				const cbs = callbacks;
				callbacks = [];
				cbs.forEach(
					function continueBecauseBundleAvailable(cb){
						cb();
					}
				);
			});

			if(forceRebuild){
				forceRebuild = false;
				rebuild();
			}
		}

	compiler.plugin('done',donePlugin);
	compiler.plugin("invalid", invalidPlugin);
	compiler.plugin("watch-run", invalidAsyncPlugin);
	compiler.plugin("run", invalidAsyncPlugin);


	function watch(callback){
		callback = callback || noOp;
		if(watching && watching.running){
			callback();
		}else{
			ready(callback,{});
		}
		if(!options.lazy) {
			watching = compiler.watch(options.watchOptions,(err)=>{
				if(err){ throw err; }
			});
		} else {
			state = true;
		}
	}

	function waitUntilValid(callback) {
		callback = callback || noOp;
		if (!watching || !watching.running)
			{ callback(); }
		else
			{ ready(callback, {});}
	};

	function invalidate(callback) {
		callback = callback || noOp;
		if(watching) {
			ready(callback, {});
			watching.invalidate();
		} else {
			callback();
		}
	};

	function close(callback) {
		callback = callback || noOp;
		if(watching)
			{ watching.close(callback); }
		else 
			{ callback(); }
	};

	return {watch,waitUntilValid,invalidate,close,ready}
	
}
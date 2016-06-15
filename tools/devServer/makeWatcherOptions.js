/**
 * Returns options for the webpack watcher
 * Makes sure the options object exists and has the
 * necessary values set
 * @param  {object} options an optional options object
 */
module.exports = function makeWatcherOptions(options){
	if(!options)
		{ options = {}; }
	if(typeof options.watchOptions === "undefined")
		{ options.watchOptions = {}; }
	if(typeof options.watchOptions.aggregateTimeout === "undefined")
		{ options.watchOptions.aggregateTimeout = 200; }
	if(typeof options.stats === "undefined")
		{ options.stats = {}; }
	if(!options.stats.context)
		{ options.stats.context = process.cwd(); }
	if(options.lazy && typeof options.filename === "string")
		{
			const str = options.filename
				.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
				.replace(/\\\[[a-z]+\\\]/ig, ".+");
			options.filename = new RegExp("^[\/]{0,1}" + str + "$");
		}
	return options;
}
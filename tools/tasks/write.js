const err = new Error(`write needs a url param and a to param`);
module.exports = function write(params,CONSTS,next){
	if(
		!params ||
		(!('url' in params) || !('to' in params))
	){
		return next(err);
	}
}

module.exports.help = `
 usage: build url=/some/url to=./pages
 - writes a page to disk from a \`url\` to a destination \`to\`
`
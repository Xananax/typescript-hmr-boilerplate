const getConfig = require('../webpack/utils/getConfig');
const getOptions = require('../webpack/utils/getOptions');
const webpack = require('webpack');
const path = require('path');
const webpackErrorHandler = require('../webpack/utils/webpackErrorHandler');
const mkdirp = require('mkdirp');
const buildClient = require('./buildclient');
const fs = require('fs');
const err = new Error(`write needs a url param and a to param`);

module.exports = function write(params,_,next){

	if( !params || !('url' in params)){
		return next(err);
	}


	const SERVER_BUNDLE_NAME = 'writePage';

	const CONSTS = getOptions(
		{ SERVER_BUNDLE_NAME
		, BUILD_TYPE:'server'
		, ENV:'production'
		, PROD:true
		, DEV:false
		, SERVER_ENTRY:'utils/writePage.ts'
		}
	);
	const config = getConfig(CONSTS);

	const root_path = path.resolve(CONSTS.DIRS.ROOT,CONSTS.DIRS.DISTRIBUTION); 
	const server_bundle_path = path.resolve(root_path, CONSTS.OUT.SERVER, SERVER_BUNDLE_NAME)+'.js';

	const url = params.url;
	const to = path.join(
		root_path,(params.to || params.url).replace(/^\//,'').replace(/\.html?$/,'')+'.html'
	);
	const dirname = path.dirname(to);

	console.log(` -- write: will write page \`${url}\` to \`${to}\``);

	const compiler = webpack(config);

	buildClient(null,null,function(err,CONSTS){

		if(err){return next(err);}

		const static_dir = path.resolve(root_path,CONSTS.OUT.ASSETS)
		const style_file = path.resolve(root_path,CONSTS.OUT.STYLES)
		const client_file = path.resolve(root_path,CONSTS.OUT.CLIENT,CONSTS.CLIENT_BUNDLE_NAME)+'.js';
		const style_relative_path = CONSTS.RELATIVE.STYLE;
		const client_relative_path = CONSTS.RELATIVE.CLIENT;

		fs.readFile(style_file,{encoding:'utf8'},function(err,css){
			if(err){return next(err);}
			fs.readFile(client_file,{encoding:'utf8'},function(err,js){
				if(err){return next(err);}
				compilePage(function(err,filepath){
					if(err){return next(err);}
					fs.readFile(filepath,{encoding:'utf8'},function(err,html){
						const styleRegex = new RegExp(`<link rel="stylesheet" href="${style_relative_path}"/>`);
						const clientRegex = new RegExp(`<script src="${client_relative_path}"></script>`);
						const _html = html
							.replace(styleRegex,`<style>${css}</style>`)
							.replace(clientRegex,`<script>${js}</script>`)
						;
						fs.writeFile(filepath,_html,{encoding:'utf8'},function(err){
							if(err){return next(err);}
							clean(next);
						})
					});
				});
			})
		})
	})

	function clean(cb){
		cb();
	}

	function compilePage(cb){

		compiler.run(function(err, stats) {

			webpackErrorHandler(err,stats,true);

			const writePage = require(server_bundle_path).default;

			console.log(` -- write: page writer compiled by webpack`);

			mkdirp(dirname,function(err){

				if(err){
					return cb(err);
				}

				writePage(url,to,function(err,filepath){
					if(err){
						return cb(err);
					}
					console.log(` -- write: page written to \`${to}\``);
					return cb(null,filepath);
				},true)
			})

		});

	}
}

module.exports.help = `
 usage: build url=/some/url [to=./pages]
 - writes a page to disk from a \`url\` to a destination \`to\`
   \`to\` resolves to /some/url.html if not defined
`
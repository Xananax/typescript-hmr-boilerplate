const babelConfig = require('../webpack/pluginsConfigs').babel;
require('babel-register')(babelConfig);
const Page = require('../../src/components/Page/Page.jsx');
const ReactDOM = require('react-dom/server');
const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;
const getOptions = require('../webpack/utils/getOptions');
const options = require('../../config');
const CONSTS = getOptions(options);
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const doc = Page(
	{ stylesheets:['/css/app.css']
	}
);

const markup = renderToStaticMarkup(doc);
const dir = CONSTS.PATHS.DISTRIBUTION;
const file = dir+'/index.html';


mkdirp(dir,(err)=>{
	if(err){throw err;}
	console.log(`created distribution directory \`${dir}\``);
	fs.writeFile(file,markup,'utf8',(err)=>{
		if(err){throw err;}
		console.log(`written html file to \`${file}\``)
	});
})

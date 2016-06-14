//const babelConfig = require('./tools/webpack/pluginsConfigs/babel');
//require('babel-register')(babelConfig);
//require('./src/server.ts');
const getOptions = require('./tools/webpack/utils/getOptions');
const compileServer = require('./tools/devServer');

compileServer(getOptions({
	BUILD_TYPE:'server'
}))

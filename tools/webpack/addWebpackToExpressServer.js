const webpack = require('webpack');

const getConfig = require('./utils/getConfig');
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");


module.exports = function addWebpack(app,CONSTS){

	const webpackConfig = getConfig(CONSTS);

	const compiler = webpack(webpackConfig);

	app.use(webpackMiddleware(compiler,webpackConfig.devServer));
	app.use(webpackHotMiddleware(compiler));

	return app;

}
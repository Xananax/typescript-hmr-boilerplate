import http from 'http';
import express from 'express';
import path from 'path';
import API from './api';
import renderPage from './utils/renderPage';
import configureStore  from './store/configureStore';
import {routes} from './routes';
import {Page} from './components/Page';

const store = configureStore();
const PORT = process.env.PORT || __PORT__;
const static_path = path.resolve(__dirname,__STATIC_RELATIVE_DIR__);

const conf = 
	{ routes
	, Page
	};

const pageProps = {
	scripts:
		[ __JS_FILE__ ]
,	stylesheets: __DEV__ ? 
		[ __STYLE_FILE__.replace('app.ss','font-awesome.css')
		, __STYLE_FILE__.replace('app.css','bootstrap.min.css')
		] : 
		[ '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
		, '//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css'
		,  __STYLE_FILE__ 
		]
}

function routerRequestHandler(req,res,next){
	const url = req.url;
	renderPage(url,conf.routes,store,conf.Page,function(err,status,markup){

		if(err){return next(err);}

		res.status(status).send(markup);
		
	});

}

const APIHandler = __DEV__ ? require('./utils/moduleWrapper').default(API) : API;

export default function listen(devApp?,cb?){

	const app = express();

	if(__DEV__){
		app.use('/api',APIHandler);
		devApp && devApp.swap(routerRequestHandler);
		app.use(devApp);
	}else{
		app.use('/api',API);
		app.use(express.static(static_path));
		app.use(routerRequestHandler);
	}

	const server = http.createServer(app);

	server.listen(PORT,()=>{
		console.log(`listening on ${__URL__}`);
		cb && cb();
	});


	return server;
}

if(__DEV__){
	if(module.hot) {
		module.hot.accept(
			['./routes','./components/Page','./api']
		, ()=>{
			APIHandler.swap(require('./api').default);
			conf.Page = require('./components/Page').Page;
			conf.routes = require('./routes').routes;
		});
	}
}

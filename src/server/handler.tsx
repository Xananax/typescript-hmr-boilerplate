import renderPage from '../utils/renderPage';
import configureStore  from '../store/configureStore';

const store = configureStore();

let routes = require('../routes').routes;
let Page = require('../components/Page').Page;

const pageProps = {
	scripts:
		[ __JS_FILE__ ]
,	stylesheets: __DEV__ ? 
		[] : 
		[ __STYLE_FILE__ ]
}

export function requestHandler(req,res,next){
	const url = req.url;
	renderPage(url,routes,store,Page,function(err,status,markup){

		if(err){
			return next(err);
		}

		res.status(status).send(markup);
		
	});

}

if(module.hot) {
	module.hot.accept(
		['../routes','../components/Page']
	, ()=>{
		Page = require('../components/Page').Page;
		routes = require('../routes').routes;
	});
}
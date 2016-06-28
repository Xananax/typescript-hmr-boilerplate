import React from 'react';
import {RouterContext} from 'react-router';
import ReactDOM from 'react-dom/server';
import urlToRouterElement from './urlToRouterElement';
import { Provider } from 'react-redux';

const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;

const scripts = 
	[ __JS_FILE__ ]

const stylesheets = 
	[ '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
	, __PROD__ && __STYLE_FILE__ 
	].filter(Boolean);

const pageProps = {
	scripts
,	stylesheets
}

const head = `<!doctype html>
<!--[if lt IE 9]>
<script>(function(ef){window.console = window.console || {log:ef,warn:ef,error:ef,dir:ef};}(function(){}));</script>
<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-sham.js"></script>
<![endif]-->`

export default function renderPage(url,routes,store,Page,cb){
	
	urlToRouterElement(url,routes,function handler(err,status,renderProps){

		if(err){
			return cb(err);
		}

		const doc = (
			<Page {...pageProps}>
				<Provider store={store}>
					<RouterContext {...renderProps}/>
				</Provider>
			</Page>
		)
		const markup = renderToStaticMarkup(doc);
		cb(null,status,head+markup);
		
	})
}
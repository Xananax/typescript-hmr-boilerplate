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
		cb(null,status,markup);
		
	})
}
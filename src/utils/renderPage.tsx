import React from 'react';
import {RouterContext} from 'react-router';
import ReactDOM from 'react-dom/server';
import urlToRouterElement from './urlToRouterElement';
import { Provider } from 'react-redux';

const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;

const pageProps = {
	scripts:
		[ __JS_FILE__ ]
,	stylesheets: __DEV__ ? 
		[] : 
		[ __STYLE_FILE__ ]
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
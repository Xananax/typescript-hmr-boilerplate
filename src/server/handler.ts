import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import {match, RouterContext} from 'react-router';

let Page = require('../components/Page').Page;
let routes = require('../routes').routes;


const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;
//const renderToString = ReactDOM.renderToString;
//const addWebpackToExpressServer = require('../tools/webpack/addWebpackToExpressServer')

const app = express();

//addWebpackToExpressServer(app,CONSTS);


export function requestHandler(req, res, next)
	{
		match(
			{ routes
			, location: req.url 
			}
		,	(error, redirectLocation, renderProps) => {
				if (error) {
					res
						.status(500)
						.send(error.message);
				} else if (redirectLocation) {
					res.redirect(
						302
					, redirectLocation.pathname + redirectLocation.search
					);
				} else if (renderProps) {
				// You can also check renderProps.components or renderProps.routes for
				// your "not found" component or route respectively, and send a 404 as
				// below, if you're using a catch-all route.
					//res.status(200).send(renderToString(<RouterContext {...renderProps} />));
					const doc = __DEV__ ? React.createElement(Page) : React.createElement(Page,{ stylesheets:['/css/app.css'] });
					const markup = renderToStaticMarkup(doc);
					res.send(markup);
					//res.send('ok')
				} else {
					res
						.status(404)
						.send('Not found');
				}
			}
		);
	}

if(module.hot) {
	module.hot.accept(
		['../routes','../components/Page']
	, ()=>{
		Page = require('../components/Page').Page;
		routes = require('../routes').routes;
	});
}
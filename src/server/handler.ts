import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import {match, RouterContext} from 'react-router';

let Page = require('../components/Page').Page;
let routes = require('../routes').routes;


//const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;
const renderToString = ReactDOM.renderToString;
//const addWebpackToExpressServer = require('../tools/webpack/addWebpackToExpressServer')

const app = express();

//addWebpackToExpressServer(app,CONSTS);


app.use
	( (req, res, next)=>
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
						
						//const markup = renderToString(doc);
						//res.send(markup);
						res.send('oKKk')
					} else {
						res
							.status(404)
							.send('Not found');
					}
				}
			);
		}
	);

export {app};

if(module.hot) {
	module.hot.accept(
		['../routes','../components/Page']
	, ()=>{
		Page = require('../components/Page').Page;
		routes = require('../routes').routes;
	});
}
import React from 'react';
import ReactDOM from 'react-dom/server';
import {match, RouterContext} from 'react-router';

const renderToString = ReactDOM.renderToString;

export default function urlToRouterElement(url:string,routes:Object,cb:(err?:Error,status?:number,val?:any)=>void,attempts:number=0)
	{
		if(attempts > 100){
			return cb(new Error('too many redirects'));
		}
		match(
			{ routes: routes, location: url }
		,	function(error, redirectLocation, renderProps){
				if (error) {
					return cb(error);
				} else if (redirectLocation) {
					const _url = redirectLocation.pathname + redirectLocation.search;
					return urlToRouterElement(_url,routes,cb,attempts+1);
				} else if (renderProps) {
					const isNotFound = renderProps.routes.some((route)=>route.path == '404')
					const status = isNotFound ? 404 : 200;
					return cb(null,status,renderProps);
				}
				return cb();
			}
		);
	}

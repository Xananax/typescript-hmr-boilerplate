import React from 'react';
import HTMLDocument from 'react-html-document';
import ReactDOM from 'react-dom/server';
import assign from '../utils/assign';

export function Page(props){

	props = assign({
		scripts:[]
	,	stylesheets:[]
	,	metatags:[]
	,	description:false
	,	title:'test'
	},props)

	const {title,description} = props; 
	const scripts =
		[ '/js/vendor.bundle.js'
		, '/js/app.js'
		, ...props.scripts
		].filter(Boolean);
	const stylesheets =
		[ '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
		, ...props.stylesheets 
		].filter(Boolean);
	const metatags =
		[	{ charSet:'utf-8' }
		,	{name:'viewport'
			, content:'width=device-width, initial-scale=1.0'
			}
		,	description && 
			{ name: 'description'
			, content:description
			}
		,	...props.metatags
		].filter(Boolean);
	return (<HTMLDocument title={title} scripts={scripts} stylesheets={stylesheets} metatags={metatags}>
		<h1>Test</h1>
		<div id='Root'>
			{props && props.children}
		</div>
	</HTMLDocument>);
}
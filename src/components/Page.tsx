import React, {Children} from 'react';
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
		[ ...props.scripts
		].filter(Boolean);
	const stylesheets =
		[ ...props.stylesheets 
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

	const content = (props && props.children && Children.count(props.children) && props.children) || (<div>no content provided</div>);

	const body = (<div id="Wrapper">
		<h1>Tests(</h1>
		<div id='Root'>{content}</div>
	</div>)
	return (<HTMLDocument 
		title={title}
		scripts={scripts} 
		stylesheets={stylesheets} 
		metatags={metatags}
		>
		{body}	
	</HTMLDocument>);
}
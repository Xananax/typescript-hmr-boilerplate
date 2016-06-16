import React, {Children,Component,PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import assign from '../utils/assign';

const renderToString = ReactDOM.renderToString;
const renderToStaticMarkup = ReactDOM.renderToStaticMarkup;

interface StyleSheetObj{
	inline?:string;
	href?:string;
}

interface ScriptObj{
	src?:string;
	inline?:string;
}

type El = React.ReactElement<any>;
type validStyleSheet = StyleSheetObj | string;
type validScript = ScriptObj | string;

interface PagePropTypes{
	childrenContainerId?:string;
	htmlAttributes?:Object;
	children:El|El[];
	metatags?:any[];
	scripts:validScript[]
	state?:any;
	stateKey?:string;
	stylesheets?:validStyleSheet[];
	title?:string;
	description?:string;
}

const PagePropTypes = 
	{ childrenContainerId: PropTypes.string
	, htmlAttributes: PropTypes.object
	, metatags: PropTypes.array
	, scripts: PropTypes.array
	, state: PropTypes.object
	, stateKey: PropTypes.string
	, stylesheets: PropTypes.array
	, title: PropTypes.string
	, description: PropTypes.string
	};

const PageDefaultProps = 
	{ childrenContainerId:'Root'
	, htmlAttributes: {}
	, metatags: []
	, scripts: []
	, state: null
	, stateKey: '__state'
	, stylesheets: []
	, title: ''
	};

export function renderMetatags(metatags:any[]):El[]{
	return metatags && metatags.length && metatags.map((props, index) => <meta key={index} {...props} />);
}

export function renderLinkedStylesheet(href:string):El{
	return href && (
		<link key={href} rel="stylesheet" href={href} />
	);
}

export function renderInlineStyle(css:string):El{
	if(!css){return;}
	const cssHTML = { __html: css };
	return (
		<style key={css} dangerouslySetInnerHTML={cssHTML} />
	);
}

export function renderSourcedScript(props:any):El{
	return props && (<script {...props} />);
}

export function renderInlineScript(js:string):El{
	if(!js){return;}
	const scriptHTML = { __html: js };
	return (
		<script key={js} dangerouslySetInnerHTML={scriptHTML} />
	);
}

export function renderStylesheets(stylesheets:validStyleSheet[]):El[]{
	return stylesheets && stylesheets.length && stylesheets.map(props => {
		const linkProps = typeof props === 'string' ? { href: props } : props;
		const renderedTag = linkProps.inline ?
			renderInlineStyle(linkProps.inline) :
			renderLinkedStylesheet(linkProps.href);
		return renderedTag;
	});
}

export function renderState(state:any,stateKey:string):El{
	return state && (<div id={stateKey} data-state={JSON.stringify(state)} />);
}


export function renderUserScripts(scripts:validScript[]):El[]{
	return scripts && scripts.length && scripts.map(props => {
		const scriptProps = typeof props === 'string' ? { src: props } : props;
		const renderedTag = scriptProps.inline ?
			renderInlineScript(scriptProps.inline) :
			renderSourcedScript(scriptProps);
		return renderedTag;
	});
}

export function renderChildren(children:El|El[],childrenContainerId:string,hasState:boolean=false){
	if(!children){return;}
	const count = Children.count(children);
	if(!count){return null;}
	const _children:El = (count > 1) ? (<div>{children}</div>) : children as El;
	const markup = hasState ?
		renderToString(_children) :
		renderToStaticMarkup(_children);
	const childrenHTML = { __html: markup };
	return (
		<div key={childrenContainerId} id={childrenContainerId} dangerouslySetInnerHTML={childrenHTML} />
	);
}

export class Page extends Component<PagePropTypes,any>{

	static propTypes = PagePropTypes;
	static defaultProps = PageDefaultProps

	render(){
		const props = this.props;
		const 
			{ title
			, description
			, htmlAttributes
			, stylesheets
			, scripts
			, children
			, childrenContainerId
			, state
			, stateKey
			} = props;

		const hasState = !!state;
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

		return (
			<html {...htmlAttributes}>
				<head>
					<title>{title}</title>
					{ renderMetatags(metatags) }
					{ renderStylesheets(stylesheets) }
				</head>
				<body>
					{ renderChildren(children,childrenContainerId,hasState) }
					{ renderState(state,stateKey) }
					{ renderUserScripts(scripts) }
				</body>
			</html>
		);
		
	}
}
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

interface Schema{
	url?:string;
	type?:string;
	title?:string;
	image?:string;
	description?:string;
	siteName?:string;
	author?:string;
	publisher?:string;
}

const SchemaPropTypes = PropTypes.shape(
	{ url:PropTypes.string
	, type:PropTypes.string
	, title:PropTypes.string
	, image:PropTypes.string
	, description:PropTypes.string
	, siteName:PropTypes.string
	, author:PropTypes.string
	, publisher:PropTypes.string
	}	
)

interface PagePropTypes{
	childrenContainerId?:string;
	htmlAttributes?:any;
	children:El|El[];
	metatags?:any[];
	scripts:validScript[]
	state?:any;
	stateKey?:string;
	stylesheets?:validStyleSheet[];
	title?:string;
	appleTouchIcon?:string|boolean;
	googleAnalyticsUa?:string;
	lang?:string;
	chromeWebStoreId?:string;
	appleItunesApp?:{app_id:string,app_argument:string};
	sitemap?:string;
	schema?:Schema;
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
	, appleTouchIcon:PropTypes.oneOfType([PropTypes.bool,PropTypes.string])
	, googleAnalyticsUa:PropTypes.string
	, lang:PropTypes.string
	, chromeWebStoreId:PropTypes.string
	, appleItunesApp:PropTypes.shape({
			app_id:PropTypes.string
		,	app_argument:PropTypes.string
		})
	, sitemap:PropTypes.string
	, schema:SchemaPropTypes
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
	, appleTouchIcon:true
	, googleAnalyticsUa:''
	, lang:'en'
	, chromeWebStoreId:''
	, appleItunesApp:null
	, sitemap:''
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
	const cssHTML = innerHtml(css);
	return (
		<style key={css} dangerouslySetInnerHTML={cssHTML} />
	);
}

export function renderSourcedScript(props:any):El{
	if(!props){return null;}
	if(!props.key){props.key = props.src || `random_${Math.random()}`;}
	return (<script {...props} />);
}

export function renderInlineScript(js:string):El{
	if(!js){return;}
	const scriptHTML = innerHtml(js);
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

export function renderChildren(children:El|El[],childrenContainerId:string,hasState:boolean=false):El{
	if(!children){return;}
	const count = Children.count(children);
	if(!count){return null;}
	const _children:El = (count > 1) ? (<div>{children}</div>) : children as El;
	const markup = hasState ?
		renderToString(_children) :
		renderToStaticMarkup(_children);
	const childrenHTML = innerHtml(markup);
	return (
		<div key={childrenContainerId} id={childrenContainerId} dangerouslySetInnerHTML={childrenHTML} />
	);
}

export function renderAppleTouchIcon(appleTouchIcon:string|boolean):El{
	if(!appleTouchIcon){return null;}
	const appleTouchIconPath = (typeof appleTouchIcon == 'string') ? appleTouchIcon : 'apple-touch-icon.png';
	return  (<link rel="apple-touch-icon" href={appleTouchIcon}/>)
}

export function innerHtml(str:string):{__html:string}{
	return ({ __html: str });
}

export function renderGoogleAnalytics(ua:string):any[]{
	if(!ua){return null;}
	const googleCode = `window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;ga('create','UA-${ua}','auto');ga('send','pageview')`;
	const googleScript = 
		{ src:'https://www.google-analytics.com/analytics.js'
		, async:true
		, defer:true
		};

	return (
		[ renderInlineScript(googleCode)
		, renderSourcedScript(googleScript)
		]
	);
}

export function renderChromeWebStoreApp(app_id:string):El{
	if(!app_id){return null;}
	const href = `https://chrome.google.com/webstore/detail/${app_id}`;
	return (<link rel="chrome-webstore-item" href={href}/>);
}

export function renderAppleItunesApp(props?:{app_id:string,app_argument:string}):El{
	if(!props){return null;}
	const {app_id,app_argument} = props;
	const content = `app-id=${app_id},app-argument=${app_argument}`;
	return (<meta name="apple-itunes-app" content={content}/>)
}

export function renderSiteMapMetaTag(sitemap:string):El{
	if(!sitemap){return null;}
	return (<link rel="sitemap" type="application/xml" title="Sitemap" href={sitemap}/>)
}

export function renderSchema(schema:Schema):El[]{
	if(!schema){return null;}
	const meta = [];
	const {url,type,title,image,description,siteName,author} = schema;
	url && meta.push(
		<meta property="og:url" content={url} key="fburl"/>
	,	<meta name="twitter:url" content={url} key="twurl"/>
	);
	type && meta.push(
		<meta property="og:type" content={type} key="fbtype"/>
	);
	title && meta.push(
		<meta property="og:title" content={title} key="fbtitle"/>
	,	<meta name="twitter:title" content={title} key="twtitle"/>
	);
	image && meta.push(
		<meta property="og:image" content={image} key="fbimage"/>
	,	<meta name="twitter:image" content={image} key="twimage"/>
	,	<meta itemprop="image" content={image} key="scimage"/>	
	);
	description && meta.push(
		<meta property="og:description" content={description} key="fbdesc"/>
	,	<meta name="twitter:description" content={description} key="twdesc"/>
	,	<meta itemprop="description" content={description} key="scdesc"/>
	,	<meta name="description" content={description} key="desc"/>
	);
	siteName && meta.push(
		<meta property="og:site_name" content={siteName} key="fbname"/>
	,	<meta itemprop="name" content={siteName} key="scname"/>
	);
	author && meta.push(
		<meta property="article:author" content={author} key="fbauthor"/>
	,	<link rel="author" href={author} key="scauthor"/>
	);

	if(!meta.length){return null;}
	return meta;
	
}

export class Page extends Component<PagePropTypes,any>{

	static propTypes = PagePropTypes;
	static defaultProps = PageDefaultProps

	render(){
		const props = this.props;
		const 
			{ title
			, htmlAttributes
			, stylesheets
			, scripts
			, metatags
			, children
			, childrenContainerId
			, state
			, stateKey
			, appleTouchIcon
			, googleAnalyticsUa
			, lang
			, chromeWebStoreId
			, appleItunesApp
			, sitemap
			, schema
			} = props;

		const hasState = !!state;

		htmlAttributes.className = (htmlAttributes && htmlAttributes.className) ? htmlAttributes.className + ' no-js' : 'no-js';
		if(!htmlAttributes.lang){
			htmlAttributes.lang = 'en';
		}

		const _metaTags = (renderMetatags(metatags) || []).concat(renderSchema(schema));

		return (
			<html {...htmlAttributes}>
				<head>
					<meta charSet='utf-8'/>
					<title>{title}</title>
					<meta name="description" content=""/>
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					{ _metaTags }
					{ renderAppleItunesApp(appleItunesApp) }
					{ renderStylesheets(stylesheets) }
					{ renderSiteMapMetaTag(sitemap) }
					{ renderChromeWebStoreApp(chromeWebStoreId) }
					{ renderAppleTouchIcon(appleTouchIcon) }
				</head>
				<body>
					{ renderChildren(children,childrenContainerId,hasState) }
					{ renderState(state,stateKey) }
					{ renderUserScripts(scripts) }
					{ renderGoogleAnalytics(googleAnalyticsUa) }
				</body>
			</html>
		);
		
	}
}
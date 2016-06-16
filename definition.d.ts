/// <reference path="./typings/index.d.ts" />

declare namespace __DOMHTMLDOC {
	
}

declare module 'react-html-document' {	
	export default class HTMLDocument extends __React.Component<any,any>{} 
}

declare module 'redux-slider-monitor' {
	export default class SliderMonitor extends __React.Component<any,any>{}
}

declare var __DEV__:boolean;
declare var __CLIENT__:boolean;
declare var __DEV__:boolean;
declare var __PROD__:boolean;
declare var __DEBUG__:boolean;
declare var __CLIENT__:boolean;
declare var __SERVER__:boolean;
declare var __PORT__:number;
declare var __URL__:string;
declare var __HOT_PORT__:number;
declare var __HOT_URL__:string;
declare var __HOSTNAME__:string;
declare var __STYLE_FILE__:string;
declare var __JS_FILE__:string;
declare var __FONTS_DIR__:string;
declare var __IMAGES_DIR__:string;
declare var __STATIC_RELATIVE_DIR__:string;

interface Window{
	devToolsExtension:Function;
}

interface NodeModule{
	hot:{
		accept:Function;
	}
}
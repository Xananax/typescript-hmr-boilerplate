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

interface Window{
	devToolsExtension:Function;
}

interface NodeModule{
	hot:{
		accept:Function;
	}
}
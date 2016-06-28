import './styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {match} from 'react-router';
import { Router , browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';
import {routes} from './routes';

const store = configureStore();

const conf = {routes};

let DevTools = __DEV__ ? require('./components/DevTools').default : false;


function render(store,renderProps){
	ReactDOM.render(
		<Provider store={store}>
			<div id="Wrapper">
				<Router {...renderProps} />
				{ DevTools && <DevTools /> }
			</div>
		</Provider>
	, 	document.getElementById('Root')	
	);
}

match(
	{ history:browserHistory
	, routes:conf.routes 
	}
,	(error, redirectLocation, renderProps) => render(store,renderProps)
);

if(module.hot) {
	module.hot.accept("./routes",()=>{
		conf.routes = require("./routes").routes;
	});
}
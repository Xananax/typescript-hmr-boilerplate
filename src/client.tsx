import './styles/styles.scss';

import {match, browserHistory} from 'react-router';
import configureStore  from './store/configureStore';

const store = configureStore();
let routes = require('./routes').routes;

const render =__DEV__ ? 
	require('./client/client.dev').default : 
	require('./client/client.prod').default
;

match(
	{ history:browserHistory
	, routes 
	}
,	(error, redirectLocation, renderProps) => render(store,renderProps)
);

if(module.hot) {
	module.hot.accept("./routes",()=>{
		routes = require("./routes").routes;
	});
}
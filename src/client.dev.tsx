import React from 'react';
import { Router, browserHistory } from 'react-router';
import {routes} from './routes';
import DevTools from './containers/DevTools';

export default (
	<div>
		<Router history={browserHistory} routes={routes} />
		<DevTools />
	</div>
);
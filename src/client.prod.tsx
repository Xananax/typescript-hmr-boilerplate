import React from 'react';
import { Router, browserHistory } from 'react-router';
import {routes} from './routes';


export default (
	<div>
		<Router history={browserHistory} routes={routes} />
	</div>
);
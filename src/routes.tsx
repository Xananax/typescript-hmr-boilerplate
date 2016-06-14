import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import {App} from './components/App';
import FriendListApp from './containers/FriendListApp';
import InfoFetcherApp from './containers/InfoFetcherApp';
import NotFoundView from './views/NotFoundView';

export const routes = (
	<Route path="/" component={App}>
		<IndexRoute component={FriendListApp} />
		<Route path="friendsList" component={FriendListApp}/>
		<Route path="info" component={InfoFetcherApp}/>
		<Route path="404" component={NotFoundView} />
		<Redirect from="*" to="404" />
	</Route>
);


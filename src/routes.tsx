import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import {App} from './components/App';
import FriendListApp from './components/FriendList/FriendListApp';
import InfoFetcherApp from './components/InfoFetcher/InfoFetcherApp';
import PageNotFound from './components/PageNotFound';

export const routes = (
	<Route path="/" component={App}>
		<IndexRoute component={FriendListApp} />
		<Route path="friendsList" component={FriendListApp}/>
		<Route path="info" component={InfoFetcherApp}/>
		<Route path="404" component={PageNotFound} />
		<Redirect from="*" to="404" />
	</Route>
);


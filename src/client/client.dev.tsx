import React from 'react';
import ReactDOM from 'react-dom';
import {match} from 'react-router';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import DevTools from '../containers/DevTools';


export default function render(store,renderProps){
	ReactDOM.render(
		<Provider store={store}>
			<div id="Wrapper">
				<Router {...renderProps} />
				<DevTools />
			</div>
		</Provider>
	, 	document.getElementById('Root')	
	);
}
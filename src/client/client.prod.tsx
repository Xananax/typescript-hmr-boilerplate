import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

export default function render(store,renderProps){
	ReactDOM.render(
		<Provider store={store}>
			<Router {...renderProps} />
		</Provider>
	, 	document.getElementById('Root')	
	);
}
import './styles/bootstrap.min.css';
import './styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';

const store = configureStore();

const Comp = __DEV__ ? 
	require('./client.dev').default : 
	require('./client.prod').default
;

// Render the React application to the DOM
ReactDOM.render
	(
		(
			<Provider store={store}>
				{Comp}
			</Provider>
		)
	,	document.getElementById('Root')
	);

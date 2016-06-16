import { createStore, applyMiddleware, compose } from 'redux';
import {reducer as rootReducer} from '../reducers';
import thunk from 'redux-thunk';
import { persistState } from 'redux-devtools';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import DevTools from '../containers/DevTools';
import getDebugSessionKey from './getDebugSessionKey';

export default function getStore(initialState?:any){

	const enhancer = compose
		( applyMiddleware
			( reduxImmutableStateInvariant()
			, thunk
			)
		//, getDevTools()
		, DevTools.instrument()
		, persistState(getDebugSessionKey()
		)
	);

	const store = createStore
		( rootReducer
		, initialState
		, enhancer
		);

	if(module.hot){
		module.hot.accept
			( '../reducers'
			, () => store.replaceReducer(require('../reducers').default)
			);
	}

	return store;
}

function windowDevToolsAvailable(){
	return (typeof window === 'object' && typeof window.devToolsExtension !== 'undefined')
}

function getDevTools(){
	return (windowDevToolsAvailable() ? window.devToolsExtension() : DevTools.instrument());
}
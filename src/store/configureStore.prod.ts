import { createStore, applyMiddleware, compose } from 'redux';
import {reducer as rootReducer} from '../reducers';
import thunk from 'redux-thunk';

export default function getStore(initialState?:any){

	const enhancer = compose
		( applyMiddleware()
		, <any>thunk
		);

	const store = createStore
		( rootReducer
		, initialState
		, enhancer
		);
	
	return store;
}